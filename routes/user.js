var express = require('express')
var router = express.Router()
var nodemailer = require("nodemailer")
var User = require('../models/user')
// var session = require('express-session')
var checkHost = require('../middlewares/check').checkHost
var emailList = {}

let transporter = nodemailer.createTransport({
  host: 'smtp.qq.com',
  port: 465,
  secure: true, // secure:true for port 465, secure:false for port 587
  auth: {
    user: 'snailgames@qq.com',
    pass: 'hkwhiixhsvlweghd'
  }
})
let mailOptions = {
  from: '"吃什么 👻" <snailgames@qq.com>', // sender address
  to: '', // list of receivers
  subject: '【吃什么】邮箱验证', // Subject line
  text: '', // plain text body
  html: '' // html body
}
/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource')
})
router.post('/sendEmail', checkHost, function (req, res, next) {
  var email = req.query.email,
    emailCode = Math.random() * 900000 | 100000
  if (email) {
    mailOptions.to = email
    mailOptions.html = '您的邮箱验证码为<b style="font-size: 20px;margin: 0 10px;">' + emailCode + '</b>'
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return console.log(error)
      }
      emailList[email] = emailCode
      res.send({
        msgcode: 1,
        msg: '邮箱验证码发送成功'
      })
    })
  } else {
    res.send({
      msgcode: 1006,
      msg: '邮箱验证码发送失败'
    })
  }
})
router.post('/verifyEmail', checkHost, function (req, res, next) {
  var code = req.query.code,
    email = req.query.email
  if (code && email && emailList[email] == code) {
    res.send({
      msgcode: 1,
      msg: '邮箱验证成功'
    })
  } else {
    res.send({
      msgcode: 1007,
      msg: '邮箱验证失败'
    })
  }
})
// router.get('/exist', checkHost, function (req, res, next) {
//   var username = req.query.username
//   User.exist(username).then(function (result) {
//     if (!result) {
//       res.send({
//         msgcode: 1,
//         msg: '该账号未被注册'
//       })
//     } else {
//       res.send({
//         msgcode: 1010,
//         msg: '该账号已被注册'
//       })
//     }
//   }).catch(function (err) {
//     res.send({
//       msgcode: 1010,
//       msg: err.message,
//     })
//   })
// })
router.post('/register', checkHost, function (req, res, next) {
  var options = req.body,
    username = options.username
  User.exist(username).then(function (result) {
    if (!result) {
      // res.send({
      //   msgcode: 1,
      //   msg: '该账号未被注册'
      // })
      User.create(options).then(function (result) {
        if (result) {
          res.send({
            msgcode: 1,
            msg: '注册成功'
          })
        } else {
          res.send({
            msgcode: 1011,
            msg: '注册失败'
          })
        }
      }).catch(function (err) {
        res.send({
          msgcode: 1011,
          msg: err.message,
        })
      })
    } else {
      res.send({
        msgcode: 1010,
        msg: '该账号已被注册'
      })
    }
  }).catch(function (err) {
    res.send({
      msgcode: 1010,
      msg: err.message,
    })
  })
})
router.get('/checkLogin', checkHost, function (req, res, next) {
  console.log(req.session)
  var username = req.session.username,
    isLogin = req.session.isLogin
  if (!!isLogin) {
    res.send({
      msgcode: 1,
      msg: '已登录',
      username: username
    })
  } else {
    res.send({
      msgcode: 1014,
      msg: '未登录'
    })
  }
})
router.post('/login', checkHost, function (req, res, next) {
  var options = req.body,
    username = options.username,
    pwd = options.pwd
  User.exist(username).then(function (result) {
    if (!result) {
      res.send({
        msgcode: 1012,
        msg: '该账号不存在'
      })
    } else {
      console.log(result)
      if (result.pwd != pwd) {
        res.send({
          msgcode: 1013,
          msg: '密码错误'
        })
      } else {
        req.session.username = username
        req.session.isLogin = true
        req.session.userId = result._id
        res.send({
          msgcode: 1,
          msg: '登录成功'
        })
      }
    }
  }).catch(function (err) {
    res.send({
      msgcode: 1013,
      msg: err.message,
    })
  })
})
router.post('/logout', checkHost, function (req, res, next) {
  req.session.destroy(function (err) {
    if (err) {
      res.send({
        msgcode: 1015,
        msg: '退出失败',
      })
    } else {
      res.clearCookie("username", {})
      res.clearCookie("userId", {})
      res.cookie("isLogin", "false")
      res.send({
        msgcode: 1,
        msg: '退出成功',
      })
    }
  })
})
router.post('/like', checkHost, function (req, res, next) {
  var options = req.body,
    id = options.id
  console.log(req.session)
  if (!req.session.isLogin) {
    return res.send({
      msgcode: 1014,
      msg: '未登录'
    })
  }
  User.like(req.session.username, id).then(function (result) {
    if (result) {
      res.send({
        msgcode: 1,
        msg: '收藏成功'
      })
    } else {
      res.send({
        msgcode: 1016,
        msg: '收藏失败'
      })
    }
  }).catch(function (err) {
    res.send({
      msgcode: 1016,
      msg: err.message,
    })
  })
})
router.post('/getLike', checkHost, function (req, res, next) {
  if (!req.session.isLogin) {
    return res.send({
      msgcode: 1014,
      msg: '未登录'
    })
  }
  User.getLike(req.session.username).then(function (result) {
    if (result.like.length) {
      res.send({
        msgcode: 1,
        msg: '获取收藏列表成功',
        likeList: result.like
      })
    } else {
      res.send({
        msgcode: 1017,
        msg: '该用户没有任何收藏'
      })
    }
  }).catch(function (err) {
    res.send({
      msgcode: 1017,
      msg: err.message,
    })
  })
})
module.exports = router

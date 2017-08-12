var express = require('express')
var router = express.Router()
var nodemailer = require("nodemailer")
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
router.post('/sendEmail', function (req, res, next) {
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
router.post('/verifyEmail', function (req, res, next) {
  var code = req.query.code,
    email = req.query.email
  console.log(emailList)
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
module.exports = router

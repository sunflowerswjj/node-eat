var express = require('express')
var router = express.Router()
var Dish = require('../models/dish')
var checkHost = require('../middlewares/check').checkHost
router.post('/', checkHost, function (req, res, next) {
    Dish.getDish(req.query).then(function (result) {
        if (!result.length) {
            res.send({
                msgcode: 1001,
                msg: '没有菜肴'
            })
        } else {
            res.send({
                msgcode: 1,
                msg: '获取成功',
                dishList: result
            })
        }
    })
})
router.post('/add', checkHost, function (req, res, next) {
    var options = req.query
    Dish.create(options).then(function (result) {
        res.send({
            msgcode: 1,
            msg: '成功添加菜肴',
            dishInfo: result
        })
    }).catch(function (err) {
        res.send({
            msgcode: 1003,
            msg: err.message,
        })
    })
})
router.post('/count', checkHost, function (req, res, next) {
    Dish.getDishCount().then(function (result) {
        res.send({
            msgcode: 1,
            msg: '获取成功',
            count: result
        })
    })
})
router.post('/random', checkHost, function (req, res, next) {
    var count = req.query.count
    if (!count) {
        return res.send({
            msgcode: 1005,
            msg: '缺少随机数量参数'
        })
    }
    Dish.randomDish(count).then(function (result) {
        res.send({
            msgcode: 1,
            msg: '获取成功',
            dishList: result
        })
    }).catch(function (err) {
        res.send({
            msgcode: 1005,
            msg: err.message,
        })
    })
})
router.post('/delete', checkHost, function (req, res, next) {
    var id = req.query.id
    if (!id) {
        res.send({
            msgcode: 1004,
            msg: '无效的id'
        })
    }
    Dish.delete(id).then(function (result) {
        res.send({
            msgcode: 1,
            msg: '删除成功',
            dishInfo: result
        })
    }).catch(function (err) {
        res.send({
            msgcode: 1004,
            msg: err.message,
        })
    })
})
module.exports = router
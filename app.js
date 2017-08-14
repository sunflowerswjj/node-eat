var path = require('path')
var express = require('express')
var config = require('./config')
var routes = require('./routes')
var winston = require('winston')
var session = require('express-session')
var bodyParser = require('body-parser')
var cookieParser = require('cookie-parser')
var expressWinston = require('express-winston')
var pkg = require('./package')
var app = express()
app.use(session({
    secret: "zhaohd",
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 14 * 24 * 60 * 60 * 1000 }
}))
app.use(function (req, res, next) {

    res.header('Access-Control-Allow-Credentials', true)
    res.header("Access-Control-Allow-Headers", "Content-Type,Content-Length, Authorization, Accept,X-Requested-With")
    res.header('Access-Control-Allow-Methods', "PUT,POST,GET,DELETE,OPTIONS")
    if (req.method == "OPTIONS") res.send(200);/*让options请求快速返回*/
    else next()
})
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cookieParser())
// 正常请求的日志
app.use(expressWinston.logger({
    transports: [
        new (winston.transports.Console)({
            json: true,
            colorize: true
        }),
        new winston.transports.File({
            filename: 'logs/success.log'
        })
    ]
}))
// 路由
routes(app)
// 错误请求的日志
app.use(expressWinston.errorLogger({
    transports: [
        new winston.transports.Console({
            json: true,
            colorize: true
        }),
        new winston.transports.File({
            filename: 'logs/error.log'
        })
    ]
}))

app.listen(config.port, "0.0.0.0", function () {
    console.log(`${pkg.name} listening on port ${config.port}`)
})
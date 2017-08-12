var path = require('path')
var express = require('express')
var config = require('./config')
var routes = require('./routes')
var winston = require('winston')

var expressWinston = require('express-winston')
var pkg = require('./package')
var app = express()
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
app.listen(config.port, function () {
  console.log(`${pkg.name} listening on port ${config.port}`)
})

var subDirectory = require('../config').subDirectory

module.exports = function (app) {
  app.get(subDirectory + '/', function (req, res) {
    res.send('hello')
  })
  app.use(subDirectory + '/user', require('./user'))
  app.use(subDirectory + '/dish', require('./dish'))
}

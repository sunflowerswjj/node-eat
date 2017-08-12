module.exports = function (app) {
  app.get('/', function (req, res) {
    res.send('hello')
  })
  app.use('/user', require('./user'))
  app.use('/dish', require('./dish'))
}

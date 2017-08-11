var mongoose = require('mongoose')
var config = require('../config')
var Schema = mongoose.Schema
var db = mongoose.connection

mongoose.connect(config.mongodb)
db.on('error', console.error.bind(console, 'connection error:'))
db.on('open', function() {
  var userSchema = Schema({
    nickname: { first: String, last: String },
    date: { type: Date, default: Date.now },
    password: { type: String },
    avatar: { type: String, default: 'https://ws1.sinaimg.cn/large/b9691c2dgy1ficl10isxaj20jr0jr40m.jpg' },
    gender: { type: String }
  })
  userSchema.virtual('fullname').get(function() {
    return this.nickname.first + ' ' + this.nickname.last
  })
  userSchema.methods.speak = function() {
    console.log('my name is: ' + this.fullname)
  }
  var User = mongoose.model('User', userSchema)
  var zhaohd = new User({ nickname: { first: 'zhao', last: 'hd' }, password: '1111' })
  zhaohd.save(function(err, zhaohd) {
    if (err) return console.error(err)
    console.log(zhaohd)
  })
})
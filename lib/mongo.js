var mongoose = require('mongoose')
var config = require('../config')
var Schema = mongoose.Schema
mongoose.connect(config.mongodb)
const db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error:'))
db.on('open', function () {
    console.log('successful connection')
})
var userSchema = Schema({
    name: String,
    nickname: String,
    phone: Number,
    qq: Number,
    date: { type: Date, default: Date.now },
    password: { type: String },
    avatar: { type: String, default: 'https://ws1.sinaimg.cn/large/b9691c2dgy1ficl10isxaj20jr0jr40m.jpg' },
    gender: { type: String }
})
var dishSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    pic: String,
    date: { type: Date, default: Date.now },
    taste: { type: Number, default: 4 },//1 酸 2 甜 3 辣 4 鲜
    meat: { type: Boolean, default: false },//默认素食
    time: { type: Number, default: 2 }//1 早餐 2 午餐 3 晚餐
})
module.exports.User = mongoose.model('User', userSchema)
module.exports.Dish = mongoose.model('Dish', dishSchema)
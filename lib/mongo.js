var mongoose = require('mongoose')
var config = require('../config')
var Schema = mongoose.Schema
mongoose.connect(config.mongodb)
const db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error:'))
db.on('open', function () {
    console.log('successful connection')
})
var dishSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    pic: String,
    date: { type: Date, default: Date.now },
    taste: { type: String, default: "4" }, //1 酸 2 甜 3 辣 4 鲜
    meat: { type: String, default: "0" }, //0 半荤半素 1 主荤 2 主素
    time: { type: String, default: "0" }, //0 不限 1 早餐 2 午餐 3 晚餐
    rate: [Number],
    liker: [{ type: Schema.Types.String, ref: 'User' }]
})
dishSchema.virtual('rateAvg').get(function () {
    var len = this.rate.length,
        sum = this.rate.reduce(function (pre, cur) {
            return cur + pre
        })
    return sum / len
})
var userSchema = Schema({
    realname: String,
    username: {
        type: String,
        required: true,
        index: true
    },
    pwd: {
        type: String,
        required: true
    },
    phone: String,
    qq: String,
    email: String,
    verifyPhone: { type: Boolean, default: false },
    verifyEmail: { type: Boolean, default: false },
    date: { type: Date, default: Date.now },
    avatar: { type: String, default: 'https://ws1.sinaimg.cn/large/b9691c2dgy1ficl10isxaj20jr0jr40m.jpg' },
    gender: { type: String },
    like: [{ type: Schema.Types.ObjectId, ref: 'Dish' }]
})
// mongoose.model('Dish', dishSchema).create({ name: 'gg', taste: '1', pic: 'gg', meat: '0', time: '0' })
module.exports.User = mongoose.model('User', userSchema)
module.exports.Dish = mongoose.model('Dish', dishSchema)
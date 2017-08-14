var User = require('../lib/mongo').User
var Dish = require('../lib/mongo').Dish
module.exports = {
    exist: function (username) {
        return User.findOne({ username: username })
    },
    create: function (options) {
        return User.create(options)
    },
    like: function (username, id) {
        User.update({
            username: username
        }, { $push: { like: id } }, null, function (err) {
            if (err) {
                return false
            }
        })
        return Dish.update({ _id: id }, { $push: { liker: username } })
    },
    getLike: function (username) {
        return User.findOne({ username: username }).populate('like').exec()
    }
}
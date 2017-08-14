var Dish = require('../lib/mongo').Dish
module.exports = {
    getDish: function (query) {
        return Dish.find(query)
    },
    getDishCount: function () {
        return Dish.count()
    },
    create: function (options) {
        return Dish.create(options)
    },
    delete: function (id) {
        return Dish.remove({ _id: id })
    },
    randomDish: function (count) {
        return Dish.aggregate({ $sample: { size: parseInt(count) } }).exec()
    },
    getLiker: function (id) {
        return User.findOne({ _id: id }).populate('liker', 'username').exec()
    }
}
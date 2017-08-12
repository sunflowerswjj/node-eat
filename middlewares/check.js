module.exports = {
    checkLogin: function (req, res, next) {
        if (!req.session.user) {
            res.send({
                msgcode: 1002,
                msg: '没有登录'
            })
        }
        next()
    },
    checkHost: function (req, res, next) {
        next()
    }
}
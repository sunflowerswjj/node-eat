// 判断origin是否在域名白名单列表中
function isOriginAllowed(origin, allowedOrigin) {
    if (Array.isArray(allowedOrigin)) {
        for (let i = 0; i < allowedOrigin.length; i++) {
            if (isOriginAllowed(origin, allowedOrigin[i])) {
                return true;
            }
        }
        return false;
    } else if (typeof (allowedOrigin) == 'string') {
        return origin === allowedOrigin;
    } else if (allowedOrigin instanceof RegExp) {
        return allowedOrigin.test(origin);
    } else {
        return !!allowedOrigin;
    }
}
const ALLOW_ORIGIN = [ // 域名白名单
    'http://127.0.0.1:8080',
    'http://119.23.220.40:443',
    'http://zhaohaodang.com',
]
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
        let origin = req.headers.origin
        if (req.method == "OPTIONS") res.send(200) /*让options请求快速返回*/
        if (isOriginAllowed(origin, ALLOW_ORIGIN)) {
            res.header('Access-Control-Allow-Origin', origin)
            next()
        } else {
            return res.send({
                msgcode: 1008,
                msg: '非法请求'
            })
        }
    }
}
const User = require('../models/user')

exports.isAdmin = async (req,res,next) => {
    if (req.cookies.refreshToken) {
        res.locals.auth = 'true'
        const user = await User.findOne({token: req.cookies.refreshToken}).exec()
        if (user == null) {
            res.locals.isAdmin = null
        } else {
            if (user.isAdmin == true) res.locals.isAdmin = 'true'
            if (user.isAdmin == false) res.locals.isAdmin = 'false'
        }
    }else{
        res.locals.auth = 'false'
    }
    next()
}
exports.selectLang = (req,res,next) => {
    if (req.cookies.lang) {
        const lang = req.cookies.lang
        const dir = req.cookies.dir
        if (lang != null) {
            res.locals.lang = lang
            res.locals.dir = dir
            next()
        } else res.redirect('/')
    } else res.cookie('lang','default'),res.redirect('/')
}
const jwt = require('jsonwebtoken')
const User = require('../models/user')

exports.admin = async(req,res,next)=>{
    if (req.cookies && req.user){
        const token = req.cookies.refreshToken
        if ( token == null) return res.redirect('/')
        const user = req.user
        try {
            const userData = await User.find({token: token}).exec()
            if ( userData[0].isAdmin == false) return res.redirect('/')
            next()   
        } catch{
            res.redirect('/')
        }
    }
}

exports.noAuth = (req,res,next) => {
    if (req.cookies){
        const token = req.cookies.token
        if ( token != null) return res.cookie('error','err-0100'),res.redirect('/')
        next()
    }
}

exports.token = (req,res,next)=>{
    if (req.cookies){
        const token = req.cookies.token
        if ( token == null && req.cookies.refreshToken == null) return res.redirect('/')
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user)=>{
            if (err) {
                res.cookie('reqlink',`${req.originalUrl}`)
                res.redirect('/o/token')
            } else {
                req.user = user
                next()
            }
        })
    }
}
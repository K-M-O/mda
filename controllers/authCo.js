// all modules.

const User = require('../models/user')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

// get controllers

exports.getAuthLogIn = (req,res) => {
    res.render('auth/login')
}

exports.getAuthSignUp = (req,res) => {
    res.render('auth/signup')
}

exports.getAuthToken = (req,res) => {
    res.render('auth/token')
}

exports.getAuthLogOut = (req,res) => {
    res.render('auth/logout')
}

exports.postAuthLogInCheckEmpty = (req, res, next) => {
    if (req.body.nId == null || req.body.nId == '') return res.redirect('/o/login')
    if (req.body.password == null || req.body.passsword == '') return res.redirect('/o/login')
    next()
}

exports.postAuthLogInCheckData = async(req,res,next) => {
    const user = await User.find({nId: req.body.nId}).exec()
    if (typeof user === 'object' || typeof user === Array){
    if (user.length != 1) return res.redirect('/o/login')
    } else if (user[0] == null) return res.redirect('/o/login')
    if (req.body.password.length <= 7) return res.redirect('/o/login')
    req.user = user
    next()
}

exports.postAuthLogInCompleted = async (req,res) => {
    var user = req.user
    try {
        bcrypt.compare(req.body.password, user[0].password, async(err, result)=>{
            if (err) return res.redirect('/o/login')
            if (result) {
                const token = genreateAccessToken({username: user[0].nId})
                const refreshToken = jwt.sign({username: user[0].nId}, process.env.REFRESH_TOKEN_SECRET)
                user[0].token = refreshToken
                user[0].save()
                res.cookie('token',`${token}`,{maxAge: 10*60*1000})
                res.cookie('refreshToken',`${refreshToken}`,{maxAge: 24*60*60*1000})
                res.redirect('/')
                req.user = user
            } else return res.redirect('/o/login')
        })
    } catch {
        res.redirect('/')
    }
}

exports.postAuthToken = (req,res)=>{
    const refreshToken = req.cookies.refreshToken
    const link = req.cookies.reqlink
    if (refreshToken == null) return res.redirect('/o/login')
    if (link == null || link == undefined) return res.redirect('/')
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
    if (err) return
    const token = genreateAccessToken({ username : user})
    res.cookie('token',`${token}`,{maxAge: 10*60*1000})
    res.clearCookie('reqlink')
    res.redirect(`${link}`)
    })
}

exports.postAuthSignUpCheckEmpty = (req, res,next) => {
    if ( req.body.nId == null || req.body.nId === '') return res.redirect('/o/signup')
    if ( req.body.password == null || req.body.password === '') return res.redirect('/o/signup')
    if ( req.body.password.length < 7) return res.redirect('/o/signup')
    next()
}

exports.postAuthSignUpCheckExsit = async (req, res,next) => {
    try {
        const checkUsers = await User.find({nId : req.body.nId})
        if (checkUsers.length > 0) return res.redirect('/o/signup')
        req.encryptedPassword = await bcrypt.hash(req.body.password, 10)
        res.redirect('./login')
        next()
    } catch {
        res.redirect('/o/signup')
    }
}

exports.postAuthSignUpCreateUser = async (req, res) => {
    try {
        const user = new User({
            nId: req.body.nId,
            password: req.encryptedPassword,
        })
        req.newUser = await user.save()
        res.redirect('/o/signin')
    } catch {
        res.redirect('/o/signup')
    }
}

// delete controllers.

exports.deleteAuthLogOut = async (req, res)=>{
    try {
        const user = await User.find({token: req.cookies.refreshToken}).exec()
        req.cookies.refreshToken
        if (user.length != 0){
            user[0].token = ``;
            user[0].save()
        }
        res.clearCookie('refreshToken')
        res.clearCookie('token')
        res.redirect('/o/login')
    } catch {
        res.redirect('/')
    }
}
// JWT token Genreator.

function genreateAccessToken(user) {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '10m'})
}
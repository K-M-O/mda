// all modules.

const User = require('../models/user')
// controllers.

exports.getAdminPanel = async (req,res) => {
    const users = await User.find({}).exec()
    res.render('admin/adminPanel',{users:users})
}

exports.getAdminReports = async (req,res) => {
    res.render('admin/reports',{type:req.params.type})
}

exports.deleteUser = async (req,res) => {
    const user = await User.findById(req.params.id).exec()
    if (user.length != 0){
        user.remove()
        res.redirect('/a/adminPanel')
    } else {
        res.redirect('/')
    }
}
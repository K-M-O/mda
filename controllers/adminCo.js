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
        const report = await new Report({
            title: 'user removed',
            action: `user ${user.nId} have been removed`,
            reportedBy: `me`,
            reportType: 'authReport'
        })
        report.save()
        user.remove()
        res.redirect('/a/adminPanel')
    } else {
        res.cookie('error','err-3400')
        res.redirect('/a/adminpanel')
    }
}
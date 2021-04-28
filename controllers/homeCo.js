// all modules.

const Document = require('../models/document')
const Image = require('../models/image')

// controller.
exports.getAll = (req,res)=>{
    res.render('all',{name:req.params.name})
}
exports.checkQuery = (req,res,next)=>{
    res.render('home')
}
// all modules.

const Document = require('../models/document')
const Image = require('../models/image')
const User = require('../models/user')
const imageMimeTypes = ['image/jpeg', 'image/png']

// controllers.

exports.getDoucment = async (req,res) => {
    try {
        const token = req.cookies.refreshToken
        const document = await Document.findById(req.params.id).exec()
        const images = await Image.find({owner: req.params.id}).exec()
        var params = {}
        if (token != null && token != undefined) {
            const user = await User.find({token: token}).exec()
            params.checkAdmin = user[0].isAdmin
        } else {
            params.checkAdmin = undefined
        }
        if (document == null || document == undefined){
        }
        params.document = document
        params.images = images
        params.type = 'document'
        params.id = document.id
        res.render('documents/show', params)
    } catch {
    }
}

exports.getDocumentManage = (req,res) => {
    res.render('documents/modify',{type:req.params.type,id:req.params.id})
}

exports.getNewDocument = (req, res) => {
    res.render('documents/modify',{type:req.params.type,id:req.params.id})
}

exports.postCreateDocument = async (req, res,next) => {
    if (req.body.name == null || req.body.name === '') {
        res.redirect('/d/new/document?message=this document dont have a name')
    }
    if (req.body.description == null || req.body.description === '') {
        res.redirect('/d/new/document?message=this document dont have a name')
    }
    if (req.body.pubat == null || req.body.pubat === '') {
        res.redirect('/d/new/document?message=this document dont have publish date')
    }
    if (req.body.folder == null || req.body.folder === '') {
        res.redirect('/d/new/document?message=this document dont have  folder')
    }
    if (req.body.col == null || req.body.col === '') {
        res.redirect('/d/new/document?message=this document dont have collection')
    }
    if (req.body.archive == null || req.body.folder === '') {
        res.redirect('/d/new/document?message=this document dont have archive')
    }
    const document = new Document({
        name: req.body.name,
        description: req.body.description,
        publishedAt: req.body.pubat,
        folder: req.body.folder,
        col: req.body.col,
        archive: req.body.archive,
        barCode: `${req.body.civilization}-${req.body.period}-nan`,
        keywords:{
            publisher: req.body.publisher,
            period: req.body.period,
            civilization: req.body.civilization,
            location: req.body.location,
            value: req.body.value,
            font: req.body.font,
            classification: req.body.classification,
            form: req.body.form,
            digital: req.body.digital,
        }
    })
    let newDocument = await document.save()
    newDocument.barCode = `${req.body.civilization}-${req.body.period}-${newDocument.id}`
    newDocument = await newDocument.save()
    req.newDocument = newDocument
    next()
}

exports.postCreateDocumentSaveImages = async (req, res) => {
    try {
        var newDocument = req.newDocument
        if (typeof req.body.images === 'object'){
            let images = req.body.images
            images = images.reverse()
            var checkMain = false,i = 0
            images.forEach(async function(imageCode) {
                i++
                try {
                    if (i == 1) checkMain = true
                    else checkMain = false
                    saveImage(new Image(),imageCode,newDocument.id,checkMain)
                } catch{
                    res.redirect('/d/new/document?message=couldnt save image 1')
                }
            })
        } else {
            let imageCode = req.body.images
            saveImage(new Image(),imageCode,newDocument.id,true)
        }
        res.redirect(`/d/show/${newDocument.id}`)
    } catch (err){
        console.log(err);
        res.redirect('/d/new/document?message=couldnt save image 2')
    }
}
exports.postUpdateDocument = async(req, res) => {
    try {
        const document = await Document.findById(req.params.id).exec()
        const image = await Image.findOne({owner: req.params.id}).exec()
        if (req.body.name) document.name = req.body.name
        if (req.body.description) document.description = req.body.description
        if (req.body.pubat) document.publishedAt = req.body.pubat
        if (req.body.folder) document.folder = req.body.folder
        if (req.body.col) document.name = req.body.name
        if (req.body.archive) document.archive = req.body.archive
        if (req.body.publisher) document.keywords.publisher = req.body.publisher
        if (req.body.period) document.keywords.period = req.body.period
        if (req.body.civilization) document.keywords.civilization = req.body.civilization
        if (req.body.classification) document.keywords.classification = req.body.classification
        if (req.body.font) document.keywords.font = req.body.font
        if (req.body.form) document.keywords.form = req.body.form
        if (req.body.location) document.keywords.location = req.body.location
        if (req.body.value) document.keywords.value = req.body.value
        if (req.body.digital) document.keywords.digital = req.body.digital
        await document.save()
        if (req.body.images){
            const cover = JSON.parse(req.body.images)
            image.image = new Buffer.from(cover.data, 'base64')
            image.imageType = cover.type
            await image.save()
        }
        res.redirect(`/d/show/${document.id}`)
    } catch {
    }
}

exports.postDeleteDocument = async(req, res) => {
    const document = await Document.findById(req.params.id).exec()
    const image = await Image.findOne({owner: req.params.id}).exec()
    await image.remove
    await document.remove()
    res.redirect('/')
}

async function saveImage(image, coverEncoded, documentId, main) {
    try {
        if (coverEncoded == null) return res.redirect('/d/new/document?message=couldnt save image 3')
        const cover = JSON.parse(coverEncoded)
        if (cover != null && imageMimeTypes.includes(cover.type)) {
            image.image = new Buffer.from(cover.data, 'base64')
            image.imageType = cover.type
            image.owner = documentId
            image.main = main
            await image.save()
        } else {
            res.redirect('/d/new/document?message=couldnt save image 4')
        }
    } catch{
        res.redirect('/d/new/document?message=couldnt save image 5')
    }
}
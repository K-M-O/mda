// all modules.

const Document = require('../models/document')
const Image = require('../models/image')

// controller.
exports.getAll = (req,res)=>{
    res.render('all',{name:req.params.name})
}
exports.checkQuery = (req,res,next)=>{
    if (req.query.ser){
        let query = Document.find().sort({ createdAt: 'desc' })
        var from,to,keywords = {}
        if (!req.query.from || !req.query.to){
            from = null
            to = null
        } else {
            from = req.query.from
            to = req.query.to
            from = from.split('-')
            to = to.split('-')
        }
        if (!req.query.keys){
            keywords = {}
        } else {
            req.query.keys.split(';').forEach(key=>{
                if (key.indexOf(':') > -1){
                    keywords[key.split(':')[0]] = key.split(':')[1]
                }
            })
        }
        req.query = query
        req.from = from
        req.to = to
        req.keywords = keywords
        next()
    } else {
        res.render('home',{search: false})
    }
}
exports.filterOne = async (req,res,next)=>{
    var query = req.query
    query = query.regex('name', new RegExp(req.query.ser, 'i'))
    var names = await query.exec()
    query = query.regex('folder', new RegExp(req.query.ser, 'i'))
    var folders = await query.exec()
    query = query.regex('col', new RegExp(req.query.ser, 'i'))
    var collections = await query.exec()
    query = query.regex('archive', new RegExp(req.query.ser, 'i'))
    var archive = await query.exec()
    query = query.regex('description', new RegExp(req.query.ser, 'i'))
    var descriptions = await query.exec()
    var arrays = [names,folders,collections,archive,descriptions]
    req.arrays = arrays
    next()
}
exports.filterTwo = (req,res,next)=>{
    var arrays = req.arrays
    var nxt = 0,results = {}
    function arrs(arr){
        var i = 0
        nxt ++
        arr.forEach(item=>{
            i ++
            if (results[item.id] == undefined) {
                results[item.id] = {name:item.name,keywords:item.keywords,pubat:item.publishedAt}
            }
            if (i == arr.length){
                if (nxt < 5){
                    arrs(arrays[nxt])
                } else {
                    convert(results)
                }
            }
        })
    }
    arrs(arrays[nxt])
    function convert(obj){
        var filteredResults = Object.keys(obj).map((key)=>[key,obj[key]])
        req.filteredResults = filteredResults
        next()
    }
}
exports.filterThree = (req,res,next)=>{
    var preResults = req.filteredResults
    var from = req.from,to = req.to
    var filteredResults = [],i = 0
    if (from == null || to == null){
        req.filteredResults = preResults
        next()
    } else {
        preResults.forEach(res=>{
            i ++
            var date = res[1].pubat.getFullYear()+'-' + (res[1].pubat.getMonth()+1) + '-'+res[1].pubat.getDate();
            var splitDate = date.split('-')
            if (parseInt(to[0]) >= parseInt(splitDate[0]) && parseInt(splitDate[0]) >= parseInt(from[0])){
                if (parseInt(to[1]) >= parseInt(splitDate[1]) && parseInt(splitDate[1]) >= parseInt(from[1])){
                    if (parseInt(to[2]) >= parseInt(splitDate[2]) && parseInt(splitDate[2]) >= parseInt(from[2])){
                        filteredResults[filteredResults.length] = res
                    }
                }
            }
            if (i == preResults.length){
                req.filteredResults = filteredResults
                next()
            }
        })
    }
}
exports.filterFour = (req,res,next)=>{
    var preResults = req.filteredResults
    var keywords = req.keywords
    var prekeys = Object.keys(keywords).map((key)=>[key,keywords[key]])
    var finalResults = {}
    if (prekeys.length != 0){
        var i = 0
        preResults.forEach(res=>{
            i ++
            prekeys.forEach(key=>{
                if (res[1].keywords[key[0]].indexOf(key[1]) > -1){
                    if (finalResults[res[0]] == undefined){
                        finalResults[res[0]] = res
                    }
                }
            })
            if (i == preResults.length){
                req.filteredResults = finalResults
                next()
            }
        })
    } else {
        req.filteredResults = preResults
        next()
    }
}
exports.filterFive = async (req,res)=>{
    finalResult(req.filteredResults)
    function finalResult(results){
        var thrresults = Object.keys(results).map(key=>[results[key]])
        var i = 0
        thrresults.forEach(resu=>{
            i++
            if (i < thrresults.length){
                addResult(resu[0][0],thrresults.length)
            }
        })
    }
    var searchResults = []
    async function addResult(id,i){
            const document = await Document.findById(id).exec()
            let image = await Image.find({owner: id}).exec()
            try {
                if (document != null && image.length != 0){
                    searchResults[searchResults.length] = [document.id,document.name,image[0].imagePath]
                    if (i-searchResults.length <= 1){
                        res.render('home',{search: true,results:searchResults,count:searchResults.length})
                    }
                }else {
                    searchResults[searchResults.length] = [document.id,document.name,null]
                    if (i-searchResults.length <= 1){
                        res.render('home',{search: true,results:searchResults,count:searchResults.length})
                    }
                }
            } catch {
            }
    }
}
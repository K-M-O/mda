// all modules.

const { Collection } = require('mongoose')
const Document = require('../models/document')
const Image = require('../models/image')

// controller.
exports.getAll = (req,res)=>{
    res.render('all',{name:req.params.name})
}
exports.home  = async(req,res)=>{
    if (req.query.ser){
        let query = Document.find().sort({ createdAt: 'desc' })
        var from,to,keywords = {},results = {}
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
        var arrays = [names,folders,collections,archive,descriptions],next = 0
        function arrs(arr){
            var i = 0
            next ++
            arr.forEach(item=>{
                i ++
                if (results[item.id] == undefined) {
                    results[item.id] = {name:item.name,keywords:item.keywords,pubat:item.publishedAt}
                }
                if (i == arr.length){
                    if (next < 5){
                        arrs(arrays[next])
                    } else {
                        convert(results)
                    }
                }
            })
        }
        arrs(arrays[next])
        function convert(obj){
            var filteredResults = Object.keys(obj).map((key)=>[key,obj[key]])
            dateFilter(filteredResults)
        }
        function dateFilter(preResults){
            var filteredResults = [],i = 0
            if (from == null || to == null){
                keywordsFilter(preResults)
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
                        keywordsFilter(filteredResults)
                    }
                })
            }
        }
        function keywordsFilter(preResults){
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
                        finalResult(finalResults)
                    }
                })
            } else {
                finalResult(preResults)
            }
        }
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
                let document = await Document.findById(id).exec()
                let image = await Image.findOne({owner: id}).exec()
                searchResults[searchResults.length] = [document.id,document.name,image.imagePath]
                if (i-searchResults.length <= 1){
                    res.render('home',{search: true,results:searchResults,count:searchResults.length})
                }
        }
    } else {
        res.render('home',{search: false})
    }
}
var Document = require('./models/document')
var Image = require('./models/image')
exports.quer = (socket)=>{
    socket.on('queue', async queKeys=>{
        console.log('here');
        try {
            let query = Document.find().sort({ createdAt: 'desc' })
            var from,to,keywords = {},results = {}
            if (queKeys.from == '' || queKeys.to == ''){
                from = null
                to = null
            } else {
                from = queKeys.from
                to = queKeys.to
                from = from.split('-')
                to = to.split('-')
            }
            if (queKeys.keys == ''){
                keywords = {}
            } else {
                queKeys.keys.split('%3B').forEach(key=>{
                    if (key.indexOf('%3A') > -1){
                        keywords[key.split('%3A')[0]] = key.split('%3A')[1]
                    }
                })
            }
            var qinput = ''
            queKeys.ser.split('').forEach(letter=>{
                if(letter.match(/[ a-zA-Z]/)){
                    qinput += letter
                }else if (letter === '+'){
                    qinput += " "
                }
            })
            
            query = query.regex('name', new RegExp(qinput, 'i'))
            var names = await query.exec()
            query = query.regex('folder', new RegExp(qinput, 'i'))
            var folders = await query.exec()
            query = query.regex('col', new RegExp(qinput, 'i'))
            var collections = await query.exec()
            query = query.regex('archive', new RegExp(qinput, 'i'))
            var archive = await query.exec()
            query = query.regex('description', new RegExp(qinput, 'i'))
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
                        console.log('there');
                        socket.emit('queue',searchResults)
                    }
            }
        } catch (error) {
            console.log(error);
        }
    })
}
var Document = require('./models/document')
const image = require('./models/image')
var Image = require('./models/image')
const io = require('./server')
var done = false
exports.quer = (socket)=>{
    socket.on('queue', queKeys=>{
        socket.emit('loading',true)
        processStart(queKeys)
    })
}
async function processStart(queKeys){
    let query = Document.find().sort({ createdAt: 'desc' })
    var from,to,keywords = {},results = {}
    if (queKeys.from == '' || queKeys.to == ''){
        from = null
        to = null
    } else {
        from = queKeys.from
        to = queKeys.to
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
    if (qinput != null && qinput != '') {
        query = query.regex('name', new RegExp(qinput, 'i'))
    }
    var que = await query.exec()
    var results = [],i = 0
    if ( que.length != 0){
        que.forEach(async function(production) {
            i ++
            let cover = await Image.findOne({owner: production.id}).exec()
            if (cover != null){
                results[results.length] = [production.id,production.name,cover.imagePath]
            }else{
                results[results.length] = [production.id,production.name,'/images/icons/noImage.jpg']
            }
            if (results.length == que.length){
                io.emit('loading',false)
                recieveResult(results)
            }
        })
    } else {
        io.emit('loading',false)
        recieveResult(results)
    }
}
var results
function recieveResult(ress){
    results = ress
}
exports.results =(socket)=>{
    socket.on('request',check=>{
        if (check){
            socket.emit('results',results)
        }
    })
}
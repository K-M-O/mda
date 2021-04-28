if (window.location.search !== ''){
    var socket = io()
    document.title = `MDA | Loading`
    document.querySelectorAll('.noResults')[0].style.display = 'none'
    document.querySelectorAll('.results')[0].style.display = 'grid'
    document.querySelectorAll('.results .loading')[0].style.display = 'grid'
    var query = window.location.search
    var queKeys = {}
    query.split('?')[1].split("&").forEach(que=>{
        que = que.split("=")
        queKeys[que[0]] = que[1]
    })
    socket.emit('queue',queKeys)
} else {
    document.title = `Modern Digital Archive`
    document.querySelectorAll('.noResults')[0].style.display = 'grid'
    document.querySelectorAll('.results')[0].style.display = 'none'
    document.querySelectorAll('.results .loading')[0].style.display = 'none'
}
socket.on('queue',results=>{
    if (results.length != 0){
        document.title = `MDA | (${results.length})`
        document.querySelectorAll('.results .loading')[0].style.display = 'none'
        var o = document.querySelectorAll('.results')[0]
        results.forEach(result=>{
            var d = document.createElement('div')
            d.classList.add('result')
            var a = document.createElement('a')
            a.href = `/d/show/${result[0]}`
            var img = document.createElement('img')
            img.src = `${result[2]}`
            var h2 = document.createElement('h2')
            h2.innerText = `${result[1]}`
            var d2 = document.createElement('div')
            d2.classList.add('border')
            a.appendChild(img)
            a.appendChild(h2)
            d.appendChild(a)
            d.appendChild(d2)
            o.appendChild(d)
        })
    }
})

var loc = 0,keywords = '',i = 0
document.querySelectorAll('.dataListener')[0].addEventListener('wheel',(e)=>{
    loc += (e.deltaY * document.querySelectorAll('.scroller')[0].clientHeight) / document.querySelectorAll('.content')[0].clientHeight
    if (e.deltaY > 0){
        if (loc >= 200) {
            document.querySelectorAll('.homeForm')[0].style.gridTemplateRows = "60px 1fr"
            document.querySelectorAll('.homeForm img')[0].style.display = "none"
            document.querySelectorAll('.homeForm .searcharea')[0].classList.add('fixed')
        }
    } else if (e.deltaY < 0){
        if (loc <= 0 && document.querySelectorAll('.dataListener')[0].scrollTop <= 200) {
            document.querySelectorAll('.homeForm')[0].style.gridTemplateRows = "500px 1fr"
            document.querySelectorAll('.homeForm img')[0].style.display = "block"
            document.querySelectorAll('.homeForm .searcharea')[0].classList.remove('fixed')
        }
    }
})
if ("ontouchstart" in window){
    document.querySelectorAll('.dataListener')[0].addEventListener('touchend',e=>{
        loc = document.querySelectorAll('.dataListener')[0].scrollTop
            if (loc >= 200) {
                document.querySelectorAll('.homeForm')[0].style.gridTemplateRows = "60px 1fr"
                document.querySelectorAll('.homeForm img')[0].style.display = "none"
                document.querySelectorAll('.homeForm .searcharea')[0].classList.add('fixed')
            } else if (loc <= 0 && document.querySelectorAll('.dataListener')[0].scrollTop <= 200) {
                document.querySelectorAll('.homeForm')[0].style.gridTemplateRows = "500px 1fr"
                document.querySelectorAll('.homeForm img')[0].style.display = "block"
                document.querySelectorAll('.homeForm .searcharea')[0].classList.remove('fixed')
            }
    })
    document.querySelectorAll('.dataListener')[0].addEventListener('touchstart',e=>{
        loc = document.querySelectorAll('.dataListener')[0].scrollTop
            if (loc >= 200) {
                document.querySelectorAll('.homeForm')[0].style.gridTemplateRows = "60px 1fr"
                document.querySelectorAll('.homeForm img')[0].style.display = "none"
                document.querySelectorAll('.homeForm .searcharea')[0].classList.add('fixed')
            } else if (loc == 0) {
                document.querySelectorAll('.homeForm')[0].style.gridTemplateRows = "500px 1fr"
                document.querySelectorAll('.homeForm img')[0].style.display = "block"
                document.querySelectorAll('.homeForm .searcharea')[0].classList.remove('fixed')
            }
    })
    document.querySelectorAll('.dataListener')[0].addEventListener('touchmove',e=>{
        loc = document.querySelectorAll('.dataListener')[0].scrollTop
            if (loc >= 200) {
                document.querySelectorAll('.homeForm')[0].style.gridTemplateRows = "60px 1fr"
                document.querySelectorAll('.homeForm img')[0].style.display = "none"
                document.querySelectorAll('.homeForm .searcharea')[0].classList.add('fixed')
            } else if (loc == 0) {
                document.querySelectorAll('.homeForm')[0].style.gridTemplateRows = "500px 1fr"
                document.querySelectorAll('.homeForm img')[0].style.display = "block"
                document.querySelectorAll('.homeForm .searcharea')[0].classList.remove('fixed')
            }
    })
}
function add(){
    var keyword = document.querySelectorAll('.homeForm .searcharea .searchFilter .keywords select')[0].value
    var value = document.querySelectorAll('.homeForm .searcharea .searchFilter .keywords #val')[0].value
    if (keyword !== '' && keyword != null) {
        i ++
        if (value !== '' && value != null) {
            keywords += `${keyword}:${value};`
            document.querySelectorAll('.homeForm .searcharea .searchFilter .keywords select')[0].value = ''
            document.querySelectorAll('.homeForm .searcharea .searchFilter .keywords #val')[0].value = ''
            document.querySelectorAll('.homeForm .searcharea .searchFilter .keywords button')[0].innerText = `add K:${i}`
            document.querySelectorAll('.homeForm .searcharea .searchFilter .keywords #keys')[0].value = keywords
        } else {
        alert('You have to give the value of this keyword first')
        }
    } else {
        alert('You have to select a keyword first')
    }
}
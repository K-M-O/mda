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
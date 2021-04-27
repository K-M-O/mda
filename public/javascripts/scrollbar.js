var x = ((window.innerHeight -50) * document.querySelectorAll('.scroller')[0].clientHeight) /document.querySelectorAll('.content')[0].clientHeight
document.getElementsByClassName('position')[0].style.height = `${x}px`

var pressing = false,curr;

document.querySelectorAll('.position')[0].addEventListener('mousedown',(e)=>{
    pressing = true
    curr = e.pageY
    document.querySelectorAll('.scrollblock')[0].style.display = 'grid'
    document.querySelectorAll('.scroller')[0].classList.add('hover')
    document.querySelectorAll('.position')[0].classList.add('hover')
})
document.querySelectorAll('.scrollblock')[0].addEventListener('mousemove',(e)=>{
    if (pressing) {
        if (e.pageY < curr){
            var curMargin = document.querySelectorAll('.position')[0].offsetHeight - document.querySelectorAll('.position')[0].clientHeight
            var p = document.querySelectorAll('.position')[0]
            var style = p.currentStyle || window.getComputedStyle(p)
            curMargin = parseInt(style.marginTop.split('px')[0],10)
            curMargin += e.pageY-curr
            if (curMargin > 0) {
                document.querySelectorAll('.position')[0].style.marginTop = `${curMargin}px`
                document.querySelectorAll('.dataListener')[0].scrollTop = (curMargin * document.querySelectorAll('.content')[0].clientHeight)/document.querySelectorAll('.scroller')[0].clientHeight
            } else {
                document.querySelectorAll('.position')[0].style.marginTop = `0px`
                document.querySelectorAll('.dataListener')[0].scrollTop = 0
            }
        }else if (e.pageY > curr){
            var curMargin = document.querySelectorAll('.position')[0].offsetHeight - document.querySelectorAll('.position')[0].clientHeight
            var p = document.querySelectorAll('.position')[0]
            var style = p.currentStyle || window.getComputedStyle(p)
            curMargin = parseInt(style.marginTop.split('px')[0],10)
            curMargin += e.pageY-curr
            if (document.querySelectorAll('.scroller')[0].clientHeight - document.querySelectorAll('.position')[0].clientHeight - curMargin >= 0) {
                document.querySelectorAll('.position')[0].style.marginTop = `${curMargin}px`
                document.querySelectorAll('.dataListener')[0].scrollTop = (curMargin * document.querySelectorAll('.content')[0].clientHeight)/document.querySelectorAll('.scroller')[0].clientHeight
            } else {
                curMargin = document.querySelectorAll('.scroller')[0].clientHeight - document.querySelectorAll('.position')[0].clientHeight
                document.querySelectorAll('.position')[0].style.marginTop = `${curMargin}px` - 1
                document.querySelectorAll('.dataListener')[0].scrollTop = document.querySelectorAll('.content')[0].clientHeight
            }
        }else if (e.pageY == curr){
        }
    } else {
    }
})
document.querySelectorAll('.scrollblock')[0].addEventListener('mouseup',()=>{
    pressing  = false
    document.querySelectorAll('.scrollblock')[0].style.display = 'none'
    document.querySelectorAll('.scroller')[0].classList.remove('hover')
    document.querySelectorAll('.position')[0].classList.remove('hover')
})
var loc = 0,time = 0
document.querySelectorAll('.dataListener')[0].addEventListener('wheel',(e)=>{
    loc += (e.deltaY * document.querySelectorAll('.scroller')[0].clientHeight) / document.querySelectorAll('.content')[0].clientHeight
    if (e.deltaY > 0){
        if (document.querySelectorAll('.scroller')[0].clientHeight - loc - document.querySelectorAll('.position')[0].clientHeight > 0) {
            document.querySelectorAll('.position')[0].style.marginTop = `${loc}px`
            if (time == 0){
                setTimeout(remove,2000)
                time = 1
            }
        } else {
            loc = document.querySelectorAll('.scroller')[0].clientHeight - document.querySelectorAll('.position')[0].clientHeight - 1
            document.querySelectorAll('.position')[0].style.marginTop = `${loc}px`
            if (time == 0){
                setTimeout(remove,666)
                time = 1
            }
        }
    } else if (e.deltaY < 0){
        if (loc > 0) {
            document.querySelectorAll('.position')[0].style.marginTop = `${loc}px`
            if (time == 0){
                setTimeout(remove,2000)
                time = 1
            }
        } else {
            loc = 0
            document.querySelectorAll('.position')[0].style.marginTop = `0px`
            if (time == 0){
                setTimeout(remove,666)
                time = 1
            }
        }
    }
    document.querySelectorAll('.scroller')[0].classList.add('hover')
    document.querySelectorAll('.position')[0].classList.add('hover')
})
function remove(){
    document.querySelectorAll('.scroller')[0].classList.remove('hover')
    document.querySelectorAll('.position')[0].classList.remove('hover')
    time = 0
}
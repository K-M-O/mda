document.querySelectorAll('.menuBlock')[0].addEventListener('click',()=>{
    if (!itemInUse) menuAnimation()
})
document.querySelectorAll('.innerMenu')[0].addEventListener('mouseover',()=>{
    itemInUse = true
})
document.querySelectorAll('.innerMenu')[0].addEventListener('mouseout',()=>{
    itemInUse = false
})
document.querySelectorAll('.menuItem')[0].addEventListener('click',()=>{
})
function menuAnimation(){
    document.querySelectorAll('.menu')[0].style.zIndex = '10000'
    document.querySelectorAll('.menuBlock')[0].classList.toggle('fade')
    setTimeout(done,400)
    function done(){
        if (document.querySelectorAll('.menuBlock')[0].classList.contains('fade')){
            document.querySelectorAll('.menu')[0].style.zIndex = '10000'
            document.querySelectorAll('.navMenuBtn')[0].attributes['src']['value'] = '/images/icons/close.svg'
        } else {
            document.querySelectorAll('.menu')[0].style.zIndex = '-1'
            document.querySelectorAll('.navMenuBtn')[0].attributes['src']['value'] = '/images/icons/menu.svg'
        }
    }
}
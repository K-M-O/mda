var app = document.getElementById('app')
const setSize = (width,height) => {
    if (height <= 341){
        alert('this device is not supported!')
    }
    if (width <= 230){
        alert('this device is not supported!')
    }
    app.style.width = `${width}px`
    app.style.height = `${height}px`
}
setSize(window.innerWidth,window.innerHeight)
window.onresize = ()=> {
    setSize(window.innerWidth,window.innerHeight)
}
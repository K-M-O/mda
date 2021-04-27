document.querySelectorAll('.adminPanelList .item').forEach(item=>{
    item.addEventListener('click',e=>{
        displayOption(item.id)
        document.querySelectorAll('.adminPanelList .item').forEach(items=>{
            if (items.id != item.id){
                items.classList.remove('selected')
                items.classList.add('unSelected')
            } else {
                items.classList.remove('unSelected')
                items.classList.add('selected')
            }
        })
    })
})
function displayOption(className){
    for (let i = 0; i < document.querySelectorAll('.adminPanelContent')[0].children.length; i++) {
        const element = document.querySelectorAll('.adminPanelContent')[0].children[i];
        element.style.display = 'none'
    }
    document.querySelectorAll(`.${className}`)[0].style.display = 'grid'
}
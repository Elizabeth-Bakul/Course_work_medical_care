const button = document.getElementsByClassName('.btn');
const menu = document.querySelector('.dropdown-menu')
button.onсlick = function () {
    console.log("her")
    menu.classList.toggle('active');
}
let elem = document.getElementById('elem');
elem.onclick = () => {
    console.log("her")
}

let but=document.querySelector('.button2')
let sec=document.querySelector('.js-selectize')
but.addEventListener("click", function (e){
    e.preventDefault();
    console.log(sec.value);
})
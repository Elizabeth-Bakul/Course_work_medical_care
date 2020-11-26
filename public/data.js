 
let but4 = document.querySelector('.button_3');
let tim=document.querySelector('.date-time');

but4.onclick=()=>{
    var now = new Date().toLocaleString();
    console.log(now);
    tim.value=now;
}
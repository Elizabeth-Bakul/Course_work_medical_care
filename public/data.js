var now = new Date().toLocaleString(); 
let but4 = document.querySelector('.button_3');
let tim=document.querySelector('.date-time');

but4.onclick=()=>{
    tim.value=now;
}
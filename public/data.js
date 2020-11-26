 
let but4 = document.querySelector('.button_3');
let tim=document.querySelector('.date-time');

but4.onclick=()=>{
    tim.removeAttribute('readonly');
    var now = new Date()
    var year=now.getFullYear();
    var month=now.getMonth();
    var day=now.getDate();
    var hour=now.getHours();
    var minut=now.getMinutes()
    console.log(now);
    console.log(year);
    console.log(month);
    console.log(day);
    console.log(hour);
    console.log(minut);
    if (month<10){
        month='0'+month;
    } 
    console.log(month);
    var now2=new Date().toISOString;
    tim.value=now2;
}
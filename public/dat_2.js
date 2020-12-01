let but2 = document.querySelector('.button_31');
let but21 = document.querySelector('.button_37');
let but22 = document.querySelector('.button_38');
let tim=document.querySelector('.date-time1');
let tim2=document.querySelector('.date-time2');
let tim3=document.querySelector('.date-time3');
function getISOStringWithoutSecsAndMillisecs1(date) {
    date.setMilliseconds(3 * 60 * 60 * 1000);
    const dateAndTime = date.toISOString().split('T')
    const time = dateAndTime[1].split(':')
    const sec=time[2].split('.')
    return dateAndTime[0]+'T'+time[0]+':'+time[1]+':'+sec[0]
}

console.log(getISOStringWithoutSecsAndMillisecs1(new Date()))
but2.onclick=()=>{
    tim.value=getISOStringWithoutSecsAndMillisecs1(new Date());
    tim.setAttribute('readonly', 'true');
}
but21.onclick=()=>{
    tim2.value=getISOStringWithoutSecsAndMillisecs1(new Date());
    tim2.setAttribute('readonly', 'true');
}
but22.onclick=()=>{
    tim3.value=getISOStringWithoutSecsAndMillisecs1(new Date());
    tim3.setAttribute('readonly', 'true');
}

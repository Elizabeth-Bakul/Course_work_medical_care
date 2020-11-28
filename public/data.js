let but3 = document.querySelector('.button_3');
let tim=document.querySelector('.date-time');

function getISOStringWithoutSecsAndMillisecs1(date) {
    const dateAndTime = date.toISOString().split('T')
    const time = dateAndTime[1].split(':')
    
    return dateAndTime[0]+'T'+time[0]+':'+time[1]+':'+time[2]
  }
  
  console.log(getISOStringWithoutSecsAndMillisecs1(new Date()))
but3.onclick=()=>{
    tim.removeAttribute('readonly');
    tim.value=getISOStringWithoutSecsAndMillisecs1(new Date());
    tim.setAttribute('readonly', 'true');
}
var but31 = document.querySelectorAll('.Big_B');
var forms=document.getElementsByTagName("form");
let tim2=document.querySelectorAll('.date-time2');
let req=document.querySelector('.rrrrreq');
let brig=document.querySelector('.brrrr');
for (let i=0; i<but31.length;i++){
    but31[i].addEventListener("click", function(e){
    //e.preventDefault();
    buttonsControl(this,i)},false);
}
function getISOStringWithoutSecsAndMillisecs1(date) {
  date.setMilliseconds(3 * 60 * 60 * 1000);
  const dateAndTime = date.toISOString().split('T')
  const time = dateAndTime[1].split(':')
  const sec=time[2].split('.')
  return dateAndTime[0]+'T'+time[0]+':'+time[1]+':'+sec[0]
}

function buttonsControl(button, i){
  //tim2[i].value=getISOStringWithoutSecsAndMillisecs1(new Date());
  forms[i].submit();
  //fr.submit();
}
let but31 = document.querySelectorAll('.Big_B');
let fr=document.querySelectorAll('.form_req');
let tim2=document.querySelectorAll('.date-time2');
let req=document.querySelectorAll('.rrrrreq');
let brig=document.querySelectorAll('.brrrr');
for (let i=0; i<but31.length;i++){
    but31[i].addEventListener("click", function(e){
    e.preventDefault();
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
  tim2[i].value=getISOStringWithoutSecsAndMillisecs1(new Date());
  console.log(tim2[i].value);
  console.log(req[i].value);
  fr[i].submit();
}
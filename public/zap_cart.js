let but31 = document.querySelectorAll('.BB');
var f1=document.querySelector('.vyzov');
var brigad=document.querySelectorAll('.brrrr');
var surname2=document.querySelector('.surname');
var f2=document.querySelector('.form_req');
var name2=document.querySelector('.name');
var lastname2=document.querySelector('.Lastname');
var address2=document.querySelector('.adress');
var ops2=document.querySelector('.ops');
var dateRequest2=document.querySelector('.dateRequest');
var dateAccept2=document.querySelector('.dateAccept');
var Symptom=document.getElementById('Symptom')
var Issledovania=document.getElementById('Issledovania')
var id2=document.querySelector('.id');

console.log(but31);
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
  console.log(button.value);
  tim=getISOStringWithoutSecsAndMillisecs1(new Date())
  let brig=JSON.stringify(
    {
    idReq:button.value,
    idBrig: brigad[i].value,
    dA:tim
  })
  console.log(brig)
let request = new XMLHttpRequest();
    request.open("POST", "/account_doctor", true); 
    request.setRequestHeader("Content-Type", "application/json");
    request.onload = function () {
        console.log(this.response);
    };
    request.send(brig);
    request.addEventListener("load", function () {
      let receivedRequest = JSON.parse(request.response);
      f2.removeAttribute('hidden');
      f1.setAttribute('hidden', 'true')
      surname2.value=receivedRequest.ReqData[0].PatientSurname;
      surname2.setAttribute('readonly','true');
      name2.value=receivedRequest.ReqData[0].PatientName;
      name2.setAttribute('readonly','true');
      lastname2.value=receivedRequest.ReqData[0].PatientMiddleName;
      lastname2.setAttribute('readonly','true')
      address2.value=receivedRequest.ReqData[0].PatientAddress;
      address2.setAttribute('readonly','true')
      ops2.value=receivedRequest.ReqData[0].InformalDescription;
      ops2.setAttribute('readonly','true')
      dateRequest2.value=receivedRequest.ReqData[0].RequestTime;
      dateRequest2.setAttribute('readonly','true')
      dateAccept2.value=receivedRequest.ReqData[0].AcceptTime;
      dateAccept2.setAttribute('readonly','true')
      id2.value=receivedRequest.ReqData[0].id;
      var fc = Symptom.firstChild;
      while( fc ) {
        Symptom.removeChild( fc );
        fc = Symptom.firstChild;
      }
      for (let k=0;k<receivedRequest.SymData.length; k++){
        let op6=document.createElement('option');
        op6.className='Symptomopt';
        op6.value=receivedRequest.SymData[k].id;
        op6.innerHTML=receivedRequest.SymData[k].Symptom_name;
        Symptom.appendChild(op6);
      }
      var fc2 = Issledovania.firstChild;
      while( fc2 ) {
        Issledovania.removeChild( fc2 );
        fc2 = Issledovania.firstChild;
      }
      for (let m=0;m<receivedRequest.IsData.length; m++){
        let op7=document.createElement('option');
        op7.className='Issledovaniaopt';
        op7.value=receivedRequest.IsData[m].id;
        op7.innerHTML=receivedRequest.IsData[m].AnalysisName;
        Issledovania.appendChild(op7);
      }
    });
}


let but8 = document.querySelector('.button_31');
let but81 = document.querySelector('.button_37');
let but82 = document.querySelector('.button_38');
let tim7=document.querySelector('.date-time1');
let tim8=document.querySelector('.date-time2');
let tim9=document.querySelector('.date-time3');
function getISOStringWithoutSecsAndMillisecs1(date) {
    date.setMilliseconds(3 * 60 * 60 * 1000);
    const dateAndTime = date.toISOString().split('T')
    const time = dateAndTime[1].split(':')
    const sec=time[2].split('.')
    return dateAndTime[0]+'T'+time[0]+':'+time[1]+':'+sec[0]
}

console.log(getISOStringWithoutSecsAndMillisecs1(new Date()))
but8.onclick=()=>{
    tim7.value=getISOStringWithoutSecsAndMillisecs1(new Date());
    tim7.setAttribute('readonly', 'true');
}
but81.onclick=()=>{
    tim8.value=getISOStringWithoutSecsAndMillisecs1(new Date());
    tim8.setAttribute('readonly', 'true');
}
but82.onclick=()=>{
    tim9.value=getISOStringWithoutSecsAndMillisecs1(new Date());
    tim9.setAttribute('readonly', 'true');
}

let but101=document.querySelector('.button_32');
but101.addEventListener("click", work);

function work(){
    var x=[]
    let symptom_name = document.getElementById('Symptom');
    for ( var p=0; p<symptom_name.options.length; p++){
      if(symptom_name.options[p].selected===true){
        x.push(symptom_name.options[p].value)
      }
    }
    let SD=JSON.stringify(
      {
      idS:x[0],
      idReq: id2.value
    })
    let request = new XMLHttpRequest();
    request.open("POST", "/account_doctor_add_SR", true); 
    request.setRequestHeader("Content-Type", "application/json");
    request.onload = function () {
        console.log(this.response);
    };
    request.send(SD);
    var res=[];
    request.addEventListener("load", function () {
      let rD = JSON.parse(request.response);
      for (var xu=0; xu<rD.Diad.length; xu++)
      {
        var rtu={};
        rtu.id=rD.Diad[xu].Diagnosis_id_fk;
        rtu.name=rD.Diad[xu].Diagnosis_name;
        rtu.kol=1;
        console.log(rtu)
        res.push(rtu);
      }
    })
    console.log(res);
    for( var z=1; z<x.length;z++){
    let request1 = new XMLHttpRequest();
    request1.open("POST", "/account_doctor", true); 
    request1.setRequestHeader("Content-Type", "application/json");
    request1.onload = function () {
        console.log(this.response);
    };
    request1.send(x[z]);
    request.addEventListener("load", function () {
      let rD = JSON.parse(request.response);
      for (var xu=0; xu<rD.Diad.length; xu++)
      {
        for (let cb=0;cb<res.length;cb++){
          var rtu={};
        rtu.id=rD.Diad[xu].Diagnosis_id_fk;
        rtu.name=rD.Diad[xu].Diagnosis_name;
        rtu.count=1;
        res.push(rtu);
        }
        
      }
    })
    }
    
    
    console.log(id2.value)
  console.log(x);
}
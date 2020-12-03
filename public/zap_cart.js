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
var Diagnosis=document.getElementById('Diagnosis')
var id2=document.querySelector('.id');
var Medicine=document.getElementById('Medicine')

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
      idS:x,
      idReq: id2.value
    })
    let request = new XMLHttpRequest();
    request.open("POST", "/account_doctor_add_SR", true); 
    request.setRequestHeader("Content-Type", "application/json");
    request.onload = function () {
        console.log(this.response);
    };
    request.send(SD);
    var fc4 = Diagnosis.firstChild;
    while( fc4 ) {
      Diagnosis.removeChild( fc4 );
      fc4 = Diagnosis.firstChild;
    }
    request.addEventListener("load", function () {
      let rD = JSON.parse(request.response);
      if (rD.rIn.length===0){
        alert('По данным симптомам нет диагноза в базе. Обратитесь к администратору')
      }
      for (let nb=0;nb<rD.rIn.length; nb++){
        let op11=document.createElement('option');
        op11.className='Diagnosisopt';
        op11.value=rD.rIn[nb].id;
        console.log(op11.value)
        op11.innerHTML=rD.rIn[nb].name+' '+rD.rIn[nb].kol;
        Diagnosis.appendChild(op11);
      }
      console.log(Diagnosis)
      symptom_name.setAttribute('disabled', 'true')
      })
}

let but104=document.querySelector('.button_34');
but104.addEventListener("click", work_2);
function work_2(){
  var da=document.querySelector('.js-selectize')
  console.log(da)
  console.log(da.value)
  console.log(id2.value)
  //console.log(Diagnosis.value)
  let SD6=JSON.stringify(
      {
      idD: da.value,
      idReq: id2.value
    })
    console.log(SD6)
    let request2 = new XMLHttpRequest();
    request2.open("POST", "/account_doctor_add_DR", true); 
    request2.setRequestHeader("Content-Type", "application/json");
    request2.onload = function () {
        console.log(this.response);
    };
    request2.send(SD6);
    var fc5 = Medicine.firstChild;
    while( fc5 ) {
      Medicine.removeChild( fc5 );
      fc5 = Medicine.firstChild;
    }   
    request2.addEventListener("load", function () {
      let rM = JSON.parse(request2.response);
      if (rM.iM.length===0){
        alert('По данному диагнозу нет лекарств в базе. Обратитесь к администратору')
        for (let nz=0;nz<rM.iAM.length; nz++){
          let op18=document.createElement('option');
          op18.className='Diagnosisopt';
          op18.value=rM.iAM[nz].id;
          op18.innerHTML=rM.iAM[nz].Medicines_name;
          Medicine.appendChild(op18);
        }
      } else {
        for (let nm=0;nm<rM.iM.length; nm++){
        let op12=document.createElement('option');
        op12.className='Diagnosisopt';
        op12.value=rM.iM[nm].Medicines_id_fk;
        op12.innerHTML=rM.iM[nm].Medicines_name;
        Medicine.appendChild(op12);
      }
      }
      
      Diagnosis.setAttribute('disabled', 'true')
    })
}

let but105=document.querySelector('.button_35');
let count1=0;
but105.addEventListener("click", work_3);
function work_3(){
  var mmm=document.querySelector('.js-selectize2')
  var x3=[]
    for ( var p3=0; p3<mmm.options.length; p3++){
      if(mmm.options[p3].selected===true){
        x3.push(mmm.options[p3].value)
      }
    }
    count1=x3.length
    console.log(count1)
  let SD3=JSON.stringify(
      {
      idM:x3,
      idReq: id2.value
    })
    let request3 = new XMLHttpRequest();
    request3.open("POST", "/account_doctor_add_MR", true); 
    request3.setRequestHeader("Content-Type", "application/json");
    request3.onload = function () {
        console.log(this.response);
    };
    request3.send(SD3);
    mmm.setAttribute('disabled', 'true')
}
let but107=document.querySelector('.button_33');
let count2=0;
but107.addEventListener("click", work_4);
function work_4(){
  var isl=document.querySelector('.js-selectize4')
  var x4=[]
    for ( var p4=0; p4<isl.options.length; p4++){
      if(isl.options[p4].selected===true){
        x4.push(isl.options[p4].value)
      }
    }
    count2=x4.length
    console.log(count2)
  let SD4=JSON.stringify(
      {
      idI:x4,
      idReq: id2.value
    })
    let request4 = new XMLHttpRequest();
    request4.open("POST", "/account_doctor_add_IR", true); 
    request4.setRequestHeader("Content-Type", "application/json");
    request4.onload = function () {
        console.log(this.response);
    };
    request4.send(SD4);
    isl.setAttribute('disabled', 'true')
}
let but106=document.querySelector('.button_39');
let hos=document.querySelector('.Hospitalizationch')
let ras=document.getElementById('Rasstoynie')
but106.onclick=()=>{
  hos.setAttribute('checked','true');
  hos.value='true'
  ras.removeAttribute('hidden')
}
let but110=document.querySelector('.button_36');
let obst=0;
but110.onclick=()=>{
  let ras1=document.querySelector('.Rasstoynie')
  console.log(ras1.value)
  let stoi=document.querySelector('.countReq')
  obst=850+45*ras1.value+750*count2+560*count1;
  console.log(count1)
  console.log(count2)
  console.log(obst)
  stoi.value=obst
  stoi.setAttribute('readonly','true')
}

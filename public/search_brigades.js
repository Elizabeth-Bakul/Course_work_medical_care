var buttons = document.querySelectorAll('.submit_hide');
var forms=document.getElementsByTagName("form");
var inp=document.getElementsByTagName("input");
let status=document.querySelector('.status');
let sostav=document.querySelector('.sostav');
let history=document.querySelector('.history');
let g=document.querySelector('.good');
let bad=document.querySelector('.bad')

for (let i=0; i<buttons.length;i++){
    buttons[i].addEventListener("click", function(e){
        e.preventDefault();
        buttonsControl(this,i)},false);
}
function buttonsControl(button, i){
    console.log(i)
    console.log(button.value);
    let brig=JSON.stringify(
        {
        idBrigades:inp[i].value
    }
    );
    let request = new XMLHttpRequest();
    request.open("POST", "/search_brigade", true); 
    request.setRequestHeader("Content-Type", "application/json");
    request.onload = function () {
        console.log(this.response);
    };
    request.send(brig);
    request.addEventListener("load", function () {
        let receivedBrigades = JSON.parse(request.response);
        sostav.innerHTML='';
        history.innerHTML='';
        bad.setAttribute('hidden', true)
        g.setAttribute('hidden',true);
        if(typeof receivedBrigades.work[0]=="undefined"){
            sostav.innerHTML='В данной бригаде нет работников';
        } else {
            for (let j=0;j<receivedBrigades.work.length; j++){
            console.log(receivedBrigades.work[j].WorkerType)
            sostav.innerHTML+=receivedBrigades.work[j].WorkerType+': '+receivedBrigades.work[j].WorkerSurname+' '+receivedBrigades.work[j].WorkerName+' '+receivedBrigades.work[j].WorkerMiddleName+'<br>'
        }
        }
        if(typeof receivedBrigades.req[0]=="undefined"){
            console.log('Нет вызовов');
            history.innerHTML='Нет вызовов';
            g.removeAttribute('hidden');
        } else {
            let flag5=0
            for(let k=0; k<receivedBrigades.req.length; k++){
            history.innerHTML+=receivedBrigades.req[k].AcceptTime+'  '+receivedBrigades.req[k].id+'<br>'
            if (receivedBrigades.req[k].EndRequestTime===null){
                flag5=1
            } 
        }
        if(flag5===0){
            g.removeAttribute('hidden');
        } else{bad.removeAttribute('hidden');}
        //console.log(receivedBrigades.work[0].WorkerSurname,' ', receivedBrigades.req[0].id);
        }
        
    })
    console.log(forms[i].className);
}
//Остался график и запрос данных для графика
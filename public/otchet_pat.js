let but=document.querySelector('.button2')
let sec=document.querySelector('.js-selectize')
let bad=document.querySelector('.no_res')
let g=document.querySelector('.tab_res')
let dat = document.querySelector('.d')
let id=document.querySelector('.iD')
let ds=document.querySelector('.ds')
let hos=document.querySelector('.hos')
let n=document.querySelector('.name_pat')
let s=document.querySelector('.surname_pat')
let mn=document.querySelector('.middlename_pat')
let ad=document.querySelector('.adress_pat')
let bl=document.querySelector('.bl_pat')
let str=document.querySelector('.ins_pat')
let tp=document.querySelector('.ins_type')

but.addEventListener("click", function (e){
    e.preventDefault();
    console.log(sec.value);
    let pat=JSON.stringify(
        {
        idPat:sec.value
    })
    let request = new XMLHttpRequest();
    request.open("POST", "/account_otch_pat", true); // посылаем запрос на адрес "/user"
    request.setRequestHeader("Content-Type", "application/json");
    request.onload = function () {
        console.log(this.response);
    };
    request.send(pat);
    n.innerHTML='';
    s.innerHTML='';
    mn.innerHTML='';
    ad.innerHTML='';
    bl.innerHTML='';
    str.innerHTML='';
    tp.innerHTML='';
    var fc = dat.firstChild;
    while( fc ) {
        dat.removeChild( fc );
        fc = dat.firstChild;
    }
    var fc2 = id.firstChild;
    while( fc2 ) {
        id.removeChild( fc2 );
        fc2 = id.firstChild;
    }
    var fc3 = ds.firstChild;
    while( fc3 ) {
        ds.removeChild( fc3 );
        fc3 = ds.firstChild;
    }
    var fc4 = hos.firstChild;
    while( fc4 ) {
        hos.removeChild( fc4 );
        fc4 = hos.firstChild;
    }

    request.addEventListener("load", function () {
        let receivedPatient = JSON.parse(request.response);
        n.innerHTML=receivedPatient.Pat[0].PatientName;
        s.innerHTML=receivedPatient.Pat[0].PatientSurname;
        mn.innerHTML=receivedPatient.Pat[0].PatientMiddleName;
        ad.innerHTML=receivedPatient.Pat[0].PatientAddress;
        bl.innerHTML=receivedPatient.Pat[0].InBlackList;
        str.innerHTML=receivedPatient.Pat[0].InsuranceName;
        tp.innerHTML=receivedPatient.Pat[0].InsurancePayType;
        bad.setAttribute('hidden', true)
        g.setAttribute('hidden',true);
        let di=document.createElement('div');
        di.className='m';
        di.innerHTML='Дата и время';
        dat.appendChild(di);
        let di2=document.createElement('div');
        di2.className='m';
        di2.innerHTML='id вызова';
        id.appendChild(di2);
        let di3=document.createElement('div');
        di3.className='m';
        di3.innerHTML='Диагноз';
        ds.appendChild(di3);
        let di4=document.createElement('div');
        di4.className='m';
        di4.innerHTML='Госпитализация';
        hos.appendChild(di4);
        if(typeof receivedPatient.res[0]=="undefined"){
            bad.removeAttribute('hidden')
        } else {
            g.removeAttribute('hidden');
            
            for(let k=0; k<receivedPatient.res.length; k++){
                let di5=document.createElement('div');
                di5.className='el';
                di5.innerHTML=receivedPatient.res[k].RequestTime;
                dat.appendChild(di5);
                let di6=document.createElement('div');
                di6.className='el';
                di6.innerHTML=receivedPatient.res[k].id;
                id.appendChild(di6);

                let di7=document.createElement('div');
                di7.className='el';
                di7.innerHTML=receivedPatient.res[k].Diagnosis_name;
                ds.appendChild(di7);
            let di8=document.createElement('div');
            di8.className='el';
                
                
                
                di8.innerHTML=receivedPatient.res[k].Hospitalization;
                hos.appendChild(di8);
            }
        }
    })
})
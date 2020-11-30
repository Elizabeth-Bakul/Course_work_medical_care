let button=document.getElementById('r_z')

let dat=document.getElementById('dat-zp')
let n=document.querySelector('.n')
let id=document.querySelector('.id')
let typ=document.querySelector('.typ')
let zp=document.querySelector('.zp_res')
let dd=document.querySelector('.monyear')



button.addEventListener("click", function (e){
    dd.innerHTML='';
    let bzac=30000;
    let bzdoc=27500;
    let bzm=22250;
    let bzad=25000;
    let bzdr=20500;
    e.preventDefault();
    console.log(dat.value)
    let my=dat.value.split('-')
    let month=my[1];
    let year=my[0];
    console.log(year);
    console.log(month);
    let dz=JSON.stringify(
        {
        idMonth:month,
        idYear:year
    })
    let request = new XMLHttpRequest();
    request.open("POST", "/account_otch_pat", true); // посылаем запрос на адрес "/user"
    request.setRequestHeader("Content-Type", "application/json");
    request.onload = function () {
        console.log(this.response);
    };
    request.send(dz);
    dd.innerHTML='Месяц :'+month+' год: '+year;
    var fc = n.firstChild;
    while( fc ) {
        n.removeChild( fc );
        fc = nt.firstChild;
    }
    var fc2 = id.firstChild;
    while( fc2 ) {
        id.removeChild( fc2 );
        fc2 = id.firstChild;
    }
    var fc3 = typ.firstChild;
    while( fc3 ) {
        typ.removeChild( fc3 );
        fc3 = typ.firstChild;
    }
    var fc4 = zp.firstChild;
    while( fc4 ) {
        zp.removeChild( fc4 );
        fc4 = zp.firstChild;
    }
    request.addEventListener("load", function () {
        let receivedZP = JSON.parse(request.response);
        let di=document.createElement('div');
        di.className='f';
        di.innerHTML='ФИО работника';
        n.appendChild(di);
        let di2=document.createElement('div');
        di2.className='f';
        di2.innerHTML='id бригады';
        id.appendChild(di2);
        let di3=document.createElement('div');
        di3.className='f';
        di3.innerHTML='Профессия';
        typ.appendChild(di3);
        let di4=document.createElement('div');
        di4.className='f';
        di4.innerHTML='Заработная плата';
        zp.appendChild(di4);
        for (let m=0; m<receivedZP.length; m++)
        {

        }
        switch (receivedZP[m].WorkerType){
            case 'бухгалтер-регистратор':

        }
    })
})
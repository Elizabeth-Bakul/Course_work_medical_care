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
    request.open("POST", "/account_zp", true); // посылаем запрос на адрес "/user"
    request.setRequestHeader("Content-Type", "application/json");
    request.onload = function () {
        console.log(this.response);
    };
    request.send(dz);
    //dd.innerHTML='Месяц:  '+month+' Год: '+year;
    var fc = n.firstChild;
    while( fc ) {
        n.removeChild( fc );
        fc = n.firstChild;
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
        for (let m=0; m<receivedZP.res.length; m++)
        {
            let di5=document.createElement('div');
            di5.className='el';
            di5.innerHTML=receivedZP.res[m].WorkerSurname+' '+receivedZP.res[m].WorkerName[0]+'. '+receivedZP.res[m].WorkerMiddleName[0]+'. ';
            n.appendChild(di5);
            let di6=document.createElement('div');
            di6.className='el';
            di6.innerHTML=receivedZP.res[m].l;
            id.appendChild(di6);
            let di7=document.createElement('div');
            di7.className='el';
            di7.innerHTML=receivedZP.res[m].WorkerType;
            typ.appendChild(di7);
            let di8=document.createElement('div');
            di8.className='el';
            let ras=0;
            switch (receivedZP.res[m].WorkerType){
                case 'бухгалтер-регистратор':
                        ras=bzac;
                        break;
                case 'врач':
                    if (receivedZP.res[m].s!='null'){
                        ras=bzdoc+0.15*receivedZP.res[m].s;
                    } else{ras=bzdoc};
                    break;
                case 'Врач':
                        if (receivedZP.res[m].s!='null'){
                            ras=bzdoc+0.15*receivedZP.res[m].s;
                        } else{ras=bzdoc};
                        break;
                case 'фельдшер':
                    if (receivedZP.res[m].s!='null'){
                        ras=bzdoc+0.15*receivedZP.res[m].s;
                    } else{ras=bzdoc};
                    break; 
                case 'Фельдшер':
                        if (receivedZP.res[m].s!='null'){
                            ras=bzdoc+0.15*receivedZP.res[m].s;
                        } else{ras=bzdoc};
                        break;
                case "администратор":
                    ras=bzad; 
                    break;
                case "Медработник":
                    if (receivedZP.res[m].s!='null'){
                        ras=bzm+0.1*receivedZP.res[m].s;
                    } else{ras=bzm};
                break; 
                case "медработник":
                    if (receivedZP.res[m].s!='null'){
                        ras=bzm+0.1*receivedZP.res[m].s;
                    } else{ras=bzm};
                break;
                case "водитель":
                    if (receivedZP.res[m].s!='null'){
                        ras=bzdr+0.05*receivedZP.res[m].s;
                    } else{ras=bzdr};
                    break;
                case "Водитель":
                        if (receivedZP.res[m].s!='null'){
                            ras=bzdr+0.05*receivedZP.res[m].s;
                        } else{ras=bzdr};
                        break;    
                default:
                    console.log("Ошибка! Неизвестный тип работника.");
                    break;
            }
            di8.innerHTML=ras;
            zp.appendChild(di8);
        }
        
    })
})
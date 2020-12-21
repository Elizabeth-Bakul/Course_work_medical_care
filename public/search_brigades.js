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
                let temp = receivedBrigades.req[k].AcceptTime.split('T')
                let mint = temp[1].split(':')
                history.innerHTML += 'Время: ' + mint[0] + ':' + mint[1] + '  Дата: ' + temp[0] + '         id вызова:  ' + receivedBrigades.req[k].id + '<br>'
            if (receivedBrigades.req[k].EndRequestTime===null){
                flag5=1
            } 
        }
        if(flag5===0){
            g.removeAttribute('hidden');
        } else{bad.removeAttribute('hidden');}
        //console.log(receivedBrigades.work[0].WorkerSurname,' ', receivedBrigades.req[0].id);
        }
        // let data = [2,4, 200]
        var ctx = document.getElementById('myChart');
        var date = new Date();
        console.log(date.getMonth() + 1)
        console.log(date.getFullYear())
        console.log(receivedBrigades.req)
        var count_array = []
        var date_array = []
        for (let i = 0; i < receivedBrigades.req.length; i++) {

            let str = receivedBrigades.req[i].AcceptTime
            var month = str.slice(5, 7);
            if (date.getMonth() + 1 == month) {
                let temp = date_array.indexOf(receivedBrigades.req[i].AcceptTime.slice(8, 10))
                if (temp != -1) {
                    count_array[temp] += 1;
                } else {
                    date_array.push(receivedBrigades.req[i].AcceptTime.slice(8, 10))
                    count_array.push(1)
                    console.log(receivedBrigades.req[i].AcceptTime.slice(8, 10))
                }
            }
        }
        console.log(date_array)
        console.log(count_array)
        date_array.reverse();
        count_array.reverse();

        var myLineChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: date_array,
                datasets: [{
                    label: 'Количество вызовов',
                    data: count_array,
                    borderColor: [
                        'rgba(1, 0, 253, 1)'
                    ],
                    borderWidth: 1,
                    lineTension: 0.1,
                    fill: false
                }]
            },
            options: {
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true,
                            callback: function (value) {
                                if (value % 1 === 0) {
                                    return value;
                                }
                            }
                        }
                    }]
                }
            }

        });

        document.getElementById('randomizeData').addEventListener('click', function () {
            config.data.datasets.forEach(function (dataset) {
                dataset.data = dataset.data.map(function () {
                    return randomScalingFactor();
                });

            });

            window.myLine.update();
        });
        
    })
    console.log(forms[i].className);


}


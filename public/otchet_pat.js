let but=document.querySelector('.button2')
let sec=document.querySelector('.js-selectize')
but.addEventListener("click", function (e){
    e.preventDefault();
    console.log(sec.value);
    let pat=JSON.stringify(
        {
        idPat:sec.value
    })
    let request = new XMLHttpRequest();
    request.open("POST", "/search_patient", true); // посылаем запрос на адрес "/user"
    request.setRequestHeader("Content-Type", "application/json");
    request.onload = function () {
        console.log(this.response);
    };
    request.send(patient);
    request.addEventListener("load", function () {
        let receivedPatient = JSON.parse(request.response);
        if(typeof )
    })
})
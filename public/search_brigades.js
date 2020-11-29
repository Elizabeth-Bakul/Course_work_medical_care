var buttons=document.querySelectorAll('.button2');
var forms=document.getElementsByTagName("form");
var inp=document.getElementsByTagName("input");
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
        console.log(receivedBrigades.idBrigades);
    })
    console.log(forms[i].className);
}
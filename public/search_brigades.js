var buttons=document.querySelectorAll('.button2');
var forms=document.getElementsByTagName("form");
for (let i=0; i<buttons.length;i++){
    buttons[i].addEventListener("click", function(){buttonsControl(this,i)},false);
}
function buttonsControl(button, i){
    console.log(i)
    console.log(button.value);
    console.log(forms[i].className);
}
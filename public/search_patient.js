//Поиск пациента
document.getElementById("subsear").addEventListener("click", function (e){
    e.preventDefault();
    let registerForm = document.querySelector(".add_patient");
    let userSurname = document.querySelector(".surname");
    let userName = document.querySelector(".name");
    let userMiddlename = document.querySelector(".Lastname");
    let rl = document.getElementById("typOpl");
    let r1 = document.querySelector(".typOp1");
    let r2 = document.querySelector(".typOp2");
    let uS = document.getElementById("surname2");
    let uN = document.getElementById("name2");
    let uM = document.getElementById("Lastname2");
    let uSt = document.getElementById("str");
    let uA = document.getElementById("adress");
    let n1=document.querySelector(".black-list");
    let n2=document.querySelector(".not-patient");
    let n3=document.querySelector(".in-base");
    n1.setAttribute('hidden', 'true');
    n2.setAttribute('hidden', 'true');
    n3.setAttribute('hidden', 'true');
    let patient = JSON.stringify({
        userSurname: userSurname.value,
        userName: userName.value,
        userMiddlename: userMiddlename.value
    });
    uA.value = '';
    uSt.value = '';
    let request = new XMLHttpRequest();
    request.open("POST", "/search_patient", true); // посылаем запрос на адрес "/user"
    request.setRequestHeader("Content-Type", "application/json");
    request.onload = function () {
        console.log(this.response);
    };
    request.send(patient);


    request.addEventListener("load", function () {
        // получаем и парсим ответ сервера
        let receivedUser = JSON.parse(request.response);
        console.log(receivedUser.PatientAddress, " ", receivedUser.InBlackList, " ", receivedUser.InsuranceName, " ", receivedUser.InsurancePayType, " ");// смотрим ответ сервера
        if (!receivedUser.length) {
            if (receivedUser.InBlackList) {
                registerForm.setAttribute('hidden', 'true');
                n1.removeAttribute('hidden');
            } else {
                registerForm.removeAttribute('hidden');
                uA.value = receivedUser.PatientAddress;
                uSt.value = receivedUser.InsuranceName;
                uSt.setAttribute('readonly', 'true');
                rl.setAttribute('hidden', 'true');
                r1.setAttribute('hidden', 'true');
                r2.setAttribute('hidden', 'true');
                n3.removeAttribute('hidden');
            }
        } else {n2.removeAttribute('hidden');}
    });
    uN.value = userName.value;
    uN.setAttribute('readonly', 'true');
    uS.value = userSurname.value;
    uS.setAttribute('readonly', 'true');
    uM.value = userMiddlename.value;
    uM.setAttribute('readonly', 'true');

})
var button9=document.querySelector('.button2');
button9.onclick=()=>{
    var f1=document.querySelector('.add_form');
    f1.submit();
}
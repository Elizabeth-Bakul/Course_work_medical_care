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
    console.log(userSurname.value);
    console.log(userName.value);
    console.log(userMiddlename.value);
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
            } else {
                registerForm.removeAttribute('hidden');
                uA.value = receivedUser.PatientAddress;
                uSt.value = receivedUser.InsuranceName;
                uSt.setAttribute('readonly', 'true');
                rl.setAttribute('hidden', 'true');
                r1.setAttribute('hidden', 'true');
                r2.setAttribute('hidden', 'true');
            }
        }
    });
    uN.value = userName.value;
    uN.setAttribute('readonly', 'true');
    uS.value = userSurname.value;
    uS.setAttribute('readonly', 'true');
    uM.value = userMiddlename.value;
    uM.setAttribute('readonly', 'true');

})
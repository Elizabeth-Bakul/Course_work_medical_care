//Поиск пациента
document.getElementById("subsear").addEventListener("click", function (e){
    e.preventDefault();
    //let registerForm = document.querySelector("search");
    let userSurname = document.querySelector(".surname");
    let userName = document.querySelector(".name");
    let userMiddlename = document.querySelector(".Lastname");
    console.log(userSurname.value);
    console.log(userName.value);
    console.log(userMiddlename.value);
    let patient = JSON.stringify({
        userSurname: userSurname.value,
        userName: userName.value,
        userMiddlename: userMiddlename.value
    });
    let request = new XMLHttpRequest();
    request.open("POST", "/search_patient", true); // посылаем запрос на адрес "/user"
    request.setRequestHeader("Content-Type", "application/json");
    request.addEventListener("load", function () {
        // получаем и парсим ответ сервера
        let receivedUser = JSON.parse(request.response);
        console.log(receivedUser.userSurname, " ", receivedUser.userName, " ", receivedUser.userMiddleName, " ", receivedUser.address, " ", receivedUser.InsName, " ", receivedUser.isBlackList);   // смотрим ответ сервера
    });
    request.send(patient);
})
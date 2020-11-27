document.getElementById("subsear").addEventListener("click", function (e){
    e.preventDefault();
    let registerForm=document.forms("search-form");
    let userSurname=registerForm.elements["surname"];
    let userName=registerForm.elements["name"];
    let userMiddlename=registerForm.elements["Lastname"];
    console.log(userSurname);
    console.log(userName);
    console.log(userMiddlename);
    let patient=JSON.stringify({userSurname: userSurname, userName: userName, userMiddlename: userMiddlename});
    let request = new XMLHttpRequest();
    request.open("POST", "/user", true); // посылаем запрос на адрес "/user"
    request.setRequestHeader("Content-Type", "application/json");
    request.addEventListener("load", function () {
        // получаем и парсим ответ сервера
        let receivedUser = JSON.parse(request.response);
        console.log(receivedUser.userSurname, " ", receivedUser.userName, " ", receivedUser.userMiddlename, " ", receivedUser.adress, " ", receivedUser.StrName);   // смотрим ответ сервера
    });
    request.send(patient);
})
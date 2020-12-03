//Кнопка выход
let registration_request = document.querySelector('.btn');
let men = document.querySelector('.dropdown');
registration_request.onclick = () => {
    men.classList.toggle('active');
}
///

document.getElementsByClassName('add_diagnosis')[0].style.display = 'block';
document.getElementsByClassName('add_symptom')[0].style.display = 'none';
document.getElementsByClassName('add_analysis')[0].style.display = 'none';
document.getElementsByClassName('add_medicine')[0].style.display = 'none';
document.getElementsByClassName('add_brigade')[0].style.display = 'none';


document.getElementById("add_diagnosis_nav").addEventListener("click", function (e) {
    document.getElementById("add_diagnosis_nav").className = "nav__link nav_active";
    document.getElementById("add_symptom_nav").className = "nav__link";
    document.getElementById("add_analysis_nav").className = "nav__link";
    document.getElementById("add_medicine_nav").className = "nav__link";
    document.getElementById("add_brigade_nav").className = "nav__link";

    document.getElementsByClassName('add_diagnosis')[0].style.display = 'block';
    document.getElementsByClassName('add_symptom')[0].style.display = 'none';
    document.getElementsByClassName('add_analysis')[0].style.display = 'none';
    document.getElementsByClassName('add_medicine')[0].style.display = 'none';
    document.getElementsByClassName('add_brigade')[0].style.display = 'none';
})

document.getElementById("add_symptom_nav").addEventListener("click", function (e) {
    document.getElementById("add_diagnosis_nav").className = "nav__link";
    document.getElementById("add_symptom_nav").className = "nav__link nav_active";
    document.getElementById("add_analysis_nav").className = "nav__link";
    document.getElementById("add_medicine_nav").className = "nav__link";
    document.getElementById("add_brigade_nav").className = "nav__link";

    document.getElementsByClassName('add_diagnosis')[0].style.display = 'none';
    document.getElementsByClassName('add_symptom')[0].style.display = 'block';
    document.getElementsByClassName('add_analysis')[0].style.display = 'none';
    document.getElementsByClassName('add_medicine')[0].style.display = 'none';
    document.getElementsByClassName('add_brigade')[0].style.display = 'none';
})

document.getElementById("add_analysis_nav").addEventListener("click", function (e) {
    document.getElementById("add_diagnosis_nav").className = "nav__link";
    document.getElementById("add_symptom_nav").className = "nav__link";
    document.getElementById("add_analysis_nav").className = "nav__link nav_active";
    document.getElementById("add_medicine_nav").className = "nav__link";
    document.getElementById("add_brigade_nav").className = "nav__link";

    document.getElementsByClassName('add_diagnosis')[0].style.display = 'none';
    document.getElementsByClassName('add_symptom')[0].style.display = 'none';
    document.getElementsByClassName('add_analysis')[0].style.display = 'block';
    document.getElementsByClassName('add_medicine')[0].style.display = 'none';
    document.getElementsByClassName('add_brigade')[0].style.display = 'none';
})

document.getElementById("add_medicine_nav").addEventListener("click", function (e) {
    document.getElementById("add_diagnosis_nav").className = "nav__link";
    document.getElementById("add_symptom_nav").className = "nav__link";
    document.getElementById("add_analysis_nav").className = "nav__link";
    document.getElementById("add_medicine_nav").className = "nav__link nav_active";
    document.getElementById("add_brigade_nav").className = "nav__link";

    document.getElementsByClassName('add_diagnosis')[0].style.display = 'none';
    document.getElementsByClassName('add_symptom')[0].style.display = 'none';
    document.getElementsByClassName('add_analysis')[0].style.display = 'none';
    document.getElementsByClassName('add_medicine')[0].style.display = 'block';
    document.getElementsByClassName('add_brigade')[0].style.display = 'none';
})

document.getElementById("add_brigade_nav").addEventListener("click", function (e) {
    document.getElementById("add_diagnosis_nav").className = "nav__link";
    document.getElementById("add_symptom_nav").className = "nav__link";
    document.getElementById("add_analysis_nav").className = "nav__link";
    document.getElementById("add_medicine_nav").className = "nav__link";
    document.getElementById("add_brigade_nav").className = "nav__link nav_active";

    document.getElementsByClassName('add_diagnosis')[0].style.display = 'none';
    document.getElementsByClassName('add_symptom')[0].style.display = 'none';
    document.getElementsByClassName('add_analysis')[0].style.display = 'none';
    document.getElementsByClassName('add_medicine')[0].style.display = 'none';
    document.getElementsByClassName('add_brigade')[0].style.display = 'block';
})


document.getElementById("submit_add_diagnosis").addEventListener("click", function (e) {
    e.preventDefault();
    let diagnosis_name = document.getElementById('diagnosis_name');
    let symptom_name = document.getElementById('symptom_name');
    console.log(diagnosis_name);
    console.log(symptom_name);
    let diagnosis = JSON.stringify({
        diagnosis_name: diagnosis_name.value,
        symptom_name: $('#select_symptoms').val(),
    });
    console.log(diagnosis);
    let request = new XMLHttpRequest();
    request.open("POST", "/add_diagnosis_symptoms", true); // посылаем запрос на адрес "/user"
    request.setRequestHeader("Content-Type", "application/json");
    request.send(diagnosis);
})


document.getElementById("submit_add_symptom").addEventListener("click", function (e) {
    e.preventDefault();
    console.log('hello')
    let symptom_name = document.getElementById('add_symptom');
    let symptom = JSON.stringify({
        symptom_name: symptom_name.value,
    });
    console.log(symptom_name);
    let request = new XMLHttpRequest();
    request.open("POST", "/add_symptom", true);
    request.setRequestHeader("Content-Type", "application/json");
    request.send(symptom);
})

document.getElementById("submit_add_analysis").addEventListener("click", function (e) {
    e.preventDefault();
    console.log('hello')
    let analysis_name = document.getElementById('add_analysis');
    let analysis = JSON.stringify({
        analysis_name: analysis_name.value,
    });
    console.log(analysis_name);
    let request = new XMLHttpRequest();
    request.open("POST", "/add_analysis", true);
    request.setRequestHeader("Content-Type", "application/json");
    request.send(analysis);
})

document.getElementById("submit_add_medicine").addEventListener("click", function (e) {
    e.preventDefault();
    let medicine_name = document.getElementById('name_medicine');
    let diagnosis_name = document.getElementById('diagnosis_name');
    console.log(medicine_name);
    console.log(diagnosis_name);
    let medicine = JSON.stringify({
        medicine_name: medicine_name.value,
        diagnosis: $('#select_diagnosis').val(),
    });
    console.log(medicine);
    let request = new XMLHttpRequest();
    request.open("POST", "/add_medicine", true); // посылаем запрос на адрес "/user"
    request.setRequestHeader("Content-Type", "application/json");
    request.send(medicine);
})


document.getElementById("delete_analysis").addEventListener("click", function (e) {
    e.preventDefault();
    let analysis_name1 = document.getElementById('add_analysis');
    let analysis1 = JSON.stringify({
        analysis_name1: analysis_name1.value,
    });
    console.log(analysis_name1);
    let request1 = new XMLHttpRequest();
    request1.open("POST", "/delete_analysis", true);
    request1.setRequestHeader("Content-Type", "application/json");
    request1.send(analysis1);
    request1.addEventListener("load", function () {
    let infDel = JSON.parse(request.response);
    if(infDel.flag){
        alert('Удаление произошло успешно')
    } else{
        alert('Произошла ошибка с удалением, данного диагноза нет в базе')
    }
    })
})

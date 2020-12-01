console.log('hello')

document.getElementById("submit_add_diagnosis").addEventListener("click", work);

function work() {
    console.log('hello')
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
}
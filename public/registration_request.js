//Регистрация вызова
let registration_request = document.querySelector('.btn');
let men = document.querySelector('.dropdown');
registration_request.onclick = () => {
    men.classList.toggle('active');
}
let but2 = document.querySelector('.button_2');
let but4 = document.querySelector('.button_4');
let adr=document.querySelector('.adress');
but2.onclick=()=> {
    but2.setAttribute('hidden', 'true');
    but4.removeAttribute('hidden');
    adr.removeAttribute('readonly');
}
but4.onclick=()=>{
    but4.setAttribute('hidden', 'true');
    but2.removeAttribute('hidden');
    adr.setAttribute('readonly', 'true');
}

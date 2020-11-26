let but = document.querySelector('.btn');
let men = document.querySelector('.dropdown');
but.onclick = () => {
    men.classList.toggle('active');
}
let but2 = document.querySelector('.button_2');
let adr=document.querySelector('.adress');
but2.onclick=()=> {
    but2.value='Сохранить';
    but2.classList.add('sav');
    adr.removeAttribute('readonly');
}
let but3=document.querySelector('.button_2.sav');
but3.onclick=()=>{
    but3.value='Изменить';
    but3.classList.remove('sav');
    but3.setAttribute('readonly');
}
let butten=document.querySelector('.sav');
butten.onclick=()=>{
    butten.value='Изменить';
    butten.className="button_2";
    butten.setAttribute('readonly', 'true');
}
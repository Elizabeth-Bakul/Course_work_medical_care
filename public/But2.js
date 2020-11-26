let butten=document.querySelector('.saver');
butten.onclick=()=>{
    butten.value='Изменить';
    butten.className="button_2";
    butten.setAttribute('readonly', 'true');
}
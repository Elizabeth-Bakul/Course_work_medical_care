let showPassword = document.querySelector('.show-password');
showPassword.onchange = function () {
    if (showPassword.checked) {
      password.type = 'text';
    } else {
      password.type = 'password';
    }
  };

let mistake=document.querySelector('.mistake');
let zatem=document.querySelector('.zatemnenie');
let sub=document.querySelector('.button');
let b1=document.querySelector('.b1');


let res=-1;//переменная получается с сервера 0/1 0-ошибка;1-нет ошибки
if (res===0){
  mistake.classList.add('active');
  zatem.classList.add('active');
};
b1.onclick=function() {
  mistake.classList.remove('active');
  zatem.classList.remove('active');
};
//на сервере: получаем данные с формы, делаем запрос, по результату формируем переменную res и передаем ее в этот файл
// select id, password from authorization where login="полученного с формы";
//if (длина массива, полученного из запроса ===0), то res=0 иначе(
//if (пароль введенный === пароль из БД) то (делаем запрос к БД select workerType from workers where id=полученному из прошлого запроса; Проверка профессии: если регистратор то res=1 переадресация; если врач то res=1 переадресация; если админ то res=1 переадерсация) иначе res=0;)
//передаем переменную res в файл password.js

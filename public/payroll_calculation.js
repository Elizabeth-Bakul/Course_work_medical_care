let button=document.getElementById('r_z')

let dat=document.getElementById('dat-zp')
let n=document.querySelector('.n')
let id=document.querySelector('.id')
let typ=document.querySelector('.typ')
let zp=document.querySelector('.zp_res')

button.addEventListener("click", function (e){
    e.preventDefault();
    console.log(dat.value)
    let my=dat.value.split('-')
    let month=my[1];
    let year=my[0];
    console.log(year);
    console.log(month);
})
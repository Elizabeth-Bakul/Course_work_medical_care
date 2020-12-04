var util = require('util');
var express = require('express');
var app = express();
var passport = require("passport");

var fs = require('fs');
var request = require('request');
const {Pool, Client} = require('pg')
const bcrypt = require('bcrypt')
const uuidv4 = require('uuid/v4');
const {forwardAuthenticated, ensureAuthenticated}=require('./config/auth')


app.use(express.static('public'));

const LocalStrategy = require('passport-local').Strategy;

var currentAccountsData = [];

const pool = new Pool({
    user: process.env.PGUSER,
    host: process.env.PGHOST,
    database: process.env.PGDATABASE,
    password: process.env.PGPASSWORD,
    port: process.env.PGPORT,
    ssl: true
});

module.exports = function (app) {

    app.get('/', function (req, res, next) {
        res.render('login', {
            title: "Log in",
            userData: req.user,
            messages: {danger: req.flash('danger'), warning: req.flash('warning'), success: req.flash('success')}
        });
        console.log(req.user);
    });


    app.get('/join', forwardAuthenticated, function (req, res) {
        res.render('join', {
            title: "Join",
            userData: req.user,
            messages: {danger: req.flash('danger'), warning: req.flash('warning'), success: req.flash('success')}
        });
    });
    //console.log (uuidv4());

    app.post('/join', async function (req, res) {

        try {
            console.log(req.body)
            const client = await pool.connect()
            await client.query('BEGIN')
            var pwd = await bcrypt.hash(req.body.password, 5);
            await JSON.stringify(client.query('SELECT id FROM "Workers" WHERE "Login"=$1', [req.body.username], function (err, result) {
                if (result.rows[0]) {
                    req.flash('warning', 'This email address is already registered.');
                    res.redirect('/join');
                } else {
                    flas=0
                    switch(req.body.typeWorker){
                        case 'бухгалтер-регистратор': 
                            if(req.body.Brigade_fk !=3) {
                                flas=2
                            } else {flas=1}
                            break;
                        case 'администратор':
                            if(req.body.Brigade_fk !=3) {
                                flas=2
                                } else {flas=1}
                            break;
                        case 'врач':
                            if(req.body.Brigade_fk ===3) {
                                flas=3
                            } else {flas=1}
                            break;
                        case 'Врач':
                                if(req.body.Brigade_fk ===3) {
                                    flas=3
                                } else {flas=1}
                                break;
                        case 'фельдшер':
                                    if(req.body.Brigade_fk ===3) {
                                        flas=3
                                    } else {flas=1}
                                    break;
                        case 'Фельдшер':
                                        if(req.body.Brigade_fk ===3) {
                                            flas=3
                                        } else {flas=1}
                                        break;
                        case 'водитель':
                                            if(req.body.Brigade_fk ===3) {
                                                flas=3
                                            } else {flas=1}
                                            break;
                        case 'Водитель':
                            if(req.body.Brigade_fk ===3) {
                                flas=3
                            } else {flas=1}
                            break;
                        case 'медработник':
                            if(req.body.Brigade_fk ===3) {
                                flas=3
                            } else {flas=1}
                            break;
                        case 'Медработник':
                            if(req.body.Brigade_fk ===3) {
                                flas=3
                            } else {flas=1}
                            break;
                        default:
                            flas=4;
                            break;
                    }
                    console.log(flas)
                    if (flas===1){
client.query('INSERT INTO "Workers" ("WorkerSurname", "WorkerName","WorkerMiddleName", "WorkerType", "Brigade_fk", "Login", "Password") ' +
                        'VALUES ($1, $2, $3, $4, $5, $6, $7)',
                        [req.body.lastName, req.body.firstName, req.body.middleName, req.body.typeWorker, req.body.brigadenum, req.body.username, pwd], function (err, result) {
                            if (err) {
                                req.flash('danger', 'Такой бригады не существует или произошла ошибка с регистрацией.')
                                res.redirect('/join');
                            } else {

                                client.query('COMMIT')
                                console.log(result)
                                req.flash('success', 'User created.')
                                res.redirect('/login');
                                return;
                            }
                        });
                        client.release();
                }

                     else {
                        if (flas===2){
                            req.flash('danger', 'Неправильная бригада, для этой профессии бригада 3')
                            res.redirect('/join');
                        } else {
                            if (flas===3){
                                req.flash('danger', 'Неправильная бригада')
                                res.redirect('/join');
                            } else {
                                req.flash('danger', 'Неправильная профессия')
                                res.redirect('/join');
                            }
                                
                            } 
                     }  
                     
                    
                    }}))
        } catch (e) {
            throw(e)
        }
    });



    const jsonParser = express.json();
    app.post('/search_patient', jsonParser, async function (req, res) {

        try {
            console.log(req.body);
            const client = await pool.connect()
            await client.query('BEGIN')
            await JSON.stringify(client.query('select "PatientAddress","InBlackList", "InsuranceName", "InsurancePayType" from "Patients" ' +
                'left join "Insurance" I on "Patients"."InsuranceId_fk" = I.id where "PatientName"=$1 and "PatientSurname"=$2 and "PatientMiddleName"=$3', [req.body.userName, req.body.userSurname, req.body.userMiddlename], function (err, result) {
                console.log(result.rows[0]);
                // console.log(req.body.userName);
                // console.log(req.body.userSurname);
                // console.log(req.body.userMiddlename);
                res.json(result.rows[0]);

            }));
        } catch (e) {
            throw(e)
        }
    });
    app.get('/account_doctor',ensureAuthenticated, async function (req, res){
        try{
            const client=await pool.connect()
            await client.query('BEGIN')
            await JSON.stringify(client.query('select id,"InformalDescription","RequestTime" from "Requests" where "AcceptTime" is NULL',[],function(err,result){
                if (err) {console.log(err)}
                else{
                    console.log(result.rows)
                    res.render('account_doctor', {
                    title: "Работник",
                    us: req.user,
                    vyzov:result.rows,
                    messages: {
                        danger: req.flash('danger'),
                        warning: req.flash('warning'),
                        success: req.flash('success')
                    }
        });
        client.query('COMMIT')
                }
            }))
            client.release()
        }
        catch (e) {
            throw(e)
        }
    })
    app.post('/account_doctor_add_SR', jsonParser , async function(req, res){
        try{
            console.log(req.body);
            const client1=await pool.connect()
            await client1.query('BEGIN')
            for (let yi=0;yi<req.body.idS.length; yi++){
                await JSON.stringify(client1.query('select id from "Request-Symptoms" where "Request_id_fk"=$1 and "Symptom_id_fk"=$2',[req.body.idReq,req.body.idS[yi]], function(err2, result2){
                    if (err2){console.log(err2)} else {
                        if (result2.rowCount===0){
                            client1.query('INSERT INTO "Request-Symptoms" ("Request_id_fk", "Symptom_id_fk") VALUES($1,$2)',[req.body.idReq,req.body.idS[yi]],function(err3,result3){
                                if (err3) {console.log(err3)}
                                else{
                                    client1.query('COMMIT')

                                }
                            })
                            client1.query('COMMIT')

                        }
                        client1.query('COMMIT')
                    }
                    client1.query('COMMIT')
                }))
                client1.query('COMMIT')
            }client1.release()
            const client=await pool.connect()
            await client.query('BEGIN')
            var rk=[]
            await JSON.stringify(client.query('SELECT "Diagnosis_id_fk", "Diagnosis_name" FROM "Diagnosis-Symptoms" left join "Diagnosis" on "Diagnosis-Symptoms"."Diagnosis_id_fk"="Diagnosis".id where "Symptoms_id_fk"=$1',[req.body.idS[0]],function(err,result){
                if(err){
                    console.log(err)
                } else{
                    console.log("res1")
                    console.log(result.rows)
                    for (let d=0; d<result.rowCount; d++){
                        var rr2={}
                        rr2.id=result.rows[d].Diagnosis_id_fk;
                        rr2.name=result.rows[d].Diagnosis_name;
                        rr2.kol=1;
                        rk.push(rr2);
                    }
                    console.log("res2")
                    console.log(rk);
                    if((req.body.idS.length===1)||(req.body.idS.length===0)){res.json({
                        rIn:rk
                        })}
                    for (let n=1;n<req.body.idS.length;n++){
                        client.query('SELECT "Diagnosis_id_fk", "Diagnosis_name" FROM "Diagnosis-Symptoms" left join "Diagnosis" on "Diagnosis-Symptoms"."Diagnosis_id_fk"="Diagnosis".id where "Symptoms_id_fk"=$1',[req.body.idS[n]],function(err1,result1){
                            if(err1){
                                console.log(err1)
                            } else{
                                console.log("res3")
                                console.log(result1.rows)
                                for (let v=0; v<result1.rowCount; v++){
                                    var b=0;
                                    let o=0
                                    while((o<rk.length) && (b===0)){
                                        if(rk[o].id===result1.rows[v].Diagnosis_id_fk){b=1}
                                        else (o++)
                                    }
                                    if (b===1){
                                        rk[o].kol+=1;
                                    }else{
                                        var rr3={}
                                            rr3.id=result1.rows[v].Diagnosis_id_fk;
                                            rr3.name=result1.rows[v].Diagnosis_name;
                                            rr3.kol=1;
                                            rk.push(rr3)
                                    }
                                        console.log("res4")
                                        console.log(rk)
                                    }
                                    console.log("res5")
                                    console.log(rk)
                                }
                                console.log("res6")
                                console.log(rk)
                                if(n===req.body.idS.length-1){
                                    res.json({
                                        rIn:rk
                                        })
                                }
                    }
                        )
            console.log("res7")
            console.log(rk)

        }

                }
            }))
            console.log(rk)
            client.query('COMMIT')
            client.release()
        }
        catch(e){
            throw(e)
        }
    })
    app.post('/account_doctor_add_DR',jsonParser, async function(req,res){
        try{
            console.log(req.body)
            const client = await pool.connect()
            await client.query('BEGIN')
            await JSON.stringify(client.query('UPDATE "Requests" SET "Diagnosis_id_fk"=$1 WHERE id=$2',[req.body.idD, req.body.idReq], function(err, result){
                if (err){console.log(err)}
                else {
                    client.query('COMMIT')
                }
            }))
            client.release()
            const client1 = await pool.connect()
            await client1.query('BEGIN')
            await JSON.stringify(client1.query('select "Medicines_id_fk", "Medicines_name" from "Diagnosis-Medicines" left join "Medicines" on "Diagnosis-Medicines"."Medicines_id_fk"="Medicines".id where "Diagnosis_id_fk"=$1',[req.body.idD], function(err1, result1){
                if (err1){console.log(err1)}
                else {
                    console.log(result1.rows)
                    if(result1.rowCount===0){
                        client1.query('select id, "Medicines_name" from "Medicines"',[], function(err2,result2){
                            if (err2) {console.log(err2)} else {
                                res.json({
                                    iM:result1.rows,
                                    iAM:result2.rows
                                })
                            }
                        }
                    )} else {
                        res.json({
                        iM:result1.rows
                    })
                    }

                    client1.query('COMMIT')

                }
            }))
            client1.release()
        }
        catch(e){
            throw(e)
        }
    })
    app.post('/account_doctor_add_MR', jsonParser,async function (req, res){
            try{
                console.log(req.body);
                const client = await pool.connect()
                await client.query('BEGIN')
                for (let ym=0;ym<req.body.idM.length; ym++){
                    await JSON.stringify(client.query('select id from "Request-Medicines" where "Request_id_fk"=$1 and "Medicine_id_fk"=$2',[req.body.idReq,req.body.idM[ym]], function(err2, result2){
                        if (err2){console.log(err2)} else {
                            if (result2.rowCount===0){
                                client.query('INSERT INTO "Request-Medicines" ("Request_id_fk", "Medicine_id_fk") VALUES($1,$2)',[req.body.idReq,req.body.idM[ym]],function(err3,result3){
                                    if (err3) {console.log(err3)}
                                    else{
                                        client.query('COMMIT')
                                    }
                                })
                                client.query('COMMIT')

                            }
                            client.query('COMMIT')
                        }
                        client.query('COMMIT')
                    }))
                    client.query('COMMIT')
                }
                res.json({})
                client.release()
            }
            catch(e){
                throw(e)
            }
    })
    app.post('/account_doctor_add_IR', jsonParser,async function (req, res){
        try{
            console.log(req.body);
            const client = await pool.connect()
            await client.query('BEGIN')
            for (let yq=0;yq<req.body.idI.length; yq++){
                await JSON.stringify(client.query('select id from "Requests-Analysis" where "Request_id_fk"=$1 and "Analysis_id_fk"=$2',[req.body.idReq,req.body.idI[yq]], function(err2, result2){
                    if (err2){console.log(err2)} else {
                        if (result2.rowCount===0){
                            client.query('INSERT INTO "Requests-Analysis" ("Request_id_fk", "Analysis_id_fk") VALUES($1,$2)',[req.body.idReq,req.body.idI[yq]],function(err3,result3){
                                if (err3) {console.log(err3)}
                                else{
                                    client.query('COMMIT')
                                }
                            })
                            client.query('COMMIT')

                        }
                        client.query('COMMIT')
                    }
                    client.query('COMMIT')
                }))
                client.query('COMMIT')
            }client.release()
            res.json({})
        }
        catch(e){
            throw(e)
        }
})

    app.post('/account_doctor', jsonParser , async function (req, res){
        try{
            console.log(req.body);
            const client = await pool.connect()
            await client.query('BEGIN')
            await JSON.stringify(client.query('UPDATE public."Requests" SET  "AcceptTime"=$1, "Brigade_id_fk"=$2 WHERE id=$3',[req.body.dA,req.body.idBrig, req.body.idReq],function(err,result){
                if(err){res.flash('danger','Ошибка с обновлением данных');
                        res.redirect('/account_doctor')}
                else {
                    client.query('COMMIT');
                    console.log('Update success');
                    return;
                }
            }))
            client.release()
            const client2 = await pool.connect()
            await client2.query('BEGIN')
            await JSON.stringify(client2.query('select "Requests".id, "InformalDescription","RequestTime","AcceptTime", "PatientSurname", "PatientName","PatientMiddleName","PatientAddress" from "Requests" left join "Patients" on "Requests"."Patient_fk"="Patients".id where "Requests".id=$1',[req.body.idReq], function(err1, result1){
                if(err1){console.log(err1)
                    req.flash('danger', "Ошибка с поиском Вызовов")
                res.redirect('/account_doctor')
                        }
                else {
                    console.log(result1.rows);
                    client2.query('select id, "Symptom_name" from "Symptoms"',[],function(err2,result2){
                        if(err2){console.log(err2)
                            req.flash('danger', "Ошибка с поиском Симптомов")
                            res.redirect('/account_doctor')}
                        else{
                            console.log(result2.rows)
                            client2.query('select id, "AnalysisName" from "Analysis"',[],function(err3,result3){
                                if(err3){console.log(err3)
                                    req.flash('danger', "Ошибка с поиском Исследования")
                                res.redirect('/account_doctor')}
                                else{
                                    console.log(result3.rows)
                                    res.json({
                                        ReqData: result1.rows,
                                        SymData:result2.rows,
                                        IsData:result3.rows,
                                        messages: {
                                            danger: req.flash('danger'),
                                            warning: req.flash('warning'),
                                            success: req.flash('success')
                                        }

                                    })
                                    client2.query('COMMIT')
                                    }})
                                }
                            })
                        }
                    })
            )
            client2.release()
        }
        catch (e) {
            throw(e)
        }

    })
    app.get('/account', ensureAuthenticated, async function (req, res) {
        console.log("typeWorker:", req.user[0].typeWorker);
        //в зависимости от этого рендер страниц
        switch (req.user[0].typeWorker) {
            case 'бухгалтер-регистратор':
                res.render('account', {
                    title: "Работник",
                    userData: req.user,
                    messages: {
                        danger: req.flash('danger'),
                        warning: req.flash('warning'),
                        success: req.flash('success')
                    }
                });
                break;
            case 'врач':
                res.redirect('/account_doctor')
                break;
            case 'Врач':
                    res.redirect('/account_doctor')
                    break;    
            case "администратор":
                try {
                    const client = await pool.connect()
                    await client.query('BEGIN')
                    await JSON.stringify(client.query('select "Symptom_name" from "Symptoms"', [], function (err, result) {
                        JSON.stringify(client.query('select "Diagnosis_name" from "Diagnosis"', [], function (err1, result1) {


                            if (err) {
                                console.log("Mistake")
                            } else {
                                //console.log(result.rows)
                                res.render('account_admin', {
                                    userData: req.user,
                                    list_values: result.rows,
                                    list_values_diagnosis: result1.rows,
                                    messages: {
                                        danger: req.flash('danger'),
                                        warning: req.flash('warning'),
                                        success: req.flash('success')
                                    }
                                })
                            }

                        }))


                    }))
                } catch (e) {
                    throw(e)
                }

        
                break;
            case 'фельдшер':
                res.redirect('/account_doctor')
                break;
            case 'Фельдшер':
                    res.redirect('/account_doctor')
                    break;
            default:
                console.log("Ошибка! Неизвестный тип работника.");
                res.redirect('/');
                break;
        }
    });
    app.get('/account_otch', ensureAuthenticated, async function(req, res){
        try {
            const client = await pool.connect()
            await client.query('BEGIN')
            await JSON.stringify(client.query('select id,"BrigadeName" from "Brigades"',[], function (err, result){
            if (err) {console.log("Mistake")} else{
                console.log(result.rows)
                res.render('account_otch',{
                    userData:req.user,
                    BrigadeData:result.rows,
                    messages: {danger: req.flash('danger'), warning: req.flash('warning'), success: req.flash('success')}
                })
            }
        }))
        } catch (e) {
            throw(e)
        }

    } )
    app.get('/account_otch_pat',ensureAuthenticated, async function(req,res){
        try{
            const client=await pool.connect()
            await client.query('BEGIN')
            await JSON.stringify(client.query('select id, "PatientName","PatientSurname","PatientMiddleName" from "Patients"',[], function(err, result){
                if (err){console.log(err)}
                else {
                    console.log(result.rows)
                    res.render('account_otch_pat',{
                        userData:req.user,
                        PatientData:result.rows,
                        messages: {danger: req.flash('danger'), warning: req.flash('warning'), success: req.flash('success')}
                    })
                }
            }))
        } catch (e){
            throw(e)
        }
    })
    app.post('/account', async function (req, res) {
        try {
            console.log(req.body);
            //Порядок запросов:1. Поиск в БД Страховой компании (получаем ее ид), если нет то добавляем введенную в БД, ищем id.
            //2. Поиск пациента в бд(id, adress). Если есть, то сравниваем адрес. Адрес не совподает-> меняем адрес. Пациента нет в БД: Добавляем, получаем id.
            //3 Добавляем в БД вызов с введенными данными и полученными id из пункта 1 и пункта 2.
            const client = await pool.connect()
            await client.query('BEGIN')
            let user={};
            await JSON.stringify(client.query('select id from "Insurance" where "InsuranceName"=$1', [req.body.str], function (err, result) {
                if (err){console.log("Ошибка с поиском Страховой компании1")}
                console.log(result.rowCount);
                //1 пункт (не проверяла)
                if (result.rowCount===0)//Проверка на количество строк
                { client.query('INSERT INTO "Insurance" ("InsuranceName", "InsurancePayType") VALUES ($1, $2)',[req.body.str, req.body.typOp],function (err1, result1){
                    if (err1) {
                        console.log('Ошибка с добавлением в таблицу Страховки.')
                    }
                    else {
                        client.query('COMMIT')
                        console.log( 'Страховая компания добавлена.')
                        return;
                    }}
                    )
                }
            }
            ))
            client.release()
            const client2 = await pool.connect()
            await client2.query('BEGIN')
            await JSON.stringify(client2.query('select id from "Insurance" where "InsuranceName"=$1', [req.body.str], function (err2, result2) {
                if (err2){console.log("Ошибка с поиском Страховой компании2")} else {
                    console.log(result2.rows[0].id)
                    user.id=result2.rows[0].id;
                    client2.query('COMMIT')
                    return;
                }
            }))
            client2.release()
            const client3 = await pool.connect()
            await client3.query('BEGIN')
            await JSON.stringify(client3.query('select id, "PatientAddress" from "Patients" where "PatientName"=$1 and "PatientSurname"=$2 and "PatientMiddleName"=$3',[req.body.name, req.body.surname, req.body.Lastname], function (err3, result3){


                if (err3)
                {
                    console.log("Ошибка с поиском пациента 1")
                }
                else{
                    if(result3.rowCount===0){
                        client3.query('INSERT INTO "Patients" ("PatientName","PatientSurname","PatientMiddleName", "PatientAddress","InsuranceId_fk", "InBlackList") VALUES($1,$2,$3,$4,$5,$6)',[req.body.name, req.body.surname, req.body.Lastname, req.body.adress, user.id, 'false'], function (err5, result5){
                            if (err5) {
                                console.log('Ошибка с добавлением в таблицу Пациента.')
                            }
                            else {
                                client3.query('COMMIT')
                                console.log('Пациент добавлен.')
                                return
                            }
                            }  )
                        }
                    }
                }
                    )
                    )
            client3.release()
            const client4 = await pool.connect()
            await client4.query('BEGIN')
            await JSON.stringify(client4.query('select id, "PatientAddress" from "Patients" where "PatientName"=$1 and "PatientSurname"=$2 and "PatientMiddleName"=$3',[req.body.name, req.body.surname, req.body.Lastname], function (err6, result6){
                if (err6) {
                    console.log("Ошибка с поиском пациента")
                }
                else{
                    console.log(result6.rows[0].id)
                    user.pol_id=result6.rows[0].id
                    if (result6.rows[0].PatientAddress!=req.body.adress){
                        client4.query('UPDATE "Patients" SET "PatientAddress"=$4 where "PatientName"=$1 and "PatientSurname"=$2 and "PatientMiddleName"=$3',[req.body.name, req.body.surname, req.body.Lastname, req.body.adress],function(err7, result7){
                            if (err7) {console.log("Ошибка с обновлением данных")}
                                else{console.log("Адресс обновлен")
                                client4.query('COMMIT')
                                return
                            }
                    })

                    }
            }}))
            client4.release()
            const client5 = await pool.connect()
            await client5.query('BEGIN')
            console.log(user.pol_id)
            await JSON.stringify(client5.query('INSERT INTO "Requests" ("Patient_fk","InformalDescription", "RequestTime") VALUES($1,$2,$3)',[user.pol_id,req.body.ops, req.body.date], function (err8, result8) {
                    if (err8){
                        req.flash('danger','Ошибка')
                        res.redirect('/account')
                } else {
                    client.query('COMMIT')
                    req.flash('sucess','Вызов принят')
                    res.redirect('/account')
                    return;
                }}))
            client5.release();
            }
        catch (e) {
            throw(e)
        }
    });
    app.post('/search_brigade', jsonParser, async function(req,res){
        try{
            console.log(req.body);

                const client = await pool.connect()
                await client.query('BEGIN')
                await JSON.stringify(client.query('select "WorkerSurname", "WorkerName","WorkerMiddleName", "WorkerType" from "Workers" where "Brigade_fk"=$1',[req.body.idBrigades], function(err1, result1){
                    if(err1) {console.log(err1)}
                        else{
                            console.log(result1.rows)
                            client.query('select id, "AcceptTime","EndRequestTime" from "Requests" where "Brigade_id_fk"=$1 order by "AcceptTime" desc LIMIT 10',[req.body.idBrigades],function(err, result){
                                if (err) {console.log(err)} else{
                                    console.log(result.rows);
                                    console.log(result1.rows);
                                    res.json({
                                        work:result1.rows,
                                        req:result.rows
                                    })
                                    client.query('COMMIT')
                                }
                            })
                        }}))
            client.release()
            }
            catch(e){throw(e)}
    }

    )
    app.get('/login', forwardAuthenticated,function (req, res) {
        console.log('3fsf')

        res.render('login', {
                title: "Log in",
                userData: req.user,
                messages: {danger: req.flash('danger'), warning: req.flash('warning'), success: req.flash('success')}
            });


    });
    app.post('/account_otch_pat',jsonParser, async function(req,res){
        try{
            console.log(req.body);

            const client = await pool.connect()
                await client.query('BEGIN')
                await JSON.stringify(client.query('select "PatientName","PatientSurname","PatientMiddleName","PatientAddress","InBlackList", "InsuranceName", "InsurancePayType" from "Patients" ' +
                'left join "Insurance" I on "Patients"."InsuranceId_fk" = I.id where "Patients".id=$1',[req.body.idPat],function (err, result){
                    if (err){ console.log(err)}
                    else {
                        console.log(result.rows)
                        client.query('select "Requests".id, "RequestTime","Hospitalization", "Diagnosis_name" from "Requests" left join "Diagnosis" on "Requests"."Diagnosis_id_fk"="Diagnosis".id where  "Patient_fk"=$1',[req.body.idPat], function(err1, result1){
                            if (err1) {console.log(err1)} else {
                                console.log(result1.rows)
                                res.json({
                                    Pat:result.rows,
                                    res: result1.rows
                                })
                                client.query('COMMIT')
                            }
                        })
                    }
                }))
            client.release()
        }
        catch(e){throw(e)}
    })
    app.post('/close_req',async function (req, res){
        try{
            console.log(req.body)
            if (req.body.BlackList==='on'){
                const client = await pool.connect()
                await client.query('BEGIN')
                await JSON.stringify(client.query('UPDATE "Patients" SET "InBlackList"=$4 where "PatientName"=$1 and "PatientSurname"=$2 and "PatientMiddleName"=$3',[req.body.name, req.body.surname, req.body.Lastname, 'true'],function(err, result){
                    if (err){console.log(err)}
                    else{
                        client.query('COMMIT')
                    }
                }))
                client.release()
            }
            if (req.body.Hospitalization==='on'){
                const client1 = await pool.connect()
                await client1.query('BEGIN')
                await JSON.stringify(client1.query('UPDATE "Requests" SET "Hospitalization"=$2, "Distance"=$3 where "id"=$1',[req.body.idRReq, 'true',req.body.Rasstoynie],function(err1, result){
                    if (err1){console.log(err1)}
                    else{
                        client1.query('COMMIT')
                    }
                }))
                client1.release()
            }
            const client2 = await pool.connect()
                await client2.query('BEGIN')
                await JSON.stringify(client2.query('UPDATE "Requests" SET "ArriveTime"=$2, "EndRequestTime"=$3,"RefundTime"=$4, "Count"=$5 where "id"=$1',[req.body.idRReq,req.body.dateArrive,req.body.dateEndRequestTime,req.body.dateRefund,req.body.countReq ],function(err1, result){
                    if (err1){console.log(err2)}
                    else{
                        client2.query('COMMIT')
                        res.redirect('/account_doctor')
                    }
                }))
                client2.release()
        }
        catch(e){
            throw(e)
        }
    })
    //ДОБАВИТЬ проверку существующего диагноза
    app.post('/add_diagnosis_symptoms', jsonParser, async function (req, res) {
        try {
            //console.log(req.body.diagnosis_name);
            const client = await
            pool.connect()
            await
            client.query('BEGIN')
            await
                JSON.stringify(client.query('select id from "Diagnosis" where "Diagnosis_name"=$1', [req.body.diagnosis_name], function (err, result) {
                if (err) {
                    console.log(err)
                    console.log("return")
                    return
                } else {
                    if (result.rows != "") {
                        res.json({
                            answer: 1//такой диагноз уже есть
                        })
                    } else {
                        client.query('INSERT INTO "Diagnosis" (id, "Diagnosis_name") VALUES (DEFAULT, $1)', [req.body.diagnosis_name], function (err, result) {
                            if (err) {
                                console.log(err)
                            } else {


                                // console.log(result.rows)
                                client.query('select id from "Diagnosis" where "Diagnosis_name"=$1', [req.body.diagnosis_name], function (err1, id_diagnosis) {
                                    if (err1) {
                                        console.log(err1)
                                    } else {
                                        //console.log("id=",id_diagnosis.rows[0].id)

                                        for (var i = 0; i < req.body.symptom_name.length; i++) {

                                            client.query('select id from "Symptoms" where "Symptom_name"=$1', [req.body.symptom_name[i]], function (err2, id_symptom) {
                                                if (err2) {
                                                    console.log(err2)
                                                } else {


                                                    client.query('insert into "Diagnosis-Symptoms" ("Diagnosis_id_fk", "Symptoms_id_fk") VALUES ($1,$2)', [id_diagnosis.rows[0].id, id_symptom.rows[0].id], function (err3, result) {
                                                        if (err3) {
                                                            console.log(err3)
                                                        } else {


                                                            client.query('COMMIT')
                                                        }
                                                    })


                                                    client.query('COMMIT')
                                                }
                                            })

                                        }

                                        client.query('COMMIT')
                                    }
                                })
                            }

                            client.query('COMMIT');

                        })
                        res.json({
                            answer: 2
                        })
                    }
                }
            }))
            client.release()
        } catch (e) {
            throw(e)
        }
    }

)
    app.post('/add_brigade', jsonParser, async function(req,res){
        try{
            console.log(req.body)
            const client = await pool.connect()
            await client.query('BEGIN')
            client.query('select id from "Brigades" where "BrigadeName"=$1',[req.body.brigade_name1],function(err,result){
                if(err){console.log(err)
                        res.json({
                            flag: 'false'
                        }
                        )}else {
                    if(result.rowCount===0){
                        client.query('INSERT INTO "Brigades" ("BrigadeName") VALUES ($1)',[req.body.brigade_name1], function(err1,result1){
                            if(err1){console.log(err1)} else{
                                res.json({
                                    flag: 'true'
                                })
                                client.query('COMMIT')
                                client.release()
                            }
                        })
                        
                    } else {
                        res.json({flag:'false'})
                    }
                }
            })
            
        }
        catch(e){
            throw(e)
        }
    })

    app.post('/add_symptom', jsonParser, async function (req, res) {

        try {
            console.log(req.body)
            const client = await pool.connect()
            await client.query('BEGIN')

            client.query('select id from "Symptoms" where "Symptom_name"=$1', [req.body.symptom_name], function (err, result) {
                if (err) {
                    console.log(err)
                    console.log("Mistake")
                    console.log("return")
                    return
                } else {
                    if (result.rows != "") {
                        res.json({
                            answer: 1//такой диагноз уже есть
                        })
                    } else {


                        client.query('insert into "Symptoms" (id,"Symptom_name") values (default, $1)', [req.body.symptom_name], function (err, result) {
                            if (err) {
                                console.log("Mistake")

                            } else {
                                client.query('COMMIT');
                                client.release();
                            }
                        })
                        res.json({
                            answer: 2
                        })
                    }
                }
            })


        } catch (e) {
            throw(e)
        }
    });

    app.post('/add_analysis', jsonParser, async function (req, res) {

        try {
            const client = await pool.connect()
            await client.query('BEGIN')
            client.query('insert into "Analysis" (id,"AnalysisName") values (default, $1)', [req.body.analysis_name], function (err, result) {
                if (err) {
                    console.log("Mistake")
                } else {
                    client.query('COMMIT');
                    client.release();
                }
            })
        } catch (e) {
            throw(e)
        }
    });

    //ДОБАВИТЬ проверку существующего лекарства
    app.post('/add_medicine', jsonParser, async function (req, res) {
            try {
                //console.log(req.body.diagnosis_name);
                const client = await
                    pool.connect()
                await
                    client.query('BEGIN')
                await
                    JSON.stringify(client.query('INSERT INTO "Medicines" (id, "Medicines_name") VALUES (DEFAULT, $1)', [req.body.medicine_name], function (err, result) {
                        if (err) {
                            console.log(err)
                        } else {
                            // console.log(result.rows)
                            client.query('select id from "Medicines" where "Medicines_name"=$1', [req.body.medicine_name], function (err1, id_medicine) {
                                if (err1) {
                                    console.log(err1)
                                } else {
                                    client.query('select id from "Diagnosis" where "Diagnosis_name"=$1', [req.body.diagnosis], function (err2, id_diagnosis) {
                                        if (err2) {
                                            console.log(err2)
                                        } else {
                                            client.query('insert into "Diagnosis-Medicines" ("Diagnosis_id_fk", "Medicines_id_fk") VALUES ($1,$2)', [id_diagnosis.rows[0].id, id_medicine.rows[0].id], function (err3, result) {
                                                if (err3) {
                                                    console.log(err3)
                                                } else {
                                                    client.query('COMMIT')
                                                }
                                            })
                                            client.query('COMMIT')
                                        }
                                    })
                                    client.query('COMMIT')
                                }
                            })
                        }
                    }))
                client.release()
            } catch (e) {
                throw(e)
            }
        }
    )
    app.post('/delete_analysis', jsonParser, async function(req,res){
        try{
            console.log(req.body);
        const client = await pool.connect()
        await client.query('BEGIN')
        await JSON.stringify(client.query('select id from "Analysis" where "AnalysisName"=$1',[req.body.analysis_name1],function(err1,result1){
            if (err1){console.log(err1)}else{
                if(result1.rowCount===0){
                    res.json({
                    flag: 'false'
                })
                } else {
                    client.query('delete from "Analysis" where "AnalysisName"=$1',[req.body.analysis_name1],function (err,result){
                    if (err){
                        console.log(err)
                    }
                    else {
                        res.json({
                            flag: 'true'
                        })
                    client.query('COMMIT');
                    client.release();
                }
                }
                    )
        }}}
            
        ))
        }
        catch(e){throw(e)}
        
    })
    app.post('/delete_symptom', jsonParser, async function(req,res){
        try{
            console.log(req.body);
        const client = await pool.connect()
        await client.query('BEGIN')
        await JSON.stringify(client.query('select id from "Symptoms" where "Symptom_name"=$1',[req.body.symptom_name1],function(err1,result1){
            if (err1){console.log(err1)}else{
                if(result1.rowCount===0){
                    res.json({
                    flag: 'false'
                })} else {
                client.query('delete from "Symptoms" where "Symptom_name"=$1',[req.body.symptom_name1],function (err,result){
                    if (err){
                        console.log(err)
                    }
                    else {
                        res.json({
                            flag: 'true'
                        })
                        client.query('COMMIT');
                        client.release();
            }
        })
        }

    }}
        ))
        }
        catch(e){
            throw(e)
        }})
    app.post('/delete_brigada', jsonParser, async function(req,res){
        try{
            console.log(req.body);
        const client = await pool.connect()
        await client.query('BEGIN')
        await JSON.stringify(client.query('select id from "Brigades" where "BrigadeName"=$1',[req.body.brigade_name1], function(err1,result1){
            if (err1){console.log(err1)}
            else{
                if(result1.rowCount===0){
                    res.json({
                    flag: 'false'
                })
                } 
                else {
                    client.query('delete from "Brigades" where "BrigadeName"=$1',[req.body.brigade_name1],function (err,result){
            if (err){
                console.log(err)
                
            }
            else {
                res.json({
                    flag: 'true'
                })
                client.query('COMMIT');
                client.release();
            }
        })
                }
            }
        }))
        }
        catch(e){
            throw(e)
        }
        
            
    })
    app.post('/delete_medicine', jsonParser, async function(req,res){
        try{
            console.log(req.body);
        const client = await pool.connect()
        await client.query('BEGIN')
        await JSON.stringify(client.query('select id from "Medicines" where "Medicines_name"=$1',[req.body.medicine_name1], function(err1,result1){
            if (err1){console.log(err1)}
            else{
                if(result1.rowCount===0){
                    res.json({
                    flag: 'false'
                })
                } 
                else {
                    client.query('delete from "Medicines" where "Medicines_name"=$1',[req.body.medicine_name1],function (err,result){
            if (err){
                console.log(err)
                
            }
            else {
                res.json({
                    flag: 'true'
                })
                client.query('COMMIT');
                client.release();
            }
        })
                }
            }
        }))
        }
        catch(e){
            throw(e)
        }
        
            
    })
    app.post('/delete_medicine_diag',jsonParser, async function(req,res){
        try{
            console.log(req.body);
            const client = await pool.connect()
            await client.query('BEGIN')
            await JSON.stringify(client.query('select id from "Medicines" where "Medicines_name"=$1',[req.body.medicine_name], function(err1,result1){
            if (err1){console.log(err1)}
            else{
                if(result1.rowCount===0){
                    res.json({
                    flag: 'false1'
                })
                } 
                else {
                    client.query('select id from "Diagnosis" where "Diagnosis_name"=$1', [req.body.diagnosis],function(err2,result2){
                        if(err2){console.log(err2)}else{
                            if(result2.rowCount===0){
                                res.json({
                                    flag: 'false2'
                                })
                            } else {
                                client.query('select id from "Diagnosis-Medicines" where "Diagnosis_id_fk"=$2 and "Medicines_id_fk"=$1', [result1.rows[0].id, result2.rows[0].id], function(err3,result3){
                                    if(err3){console.log(err3)}
                                    else {
                                        if (result3.rowCount===0){
                                            res.json({
                                                flag: 'false3'
                                            })
                                        }
                                        else {
                                            client.query('delete from "Diagnosis-Medicines" where "Diagnosis_id_fk"=$2 and "Medicines_id_fk"=$1',[result1.rows[0].id,result2.rows[0].id],function (err,result){
                                    if (err){
                                        console.log(err)
                                        }
                                    else {
                                        res.json({
                                            flag: 'true'
                                        })
                                                client.query('COMMIT');
                                                client.release();
                                    }
        })
                                        }
                                    }
                                })
                                
                            }
                        }
                    })
                    
                }
            }
        }))

        }
        catch(e){
            throw(e)
        }
    })
    app.post('/delete_diagnosis', jsonParser, async function(req,res){
        try{
            console.log(req.body);
        const client = await pool.connect()
        await client.query('BEGIN')
        await JSON.stringify(client.query('select id from "Diagnosis" where "Diagnosis_name"=$1',[req.body.diagnosis_name1], function(err1,result1){
            if (err1){console.log(err1)}
            else{
                if(result1.rowCount===0){
                    res.json({
                    flag: 'false'
                })
                } 
                else {
                    client.query('delete from "Diagnosis" where "Diagnosis_name"=$1',[req.body.diagnosis_name1],function (err,result){
            if (err){
                console.log(err)
                
            }
            else {
                res.json({
                    flag: 'true'
                })
                client.query('COMMIT');
                client.release();
            }
        })
                }
            }
        }))
        }
        catch(e){
            throw(e)
        }
        
            
    })   
    app.post('/delete_diagnosis_symptoms',jsonParser, async function(req,res){
        try{
            console.log(req.body);
            const client = await pool.connect()
            await client.query('BEGIN')
            await JSON.stringify(client.query('select id from "Diagnosis" where "Diagnosis_name"=$1',[req.body.diagnosis_name], function(err1,result1){
                if (err1){console.log(err1)}
                else{
                    if(result1.rowCount===0){
                        res.json({
                        flag: 'false'
                    })
                    } 
                    else {
                        let mas_flag=[]
                        for (let okl=0;okl<req.body.symptom_name.length;okl++){
                            client.query('select id, "Symptom_name" from "Symptoms" where "Symptom_name"=$1', [req.body.symptom_name[okl]], function (err2, id_symptom) {
                                if (err2) {
                                    console.log(err2)
                                } else {
                                    if(id_symptom.rowCount===0){
                                        let a={}
                                        a.id=id_symptom.rows[0].Symptom_name
                                        a.flag='false1'
                                        mas_flag.push(a)
                                        if(okl===req.body.symptom_name.length-1){
                                            console.log("Sympt")
                                            console.log(mas_flag)
                                            res.json({
                                                flag:mas_flag
                                                })
                                        }
                                    } else {
                                        client.query('select id from "Diagnosis-Symptoms" where "Diagnosis_id_fk"=$1 and "Symptoms_id_fk"=$2 ',[result1.rows[0].id,id_symptom.rows[0].id], function(err3, result2){
                                            if(err3) {console.log(err3)}
                                            else {
                                                if(result2.rowCount===0){
                                                    let b={}
                                                    b.id=id_symptom.rows[0].Symptom_name
                                                    b.flag='false2'
                                                    mas_flag.push(b)
                                                    if(okl===req.body.symptom_name.length-1){
                                                        console.log(mas_flag)
                                                        console.log("DIAGNOSO-SYMPT")
                                                        res.json({
                                                            flag:mas_flag
                                                            })
                                                    }
                                                } else {
                                                    client.query('delete from "Diagnosis-Symptoms" where "Diagnosis_id_fk"=$1 and "Symptoms_id_fk"=$2 ',[result1.rows[0].id,id_symptom.rows[0].id], function (err4,result3){
                                                        if(err4) {console.log(err4)
                                                            let d={}
                                                            d.id=id_symptom.rows[0].Symptom_name
                                                            d.flag='false3'
                                                            mas_flag.push(d)
                                                            if(okl===req.body.symptom_name.length-1){
                                                                console.log('MISTAKE DELETE')
                                                                console.log(mas_flag)
                                                                res.json({
                                                                    flag:mas_flag
                                                                    })
                                                            }
                                                        }
                                                        else {
                                                            let c={}
                                                            c.id=id_symptom.rows[0].Symptom_name
                                                            c.flag='true'
                                                            mas_flag.push(c)
                                                            client.query('COMMIT')
                                                            if(okl===req.body.symptom_name.length-1){
                                                                console.log('DELETE')
                                                                console.log(mas_flag)
                                                                res.json({
                                                                    flag:mas_flag
                                                                    })

                                                            }
                                                        }
                                                    })
                                                }
                                            }
                                        })
                                        client.query('COMMIT')
                                    }
                                } 
                                
                            })
                            client.query('COMMIT')
                        }
                        client.release()
                        
                    }
                }}))
        }
        catch(e){
            throw(e)
        }
    })


    app.post('/update_diagnosis', jsonParser, async function(req,res){
        try{
            let mas_flag = 'default'

            async function setflag(a) {
                switch (a) {
                    case 1:
                        res.json({
                            flag: 'false1'
                        })
                        break;
                    case 2:
                        res.json({
                            flag: 'false2'
                        })
                        break
                    case 3:
                        res.json({
                            flag: 'false3'
                        })
                        break
                    case 4:
                        res.json({
                            flag: 'true'
                        })
                        break
                }
            }
            console.log(req.body);
            const client = await pool.connect()
            await client.query('BEGIN')
            // let mas_flag=[]
            mas_flag = 'default'
            await JSON.stringify(client.query('select id from "Diagnosis" where "Diagnosis_name"=$1',[req.body.diagnosis_name], function(err1,result1){
                if (err1){console.log(err1)}
                else{
                    if(result1.rowCount===0){
                        res.json({
                        flag: 'false'
                    })
                    }
                    else {

                        for (let okl=0;okl<req.body.symptom_name.length;okl++){

                        client.query('select id, "Symptom_name" from "Symptoms" where "Symptom_name"=$1', [req.body.symptom_name[okl]], function (err2, id_symptom) {
                                if (err2) {
                                    console.log(err2)
                                } else {
                                    if(id_symptom.rowCount===0){
                                        let a={}
                                        a.id=id_symptom.rows[0].Symptom_name
                                        a.flag='false1'
                                        //mas_flag.push(a)
                                        setflat();
                                        //mas_flag='false1'
                                        setflag(1);
                                        //if(okl===req.body.symptom_name.length-1){
                                        //    console.log("Sympt")
                                        //    console.log(mas_flag)
                                        //    res.json({
                                        //        flag:mas_flag
                                        //       })
                                        //}
                                    } else {
                                        client.query('select id from "Diagnosis-Symptoms" where "Diagnosis_id_fk"=$1 and "Symptoms_id_fk"=$2 ',[result1.rows[0].id,id_symptom.rows[0].id], function(err3, result2){
                                            if(err3) {console.log(err3)}
                                            else {
                                                if(result2.rowCount===0){
                                                    client.query('INSERT INTO "Diagnosis-Symptoms" ("Diagnosis_id_fk","Symptoms_id_fk") VALUES($1,$2) ',[result1.rows[0].id,id_symptom.rows[0].id], function (err4,result3){
                                                        if(err4) {console.log(err4)
                                                            let d={}
                                                            d.id=id_symptom.rows[0].Symptom_name
                                                            d.flag='false3'
                                                            setflag(3);

                                                            //mas_flag.push(d)
                                                            //mas_flag='false3'
                                                            console.log('MISTAKE DELETE')
                                                            //console.log(mas_flag)

                                                        }
                                                        else {
                                                            let c={}
                                                            c.id=id_symptom.rows[0].Symptom_name
                                                            c.flag='true'
                                                            // mas_flag.push(c)
                                                            //mas_flag='true'
                                                            setflag(4);

                                                            console.log('INSERT')
                                                            //console.log(mas_flag)
                                                            client.query('COMMIT')
                                                            //if(okl===req.body.symptom_name.length-1){
                                                            //
                                                            //    console.log(mas_flag)
                                                            //    res.json({
                                                            //        flag:mas_flag
                                                            //        })

                                                            //}
                                                        }

                                                    }
                                                    )} else {
                                                    let b={}
                                                    b.id=id_symptom.rows[0].Symptom_name
                                                    b.flag='false2'
                                                    //mas_flag.push(b)
                                                    //mas_flag='false2'
                                                    setflag(2);

                                                    console.log("DIAGNOSO-SYMPT")
                                                    //console.log(mas_flag)
                                                    }
                                                }
                                            }
                                        )}
                                        client.query('COMMIT')
                                    }
                            }

                            )

                            client.query('COMMIT')
                        }
                        client.release()

                    }
                }}))
            console.log("перед отправкой")
            //console.log(mas_flag[mas_flag.l)
            console.log(mas_flag)

        }
        catch(e){
            throw(e)
        }
    })
    app.post('/update_medicine_diag',jsonParser, async function(req,res){
        try{
            console.log(req.body);
            const client = await pool.connect()
            await client.query('BEGIN')
            await JSON.stringify(client.query('select id from "Medicines" where "Medicines_name"=$1',[req.body.medicine_name], function(err1,result1){
            if (err1){console.log(err1)}
            else{
                if(result1.rowCount===0){
                    res.json({
                    flag: 'false1'
                })
                } 
                else {
                    client.query('select id from "Diagnosis" where "Diagnosis_name"=$1', [req.body.diagnosis],function(err2,result2){
                        if(err2){console.log(err2)}else{
                            if(result2.rowCount===0){
                                res.json({
                                    flag: 'false2'
                                })
                            } else {
                                client.query('select id from "Diagnosis-Medicines" where "Diagnosis_id_fk"=$2 and "Medicines_id_fk"=$1', [result1.rows[0].id,result2.rows[0].id], function(err3,result3){
                                    if(err3){console.log(err3)}
                                    else {
                                        if (result3.rowCount!=0){
                                            res.json({
                                                flag: 'false3'
                                            })
                                        }
                                        else {
                                            client.query('INSERT INTO "Diagnosis-Medicines" ("Diagnosis_id_fk", "Medicines_id_fk") VALUES($2,$1)',[result1.rows[0].id,result2.rows[0].id],function (err,result){
                                    if (err){
                                        console.log(err)
                                        }
                                    else {
                                        res.json({
                                            flag: 'true'
                                        })
                                        client.query('COMMIT');
                                        client.release();
                                    }
        })
                                        }
                                    }
                                })
                                
                            }
                        }
                    })
                    
                }
            }
        }))
        }
        catch(e){
            throw(e)
        }
    })
    
    app.get('/logout', function (req, res) {
        console.log(req.isAuthenticated());
        req.logout();
        console.log(req.isAuthenticated());
        req.flash('success', "Logged out. See you soon!");
        res.redirect('/');
    });

    app.post('/account_zp',jsonParser,async function(req,res){
        try{
            console.log(req.body);
            const client = await pool.connect()
            await client.query('BEGIN')
            await JSON.stringify(client.query('select I."l", I."WorkerSurname",I."WorkerName",I."WorkerMiddleName",I."WorkerType", V."s" from (select "Brigades".id "l","BrigadeName", "WorkerSurname","WorkerName","WorkerMiddleName","WorkerType" from "Brigades" Right join "Workers" on "Brigades".id="Workers"."Brigade_fk") as I left join (select sum("Count") as "s","Brigade_id_fk" as "m" from "Requests" where (EXTRACT(month from"RequestTime")=$1) and (EXTRACT(year from"RequestTime")=$2) group by "m") as V on I."l"=V."m"',[req.body.idMonth,req.body.idYear ], function(err, result){
                if(err){console.log(err)}else{
                    console.log(result.rows)
                    res.json({
                        res:result.rows
                    })
                    client.query('COMMIT')
                }
            }))
            client.release()
        }
        catch (e) {
            throw(e)
        }
    })
    app.get('/account_by',ensureAuthenticated, function (req, res){
        res.render('account_by', {
            userData: req.user,
            messages: {danger: req.flash('danger'), warning: req.flash('warning'), success: req.flash('success')}
        });
    } )
    app.post('/login', passport.authenticate('local', {
            successRedirect: '/account',
            failureRedirect: '/login',
            failureFlash: true
            }), function(req, res) {
            if (req.body.remember) {
            req.session.cookie.maxAge = 30 * 24 * 60 * 60 * 1000; // Cookie expires after 30 days
            } else {
            req.session.cookie.expires = false; // Cookie expires at end of session
            }
            res.redirect('/account');
            });

}

passport.use('local', new LocalStrategy({passReqToCallback: true}, (req, username, password, done) => {

        loginAttempt();

        async function loginAttempt() {
            const client = await pool.connect()
            try {
                await client.query('BEGIN')
                var currentAccountsData = await JSON.stringify(client.query('select "WorkerSurname", "WorkerName", "WorkerMiddleName", "WorkerType", "Brigade_fk", "Login", "Password" from "Workers" where "Login"=$1'
                    , [username], function (err, result) {
                        if (err) {
                            return done(err)
                        }
                        if (result.rows[0] == null) {
                            console.log("HELLO");

                            req.flash('danger', "Oops. Incorrect login details.");
                            return done(null, false);
                        } else {
                            bcrypt.compare(password, result.rows[0].Password, function (err, check) {
                                if (err) {
                                    console.log(password, result.rows[0].Password);
                                    console.log('Error while checking password');
                                    return done();
                                } else if (check) {
                                    console.log('Удачно')
                                    return done(null, [{
                                        email: result.rows[0].Login,
                                        firstName: result.rows[0].WorkerSurname,
                                        name: result.rows[0].WorkerName,
                                        MiddleName: result.rows[0].WorkerMiddleName,
                                        typeWorker: result.rows[0].WorkerType,
                                        NumBr: result.rows[0].Brigade_fk
                                    }]);
                                } else {
                                    req.flash('danger', "Oops. Incorrect login details.");
                                    return done(null, false);
                                }
                            });
                        }
                    }))
            } catch (e) {
                throw (e);
            }
        };

    }
))


passport.serializeUser(function (user, done) {
    done(null, user);
});

passport.deserializeUser(function (user, done) {
    done(null, user);
});
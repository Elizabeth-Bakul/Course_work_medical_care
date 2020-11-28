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
            const client = await pool.connect()
            await client.query('BEGIN')
            var pwd = await bcrypt.hash(req.body.password, 5);
            await JSON.stringify(client.query('SELECT id FROM "Workers" WHERE "Login"=$1', [req.body.username], function (err, result) {
                if (result.rows[0]) {
                    req.flash('warning', 'This email address is already registered.');
                    res.redirect('/join');
                } else {
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
                }

            }));
            client.release();
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
                res.send(result.rows[0]);

            }));
        } catch (e) {
            throw(e)
        }
    });

    app.get('/account', ensureAuthenticated, function (req, res) {
        //if (req.isAuthenticated()) {
        console.log("typeWorker:", req.user[0].typeWorker);
        //в зависимости от этого рендер страниц
        res.render('account', {
            title: "Работник",
            userData: req.user,
            messages: {danger: req.flash('danger'), warning: req.flash('warning'), success: req.flash('success')}
        });
        //} else {
        //    res.redirect('/login');
        //}
    });
    app.get('/account_otch', ensureAuthenticated, async function(req, res){
        try {
            const client = await pool.connect()
        await client.query('BEGIN')
        await JSON.stringify(client.query('select "BrigadeName" from "Brigades"',[], function (err, result){
            if (err) {console.log("Mistake")} else{
                res.render('account_otch',{
                    userData:result.body
                })
            }
        }))
        } catch (e) {
            throw(e)
        }
        
    } )
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
                if(err6){console.log("Ошибка с поиском пациента")}   
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

    app.get('/login', forwardAuthenticated,function (req, res) {
        console.log('3fsf')
        
            res.render('login', {
                title: "Log in",
                userData: req.user,
                messages: {danger: req.flash('danger'), warning: req.flash('warning'), success: req.flash('success')}
            });
        

    });

    app.get('/logout', function (req, res) {
        console.log(req.isAuthenticated());
        req.logout();
        console.log(req.isAuthenticated());
        req.flash('success', "Logged out. See you soon!");
        res.redirect('/');
    });

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
            res.redirect('/');
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
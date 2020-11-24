// const http = require('http')
// const fs = require('fs')
// const path = require('path')
//

// const server = http.createServer((req, res) => {
//
//     let filepath = path.join(__dirname, 'public', req.url === '/' ? 'register.html' : req.url)
//     const ext=path.extname(filepath)
//     let contentType = 'text/html'
//
//     switch (ext) {
//         case '.css':
//             contentType = 'text/css'
//             break
//         case '.js':
//             contentType = 'text/javascript'
//             break
//         case '.svg':
//             contentType = 'image/svg+xml'
//             break
//         default:
//             contentType = 'text/html'
//     }
//
//     if(!ext) {
//         filepath += 'html'
//     }
//
//     console.log(filepath)
//
//     fs.readFile(filepath,(err,content)=>{
//         if (err) {
//             fs.readFile(path.join(__dirname, 'public', 'error.html'), (err, data) => {
//                 if (err) {
//                     res.writeHead(500)
//                     res.end('Error')
//                 } else {
//                     res.writeHead(200,{
//                         'Content-Type': 'text/html'
//                     })
//                     res.end(data)
//                 }
//             })
//         } else {
//             res.writeHead(200,{
//                 'Content-Type': contentType
//             })
//             res.end(content)
//         }
//     })
// })
//
// const PORT = process.env.PORT || 3000
//
// server.listen(PORT, () => {
//     console.log(`Server has been started on port ${PORT}...`)
// })

// НЕОБХОДИМЫЕ ПАКЕТЫ И ПЕРЕМЕННЫЕ
// ==================================================
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
const urlencodedParser = bodyParser.urlencoded({extended: false});


// КОНФИГУРАЦИЯ ПРИЛОЖЕНИЯ
// ==================================================
// сообщаем Node где лежат ресурсы сайта
app.use(express.static(__dirname + '/public'));


// УСТАНОВКА МАРШРУТОВ
// ===================================================
// главная страница — популярные изображения
app.get('/', function (req, res) {
    res.redirect('register.html');
});

app.post("/", urlencodedParser, function (request, response) {
    if (!request.body) return response.sendStatus(400);
    console.log(request.body);
    response.render('accountant_registration_form.html');
});

// ЗАПУСК СЕРВЕРА
// ==================================================
app.listen(3000);
console.log('Приложение запущено!');

const express = require("express");
const app = express();
const routes = require("./routes/");

const allowCrossDomain = function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.setHeader('Access-Control-Allow-Methods', 'PROPFIND, PROPPATCH, COPY, MOVE, DELETE, MKCOL, LOCK, UNLOCK, PUT, GETLIB, VERSION-CONTROL, CHECKIN, CHECKOUT, UNCHECKOUT, REPORT, UPDATE, CANCELUPLOAD, HEAD, OPTIONS, GET, POST');
    res.setHeader('Access-Control-Allow-Headers', 'origin, content-type, accept');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    next();
};
app.use(allowCrossDomain);
routes(app);

app.get("/", function (request, response) {

    // отправляем ответ
    response.status(200).send("Hello World");
});
// начинаем прослушивать подключения на 5000 порту
app.listen(5000);
const express = require("express");
const app = express();
const routes = require("./routes/");


routes(app);

app.get("/", function (request, response) {

    // отправляем ответ
    response.status(200).send("Hello World");
});
// начинаем прослушивать подключения на 5000 порту
app.listen(5000);
require('../config/config.js');

const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');

const bodyParser = require('body-parser');
// parse application/x-www-form-urlencoded

app.use(bodyParser.urlencoded({ extended: true }));
// parse application/json
app.use(bodyParser.json());

//Habilitar la carpeta public
app.use(express.static(path.resolve(__dirname, '../public')));


app.use(require('../routes/index'));


app.listen(process.env.PORT, () => {
    console.log(`Nodejs ${process.env.NODE_ENV} Atendiendo peticiones  en el puerto ${process. env.PORT}`);
})


mongoose.connect(process.env.URLDB, (err, resp) => {
    if (err) throw err;
    console.log(`Base de datos en la URL ${process.env.URLDB} esta ONLINE.`);
});
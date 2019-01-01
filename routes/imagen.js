const express = require('express');

const fs = require('fs');
const path = require('path');

const Usuario = require('../models/usuario');
const Producto = require('../models/producto');

const app = express();

let { verificaToken, verificaAdminRol } = require('../middleware/autenticacion');


app.get('/imagen/:tipo/:img', verificaToken, function(req, res) {

    const img = req.params.img;
    const tipo = req.params.tipo;

    let pathToImg = path.resolve(__dirname, `../uploads/${tipo}/${img}`);
    if (!fs.existsSync(pathToImg)) {
        pathToImg = path.resolve(__dirname, '../assets/no-image.jpg');
    };
    console.log('archivo--> ' + pathToImg);
    return res.sendFile(pathToImg);

});

module.exports = app;
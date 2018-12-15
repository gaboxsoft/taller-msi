const Usuario = require('../models/usuario');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const express = require('express');
const app = express();


app.post('/login', function(req, res) {

    let body = req.body;

    Usuario.findOne({ email: body.email }, (err, usuarioBD) => {
        if (err) {
            return res.status(500).json({ ok: false, error: err });
        }
        if (!usuarioBD) {
            return res.status(400).
            json({ ok: false, error: "el nombre del (usuario) o contraseña no son correctas." });
        };

        if (!bcrypt.compareSync(body.password, usuarioBD.password)) {
            return res.status(400).
            json({ ok: false, error: "el nombre del usuario o (contraseña) no son correctas." });
        };


        let token = jwt.sign({
                usuario: usuarioBD
            },
            process.env.SEED, { expiresIn: 60 * 60 * 24 * 30 });

        return res.json({ ok: true, usuario: usuarioBD, token });

    });

});

module.exports = app;
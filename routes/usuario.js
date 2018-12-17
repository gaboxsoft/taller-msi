const Usuario = require('../models/usuario');

const express = require('express');
const app = express();

const bcrypt = require('bcrypt');
const _ = require('underscore');

let { verificaToken, verificaAdminRol } = require('../middleware/autenticacion');

app.get('/usuario', verificaToken, function(req, res) {

    let limite = Number(req.query.limite || 0);
    let desde = Number(req.query.desde || 0);

    Usuario.find({ estado: true })
        .limit(limite)
        .skip(desde)
        .exec((err, usuarios) => {
            if (err) {
                return res.status(400).
                json({ ok: false, error: err });
            };
            Usuario.countDocuments({ estado: true }, (err, conteo) => {
                if (err) {
                    return res.status(400).
                    json({ ok: false, error: err });
                }
                res.json({ ok: true, conteo: conteo, usuarios });
            });
        });
});

app.post('/usuario', [verificaToken, verificaAdminRol], function(req, res) {
    let body = req.body;
    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        rol: body.rol
    });
    usuario.save((err, usuarioBD) => {
        if (err) {
            res.status(400).json({ ok: false, error: err });
        } else {
            res.json({ usuarioBD: usuarioBD });
        }
    });

});

app.put('/usuario/:id', [verificaToken, verificaAdminRol], function(req, res) {
    let body = _.pick(req.body, ['nombre', 'email', 'img', 'estado', 'rol']);
    let id = req.params.id;

    Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true, context: 'query' }, (err, usuarioBD) => {
        if (err) {
            return res.status(400).
            json({ ok: false, error: err });
        }
        res.json({ ok: true, usuarioBD: usuarioBD });
    })

});

app.delete('/usuario/:id', [verificaToken, verificaAdminRol], function(req, res) {

    let id = req.params.id;

    let modificarEstado = { estado: false };

    Usuario.findByIdAndUpdate(id, modificarEstado, { new: true }, (err, usuarioBorrado) => {
        if (err) {
            return res.status(400).json({ ok: false, error: err });
        }
        res.json({ ok: true, usuarioBorrado });
    });

});


module.exports = app;
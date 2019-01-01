const Usuario = require('../models/usuario');

const express = require('express');
const app = express();

const bcrypt = require('bcrypt');
const _ = require('underscore');



let { verificaToken, verificaAdminRol } = require('../middleware/autenticacion');

app.get('/usuarios', verificaToken, function(req, res) {

    let limite = Number(req.query.limite || 0);
    let desde = Number(req.query.desde || 0);

    Usuario.find({ situacion: { $gt: 0 } }) // Mayor que cero no esta borrado
        .limit(limite)
        .skip(desde)
        .exec((err, usuarios) => {
            if (err) {
                return res.status(400).
                json({ ok: false, error: err });
            };
            Usuario.countDocuments({ situacion: { $gt: 0 } }, (err, conteo) => {
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

    let usuario = new Usuario();
    usuario.email = body.email;
    usuario.password = body.password;
    usuario.rol = body.rol;
    usuario.nombres = body.nombres;
    usuario.paterno = body.paterno;
    usuario.materno = body.materno;
    usuario.cedula = body.cedula;
    usuario.institucion = body.institucion;
    usuario.especialidad = body.especialidad;
    usuario.password = bcrypt.hashSync(body.password, 10);
    usuario.usuario = req.usuario._id;
    usuario.save((err, usuarioBD) => {
        if (err) {
            res.status(400).json({ ok: false, error: err });
        } else {
            res.json({ usuarioBD: usuarioBD });
        }
    });

});

app.put('/usuario/:id', [verificaToken, verificaAdminRol], function(req, res) {

    let body = _.pick(req.body, [
        'email', 'rol', 'nombres', 'paterno', 'materno',
        'cedula', 'institucion', 'especialidad'
    ]);
    let id = req.params.id;
    body.fechaModificacion = Date.now();
    Usuario.findOneAndUpdate({ _id: id, situacion: { $gt: 0 } }, body, { new: true, runValidators: true, context: 'query' }, (err, usuarioBD) => {
        if (err) {
            return res.status(400).
            json({ ok: false, error: err });
        }
        if (!usuarioBD) {
            return res.status(401).
            json({ ok: false, error: `No existe usuario.` });;
        };
        res.json({ ok: true, usuarioBD: usuarioBD });
    });
});

app.delete('/usuario/:id', [verificaToken, verificaAdminRol], function(req, res) {

    let id = req.params.id;

    let modificarEstado = { situacion: 0, fechaBorrado: Date.now() }; // Borrado

    Usuario.findByIdAndUpdate(id, modificarEstado, { new: true }, (err, usuarioBorrado) => {
        if (err) {
            return res.status(400).json({ ok: false, error: err });
        }
        res.json({ ok: true, usuarioBorrado });
    });

});


module.exports = app;
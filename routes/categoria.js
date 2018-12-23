const Categoria = require('../models/categoria');

const express = require('express');
const app = express();

const bcrypt = require('bcrypt');
const _ = require('underscore');

let { verificaToken, verificaAdminRol } = require('../middleware/autenticacion');

app.get('/categorias', verificaToken, function(req, res) {
    Categoria.find({})
        .sort('descripcion')
        .populate('usuario', 'nombre email')
        .exec((err, categorias) => {
            if (err) {
                return res.status(400).
                json({ ok: false, error: err });
            };
            Categoria.countDocuments({ estado: true }, (err, conteo) => {
                if (err) {
                    return res.status(400).
                    json({ ok: false, error: err });
                }
                res.json({ ok: true, conteo: conteo, categorias });
            });
        });
});

app.get('/categoria/:id', verificaToken, function(req, res) {

    let idUsuario = req.params.id;
    Categoria.findById(idUsuario, (err, categoriaBD) => {
        if (err) {
            return res.status(400).
            json({ ok: false, error: err });
        };

        res.json({ ok: true, categoriaBD });
    });
});


app.post('/categoria/', [verificaToken, verificaAdminRol], function(req, res) {
    let body = req.body;
    let usuario = req.usuario;


    let categoria = new Categoria({
        descripcion: body.descripcion,
        usuario: usuario._id,
    });
    categoria.save((err, categoriaBD) => {
        if (err) {
            res.status(400).json({ ok: false, error: err });
        } else {
            res.json({ ok: true, categoriaBD });
        }
    });

});

app.put('/categoria/:id', [verificaToken, verificaAdminRol], function(req, res) {
    let body = _.pick(req.body, ['descripcion']);
    let id = req.params.id;

    Categoria.findByIdAndUpdate(id, body, { new: true, runValidators: true, context: 'query' }, (err, categoriaBD) => {
        if (err) {
            return res.status(400).
            json({ ok: false, error: err });
        }
        res.json({ ok: true, categoriaBD: categoriaBD });
    })

});

app.delete('/categoria/:id', [verificaToken, verificaAdminRol], function(req, res) {

    let id = req.params.id;
    Categoria.findByIdAndDelete(id, (err, categoriaBorrada) => {
        if (err) {
            return res.status(400).json({ ok: false, error: err });
        }
        res.json({ ok: true, categoriaBorrada });
    });

});


module.exports = app;
const Producto = require('../models/producto');

const express = require('express');
const app = express();

const _ = require('underscore');

let { verificaToken, verificaAdminRol } = require('../middleware/autenticacion');

app.get('/productos', verificaToken, function(req, res) {

    let limite = Number(req.query.limite || 0);
    let desde = Number(req.query.desde || 0);

    Producto.find({ disponible: true })
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .limit(limite)
        .skip(desde)
        .exec((err, productos) => {
            if (err) {
                return res.status(400).
                json({ ok: false, error: err });
            };
            Producto.countDocuments({ estado: true }, (err, conteo) => {
                if (err) {
                    return res.status(400).
                    json({ ok: false, error: err });
                }
                res.json({ ok: true, conteo: conteo, productos });
            });
        });
});

app.get('/producto/:id', verificaToken, function(req, res) {

    let id = req.params.id;

    Producto.find({ disponible: true, _id: id })
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, productos) => {
            if (err) {
                return res.status(400).
                json({ ok: false, error: err });
            };
            Producto.countDocuments({ estado: true }, (err, conteo) => {
                if (err) {
                    return res.status(400).
                    json({ ok: false, error: err });
                }
                res.json({ ok: true, conteo: conteo, productos });
            });
        });
});
app.get('/producto/buscar/:termino', verificaToken, function(req, res) {

    let termino = req.params.termino;
    let regEx = RegExp(termino, 'i');
    Producto.find({ disponible: true, nombre: regEx })
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, productos) => {
            if (err) {
                return res.status(400).
                json({ ok: false, error: err });
            };
            Producto.countDocuments({ estado: true }, (err, conteo) => {
                if (err) {
                    return res.status(400).
                    json({ ok: false, error: err });
                }
                res.json({ ok: true, conteo: conteo, productos });
            });
        });
});


app.post('/producto', [verificaToken, verificaAdminRol], function(req, res) {
    let body = req.body;
    let usuario = req.usuario;
    let producto = new Producto({
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        // disponible: body.disponible, 
        usuario: usuario._id,
        categoria: body.categoria

    });
    producto.save((err, productoBD) => {
        if (err) {
            res.status(400).json({ ok: false, error: err });
        } else {
            res.json({ productoBD: productoBD });
        }
    });

});

app.put('/producto/:id', [verificaToken, verificaAdminRol], function(req, res) {
    let body = _.pick(req.body, ['nombre', 'descripcion', 'precioUni', 'disponible', 'categoria']);
    let id = req.params.id;

    Producto.findByIdAndUpdate(id, body, { new: true, runValidators: true, context: 'query' }, (err, productoBD) => {
        if (err) {
            return res.status(400).
            json({ ok: false, error: err });
        }
        res.json({ ok: true, productoBD: productoBD });
    })

});

app.delete('/producto/:id', [verificaToken, verificaAdminRol], function(req, res) {

    let id = req.params.id;

    let modificarEstado = { disponible: false };

    Producto.findByIdAndUpdate(id, modificarEstado, { new: true }, (err, productoBorrado) => {
        if (err) {
            return res.status(400).json({ ok: false, error: err });
        }
        res.json({ ok: true, productoBorrado });
    });

});


module.exports = app;
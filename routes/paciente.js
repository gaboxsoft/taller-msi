const Paciente = require('../models/paciente');

const express = require('express');
const app = express();

const _ = require('underscore');


let { verificaToken, verificaAdminRol } = require('../middleware/autenticacion');

app.get('/pacientes', verificaToken, function(req, res) {

    let limite = Number(req.query.limite || 0);
    let desde = Number(req.query.desde || 0);

    Paciente.find({ situacion: { $gt: 0 } })
        .limit(limite)
        .skip(desde)
        .exec((err, pacientes) => {
            if (err) {
                return res.status(400).
                json({ ok: false, error: err });
            };
            Paciente.countDocuments({ situacion: { $gt: 0 } }, (err, conteo) => {
                if (err) {
                    return res.status(400).
                    json({ ok: false, error: err });
                }
                res.json({ ok: true, conteo: conteo, pacientes });
            });
        });
});

app.post('/paciente', [verificaToken, verificaAdminRol], function(req, res) {
    let body = req.body;
    let paciente = new Paciente({

        // // Nombre de persona
        // nombres:
        // paterno:
        // materno: 
        // genero: 
        // fechaNacimiento: 
        // //Domicilio
        // calle:
        // numExterior: 
        // numInterior: 
        // colonia: 
        // municipio: 
        // entidad: 
        // CP: 
        // telefonos: 
        // pais:

        nombres: body.nombres,
        paterno: body.paterno,
        materno: body.materno,
        genero: body.genero,
        fechaNacimiento: body.fechaNacimiento,
        telefonos: body.telefonos || '',
        calle: body.calle || '',
        numInterior: body.numInterior || '',
        numExterior: body.numExterior || '',
        colonia: body.colonia || '',
        municipio: body.municipio || '',
        entidad: body.entidad || '',
        pais: body.pais || 'México',
        cp: body.cp || '',
        usuario: req.usuario._id
    });
    paciente.save((err, pacienteBD) => {
        if (err) {
            res.status(400).json({ ok: false, error: err });
        } else {
            res.json({ pacienteBD: pacienteBD });
        }
    });

});

app.put('/paciente/:id', [verificaToken, verificaAdminRol], function(req, res) {

    let body = _.pick(req.body, ['nombre', 'fechaNacimiento',
        'genero', 'telefonos',
        'calle', 'numInterior', 'numExterior', 'colonia', 'colonia',
        'entidad', 'cp', 'pais'
    ]);

    let id = req.params.id;
    body.usuario = req.usuario._id
    body.fechaModificacion = Date.now();

    Paciente.findOneAndUpdate({ _id: id, situacion: { $gt: 0 } }, body, { new: true, runValidators: true, context: 'query' }, (err, pacienteBD) => {
        if (err) {
            return res.status(400).
            json({ ok: false, error: { mensaje: err } });
        }
        if (!pacienteBD) {
            return res.status(401).
            json({ ok: false, error: { mensaje: 'No existe paciente.' } });
        }
        res.json({ ok: true, pacienteBD: pacienteBD });
    })

});

app.delete('/paciente/:id', [verificaToken, verificaAdminRol], function(req, res) {

    let id = req.params.id;

    let modificarEstado = { situacion: 0, fechaBorrado: Date.now() };

    Paciente.findByIdAndUpdate(id, modificarEstado, { new: true }, (err, pacienteBorrado) => {
        if (err) {
            return res.status(400).json({ ok: false, error: { mensaje: err } });
        };
        if (!pacienteBorrado) {
            return res.status(401).
            json({ ok: false, error: { mensaje: 'No existe paciente.' } });
        };
        res.json({ ok: true, pacienteBorrado });
    });

});


module.exports = app;
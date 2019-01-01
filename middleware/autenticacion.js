//===========================
// Verifica Token
//===========================

const Usuario = require('../models/usuario');

const jwt = require('jsonwebtoken');

//const http = require('http');

const bcrypt = require('bcrypt');


let verificaToken = (req, res, next) => {

    let token = req.get('token');
    jwt.verify(token, process.env.SEED, (err, decode) => {
        //console.log('decode-->', decode.iat);
        const hoy = new Date(Date.now());
        if (err) {
            return res.status(401).json({
                ok: false,
                error: { mensaje: 'Token no válido.1', err, ahora: hoy, lapso: process.env.CADUCIDAD }
            });
        }

        req.usuario = decode.usuario;
        let id = req.usuario._id;
        ///////////////////
        Usuario.findById(id, (err, usuarioBD) => {
            if (err) {
                return res.status(401).json({
                    ok: false,
                    error: { mensaje: 'Token no válido.2' }
                });
            };
            if (!usuarioBD) {
                return res.status(401).json({
                    ok: false,
                    error: { mensaje: 'Token no válido.3' }
                });
            };

            // Verifica que el usuario este activo.
            if (usuarioBD.situacion != 1) {
                return res.status(400).
                json({ ok: false, error: { mensaje: 'Token no válido.4' } });
            };


        });
        next();
        //////////////////
        // Si no pasa las verificaciones, ya no hace nada.
    });
};

let verificaAdminRol = (req, res, next) => {


    if (req.usuario.rol != "ADMIN_ROL") {
        return res.status(500).json({
            ok: false,
            error: { message: 'NO tienes permiso de ADMINISTRADOR.' }
        });

    }

    next();
};

let verificaOperadorRol = (req, res, next) => {


    if (req.usuario.rol != "OPERADOR_ROL") {
        return res.status(500).json({
            ok: false,
            error: { message: 'NO tienes permiso de OPERADOR.' }
        });

    }

    next();
};

let verificaDoctorRol = (req, res, next) => {


    if (req.usuario.rol != "DOCTOR_ROL") {
        return res.status(500).json({
            ok: false,
            error: { message: 'NO tienes permiso de DOCTOR.' }
        });

    }

    next();
};
let verificaEnfermeriaRol = (req, res, next) => {


    if (req.usuario.rol != "ENFERMERIA_ROL") {
        return res.status(500).json({
            ok: false,
            error: { message: 'NO tienes permiso de ENFERMERIA.' }
        });

    }

    next();
};

//////////////////////////
//// Crea el primer Usuario ADMIN del sistema, si no hay ningún usuario.
//////////////////////////
let verificaPrimerUsuarioAdmin = (req, res, next) => {

    Usuario.countDocuments({ situacion: { $gt: 0 } }, (err, conteo) => {

        if (conteo == 0) {
            let usu = new Usuario();
            usu.email = 'gabox@msn.com';
            usu.password = '12345';
            usu.rol = 'ADMIN_ROL';
            usu.nombres = 'ADMIN';
            usu.paterno = 'ADMIN';
            usu.cedula = '00000';
            usu.institucion = 'ningun';
            usu.especialidad = 'ningun';
            usu.password = bcrypt.hashSync(usu.password, 10);
            // let url = 'localhost'
            // let options = {
            //     host: url,
            //     port: 3000,
            //     path: '/usuario',
            //     method: 'POST',
            //     body: usu
            // };
            // http.request(options, function(res) {
            //     console.log('STATUS: ' + res.statusCode);
            //     console.log('HEADERS: ' + JSON.stringify(res.headers));
            //     res.setEncoding('utf8');
            //     res.on('data', function(chunk) {
            //         console.log('BODY: ' + chunk);
            //     });
            // }).end();

            usu.save((err, usuarioBD) => {
                if (err) {
                    return res.status(400).json({ ok: false, error: 'No pude crear el primer usuario ADMIN: ' + err });
                };
            });
        };
    });

    next();
};

module.exports = { verificaToken, verificaAdminRol, verificaOperadorRol, verificaDoctorRol, verificaEnfermeriaRol, verificaPrimerUsuarioAdmin };
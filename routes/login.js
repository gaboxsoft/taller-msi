const Usuario = require('../models/usuario');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);

const Nombre = require('../models/nombrePersona');
let { verificaPrimerUsuarioAdmin } = require('../middleware/autenticacion');

const express = require('express');
const app = express();


app.post('/login', verificaPrimerUsuarioAdmin, function(req, res) {

    let body = req.body;


    Usuario.findOne({ email: body.email }, (err, usuarioBD) => {
        if (err) {
            return res.status(500).json({ ok: false, error: { mensaje: err } });
        }
        if (!usuarioBD) {
            return res.status(400).
            json({ ok: false, error: "el nombre del (usuario) o contraseña no son correctas.1" });
        };

        // Verifica que el usuario este activo.
        if (usuarioBD.situacion != 1) {
            return res.status(400).
            json({ ok: false, error: "el nombre del (usuario) o contraseña no son correctas.2" });
        };
        //Verifica el password 
        if (!bcrypt.compareSync(body.password, usuarioBD.password)) {
            return res.status(400).
            json({ ok: false, error: "el nombre del usuario o (contraseña) no son correctas." });
        };


        let token = jwt.sign({
                usuario: usuarioBD
            },
            process.env.SEED, { expiresIn: process.env.CADUCIDAD });

        return res.json({ ok: true, usuario: usuarioBD, token });

    });

});

// Métodos para autenticaren Google-SignIn
async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();

    return {
        nombre: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true
    }
}

app.post('/google', async(req, res) => {
    // Recupera el token
    let token = req.body.idtoken;
    // Verifica o has signIn en google
    let googleUser = await verify(token)
        .catch(e => {
            return res.status(403).
            json({ ok: false, error: 'No fue posible verificar token de google' });
        });

    if (googleUser.email) {
        // Checa que este en la tabla de usuarios
        Usuario.findOne({ email: googleUser.email }, (err, usuarioBD) => {
            if (err) {
                return res.status(500).json({ ok: false, error: err });
            };
            // Esta en la BD
            if (usuarioBD) {
                // Checar que no sea un usuario registrado como de google
                if (usuarioBD.google === false) {
                    return res.status(500).json({ ok: false, error: { mensaje: 'Use suautenticación normal.' } });
                }
                // Es un usuario google, renueva su tokem
                else {
                    let token = jwt.sign({
                            usuario: usuarioBD
                        },
                        process.env.SEED, { expiresIn: 60 * 60 * 24 * 30 });
                    return res.json({ ok: true, usuario: usuarioBD, token });
                };
            }
            // No esta en la BD: el usuario no existe en la BD
            else {
                // Agrega a la tabla usuarios y renueva token
                let usuario = new Usuario();
                usuario.nombre = googleUser.nombre;
                usuario.email = googleUser.email;
                usuario.img = googleUser.picture;
                usuario.password = ':)';
                usuario.google = true;
                usuario.save((err, usuarioBD) => {
                    if (err) {

                        return res.status(500).json({ ok: false, error: err });
                    };
                    let token = jwt.sign({
                            usuario: usuarioBD
                        },
                        process.env.SEED, { expiresIn: 60 * 60 * 24 * 30 });
                    return res.json({ ok: true, usuario: usuarioBD, token });
                });
            };
        });
    };
});
module.exports = app;
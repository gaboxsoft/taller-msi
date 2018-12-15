//===========================
// Verifica Token
//===========================


const jwt = require('jsonwebtoken');

let verificaToken = (req, res, next) => {

    let token = req.get('token');
    console.log(process.env.SEED);
    jwt.verify(token, process.env.SEED, (err, decode) => {

        if (err) {
            return res.status(401).json({
                ok: false,
                error: { message: 'Token no válido.' }
            });
        }
        req.usuario = decode.usuario;
        next();
    });
};

let verificaAdminRol = (req, res, next) => {


    if (req.usuario.rol != "ADMIN_ROL") {
        return res.status(500).json({
            ok: false,
            error: { message: 'NO tienes permiso de administrador' }
        });

    }

    next();
};

module.exports = { verificaToken, verificaAdminRol };
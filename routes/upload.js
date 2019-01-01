const express = require('express');
const fileUpload = require('express-fileupload');

const fs = require('fs');
const path = require('path');

const app = express();

const Usuario = require('../models/usuario');
const Producto = require('../models/producto');

let { verificaToken, verificaAdminRol } = require('../middleware/autenticacion');

// default options
app.use(fileUpload());

app.put('/upload/:tipo/:id', verificaToken, function(req, res) {
    const tipo = req.params.tipo;
    const id = req.params.id;
    // Tipos permitidas
    const tiposValidos = ['productos', 'usuarios'];
    if (tiposValidos.indexOf(tipo) < 0) {
        return res.status(400).json({ ok: false, mensaje: 'Los tipos válidos son: ' + tiposValidos.join(', ') });
    }
    if (!req.files) {
        return res.status(400).json({ ok: false, mensaje: 'No se especificó el archivo a subir.' })
    }


    // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
    const file = req.files.archivo;
    const fileNameArray = file.name.toLowerCase().split('.');
    const fileExt = fileNameArray[fileNameArray.length - 1];

    // Extensiones de archivo permitidas
    const extensionesValidas = ['jpg', 'png', 'gif', 'jpeg'];
    if (extensionesValidas.indexOf(fileExt) < 0) {
        return res.status(400).json({ ok: false, mensaje: 'La extensiones válidas son ' + extensionesValidas.join(', ') });
    }

    // if (fs.exists(`uploads/${tipo}/${file.name}`)) {

    // }
    file.name = `${id}-${new Date().getMilliseconds()}.${fileExt}`;
    // Use the mv() method to place the file somewhere on your server
    file.mv(`uploads/${tipo}/${file.name}`, function(err) {
        if (err) {
            return res.status(500).json({ ok: true, mensaje: err });
        };

        // Aquí ya sé que la imagen se subió
        if (tipo === 'usuarios') {
            guardarImagenUsuario(res, id, file.name);
        } else {
            guardarImagenProducto(res, id, file.name);
        }
    });
});

function guardarImagenUsuario(res, id, nombreArchivo) {
    const tipo = "usuarios";
    // const tipoImagen = tipo === 'usuario' ? Usuario : Producto;
    Usuario.findById(id, (err, usuarioBD) => {
        if (err) {
            borraArchivoSubido(tipo, nombreArchivo);
            return res.status(500).json({ ok: false, mensaje: err });
        };
        if (!usuarioBD) {
            borraArchivoSubido(tipo, nombreArchivo);
            return res.status(400).json({ ok: false, mensaje: 'El usuario no existe' });
        };
        // Verifica que el nombre del archivo almacenado en Usuario.img no exista y si existe hay que borrárla
        borraArchivoSubido(tipo, usuarioBD.img)

        usuarioBD.img = nombreArchivo;
        usuarioBD.save((err, usuarioGuardado) => {
            if (err) {
                return res.status(500).json({ ok: false, mensaje: err });
            };
            return res.status(200).json({ ok: true, mensaje: 'Imagen guardada en: ' + usuarioGuardado.nombre });
        });

    })
}

function guardarImagenProducto(res, id, nombreArchivo) {
    const tipo = "productos";
    // const tipoImagen = tipo === 'usuario' ? Usuario : Producto;
    Producto.findById(id, (err, productoBD) => {
        if (err) {
            borraArchivoSubido(tipo, nombreArchivo);
            return res.status(500).json({ ok: false, mensaje: err });
        };
        if (!productoBD) {
            borraArchivoSubido(tipo, nombreArchivo);
            return res.status(400).json({ ok: false, mensaje: 'El producto no existe' });
        };
        // Verifica que el nombre del archivo almacenado en Usuario.img no exista y si existe hay que borrárla
        borraArchivoSubido(tipo, productoBD.img)

        productoBD.img = nombreArchivo;
        productoBD.save((err, productoGuardado) => {
            if (err) {
                return res.status(500).json({ ok: false, mensaje: err });
            };
            return res.status(200).json({ ok: true, mensaje: 'Imagen guardada en: ' + productoGuardado.nombre });
        });

    })
}


function borraArchivoSubido(tipo, nombreArchivo) {
    archivoSubido = path.resolve(__dirname, `../uploads/${tipo}/${nombreArchivo}`);
    if (fs.existsSync(archivoSubido)) {
        fs.unlinkSync(archivoSubido);
    };
}


module.exports = app;
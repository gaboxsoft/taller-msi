const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let Schema = mongoose.Schema;

const rolValido = require('./rolValido');
// const Nombre = require('../models/nombrePersona');
// const Profesion = require('../models/profesion');

const situacionValida = require('./situacionValida');

// const Sello = require('../models/sello');



let usuarioSchema = new Schema({
    // Nombre de persona

    nombres: {
        type: String,
        default: '',
        minlength: 5,
        required: [true, 'El NOMBRE es necesario.']
    },
    paterno: {
        type: String,
        default: '',
        minlength: 5,
        required: [true, 'El PATERNO es necesario.']
    },
    materno: {
        type: String,
        minlength: 5,
        //: [true, 'El MATERNO del paciente es necesario.']

    },


    // Profesión 

    cedula: {
        type: String,
        default: '',
        unique: true,
        required: [true, 'El número de cédula profesional es necesario.']
    },
    institucion: {
        type: String,
        default: '',
        required: [true, 'El nombre de la Institución que expide el Título es necesario.']
    },

    especialidad: {
        type: String,
        default: '',
        required: [true, 'La especialidad es necesaria.']
    },



    // EMAIL Y PASSWORD
    email: {
        type: String,
        unique: true,
        required: [true, 'El correo es necesario.']
    },
    password: {
        type: String,
        required: [true, 'La contraseña es necesaria.']
    },
    rol: {
        type: String,
        required: false,
        enum: rolValido,
        default: 'ADMIN_ROL'
    },

    // Sello de creación y borrado 

    fechaCreacion: {
        type: Date,
        required: [true, 'La fecha de creación es necesaria.'],
        default: Date.now()
    },
    fechaModificacion: {
        type: Date
    },
    situacion: {
        type: Number,
        required: [true, 'La situación deldocumento es necesaria.'],
        enum: situacionValida,
        default: 1 // 0-borrado, 1-activo, 2-inactivo, 3-ocupado
    },
    fechaBorrado: {
        type: Date
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario'
    }

});

usuarioSchema.methods.toJSON = function() {
    let user = this;
    let userObject = user.toObject();
    delete userObject.password;
    delete userObject.situacion;
    delete userObject.fechaBorrado;
    delete userObject.fechaCreacion;
    delete userObject.fechaModificacion;
    return userObject;
};

usuarioSchema.plugin(uniqueValidator, { message: '{PATH} debe ser único. ' })

module.exports = mongoose.model('Usuario', usuarioSchema);
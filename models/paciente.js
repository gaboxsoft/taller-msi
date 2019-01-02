const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let Schema = mongoose.Schema;

const generoValido = require('../models/generoValido');
const situacionValida = require('../models/situacionValida');
// const Nombre = require('../models/nombrePersona');
// const Domicilio = require('../models/domicilio');
// const Sello = require('../models/sello');

// Schema de  paciente

let pacienteSchema = new Schema({
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
    genero: {
        type: String,
        enum: generoValido,
        maxlength: 1,
        required: [true, 'Se requiere especificar el género del paciente.']
    },
    fechaNacimiento: {
        type: Date,
        required: [true, 'La feha de nacimiento del paciente es necesaria.']
    },
    //Domicilio
    calle: {
        type: String,
        //required: [true, 'El nombre de la calle es necesiaria.']
    },
    numExterior: {
        type: String,
        //required: [true, 'El número exterior es necesario.']
    },
    numInterior: {
        type: String,
        //required: [false, 'El número interior es opcional.']
    },
    colonia: {
        type: String,
        //required: [true, 'El nombre de la colonia es necesaria.']
    },
    municipio: {
        type: String,
        //required: [true, 'El nombre del municipio es necesario.']
    },
    entidad: {
        type: String,
        //required: [true, 'El nombre de la entidad es necesaria.']
    },
    pais: {
        type: String,
        //required: [true, 'El nombre del país es necesario.']
    },
    CP: {
        type: String,
        maxlength: 5,
        //required: [false, 'El nCódigo Postal es opcional.']
    },
    telefonos: {
        type: String,
        //required: [true, 'Almenos un teléfono es necesiario.']
    },


    // Sello de creación y borrado 

    fechaCreacion: {
        type: Date,
        required: [true, 'La fecha de creación es necesaria.']
            // ,
            // default: new Date().toLocaleString()
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

pacienteSchema.plugin(uniqueValidator, { message: '{PATH} debe ser único. ' })

module.exports = mongoose.model('Paciente', pacienteSchema);



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
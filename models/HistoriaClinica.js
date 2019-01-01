const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let Schema = mongoose.Schema;

const situacionValida = require('./situacionValida');
const generoValido = require('./generoValido');


// Schema del subdocumento de doctores que atenderan al paciente
let doctorSchema = new Schema({
    Doctor: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: [true, 'Se requiere especificar el Doctor del paciente.']
    }
});
// Schema del subdocumento de contrato de prestación de servicios
let pagareSchema = new Schema({
    importeAnticipo: {
        type: Number,
        required: [true, 'Se requiere especificar el anticipo del contrato.']
    },
    importeTotal: {
        type: Number,
        required: [true, 'Se requiere especificar el total del contrato.']
    }
});

// Schema de colección de HistoriaClinica

let historiaClinicaSchema = new Schema({
    folio: {
        type: Number,
        unique: true,
        required: [true, 'El FOLIO del la Historia Clínica es necesario.']
    },
    paciente: {
        type: Schema.Types.ObjectId,
        ref: 'Paciente'
    },
    Doctores: [doctorSchema],

    pagare: pagareSchema,


    diagnostico: {
        type: String,
        //required: [true, 'El nombre de la calle es necesiaria.']
    },
    estudiosLaboratorio: {
        type: String
    },
    estudiosGabinete: {
        type: String
    },
    estudiosHistopatologicos: {
        type: String
    },
    actosAnestesicos: {
        type: String
    },
    tratamientoMedico: {
        type: String
    },

    tratamientoQuirurgico: {
        type: String
    },
    riesgosYComplicaciones: {
        type: String
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

pacienteSchema.plugin(uniqueValidator, { message: '{PATH} debe ser único. ' })


module.exports = mongoose.model('Paciente', pacienteSchema);
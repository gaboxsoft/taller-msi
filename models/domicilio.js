const mongoose = require('mongoose');

let Schema = mongoose.Schema;


// Schema de domicilio

let domicilioSchema = new Schema({
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
    CP: {
        type: String,
        maxlength: 5,
        //required: [false, 'El nCódigo Postal es opcional.']
    },
    telefonos: {
        type: String,
        //required: [true, 'Almenos un teléfono es necesiario.']
    }
});

module.exports = mongoose.model('Domiclio', domicilioSchema);
//module.exports = domicilioSchema;
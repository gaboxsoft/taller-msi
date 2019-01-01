const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let Schema = mongoose.Schema;





let profesionSchema = new Schema({
    // Profesión 
    numeroCedulaProfesional: {
        type: String,
        unique: true,
        required: [true, 'El número de cédula profesional es necesario.']
    },
    nombreInstitucionExpideTitulo: {
        type: String,
        required: [true, 'El nombre de la Institución que expide el Título es necesario.']
    },

    especialidadProfesional: {
        type: String,
        required: [true, 'La especialidad es necesaria.']
    }
});




profesionSchema.plugin(uniqueValidator, { message: '{PATH} debe ser único. ' })

module.exports = mongoose.model('Profesion', profesionSchema);
//module.exports = profesionSchema;
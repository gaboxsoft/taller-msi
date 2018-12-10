/*
 * Configuraciones Públicas Globales
 */

// puerto default del servidor
process.env.PORT = process.env.PORT || 3000;

//////////
// Entorno de ejecución
//////////

process.env.NODE_ENV = process.env.NODE_ENV || 'PROD';
if (process.env.NODE_ENV === 'ENV') {
    process.env.URLDB = 'mongodb://localhost:27017/cafe';
} else {
    process.env.URLDB = 'mongodb://gabox:Gabox123@ds054288.mlab.com:54288/cafe';
}
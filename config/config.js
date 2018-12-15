/*
 * Configuraciones Públicas Globales
 */

// puerto default del servidor
process.env.PORT = process.env.PORT || 3000;

//////////
// Entorno de ejecución
//////////

process.env.NODE_ENV = process.env.NODE_ENV || 'ENV';
if (process.env.NODE_ENV === 'ENV') {
    process.env.URLDB = 'mongodb://localhost:27017/cafe';
} else {
    process.env.URLDB = process.env.MONGO_URI;
}

// seed
process.env.SEED = process.env.SEED || "este-es-el-seed-de-desarrollo";

// caducidad
process.env.CADUCIDAD = process.env.CADUCIDAD || 60 * 60 * 24 * 30; //60segs*60mins*24horas*30dias
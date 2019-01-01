// Roles de usuarios para controlar acceso a los diferentes API's 
let rolValido = {
    values: ['SUPERUSER_ROL', 'ADMIN_ROL', 'DOCTOR_ROL', 'ENFERMERIA_ROL'],
    message: '{VALUE} no es un rol válido.'
}

module.exports = rolValido;
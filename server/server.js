require('../config/config.js');
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
    // parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
    // parse application/json
app.use(bodyParser.json())


app.get('/usuario', function(req, res) {
    res.json('GET ')
});
app.post('/usuario', function(req, res) {
    let body = req.body;
    if (!body.nombre) {
        res.status(400).json({ ok: false, mensaje: 'El nombre es necesario' });
    }
    res.json({ persona: body });

});
app.put('/usuario/:id', function(req, res) {
    let id = req.params.id;
    res.json({ text: 'PUT-> ', id: id });
});
app.delete('/usuario', function(req, res) {
    res.json('DELETE---')
});


app.listen(process.env.PORT, () => {
    console.log(`Atendiendo peticiones en el puerto ${process.env.PORT}`);
})
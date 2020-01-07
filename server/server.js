require('./config/config');

const express = require('express')
const app = express()

// * BODY-PARSER
const bodyParser = require('body-parser');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
 
// parse application/json
app.use(bodyParser.json())


// * REQUESTS

app.get('/usuario', function (req, res) {
  res.json('Getting usuarios!!');
});

// * Crear registros
app.post('/usuario', function (req, res) {
  let body = req.body;

  if(body.nombre === undefined) {
    res.status(400).json({
        ok: false,
        mensaje: 'El nombre es necesario'
    });
  }else{
    res.json({
        persona: body
    });
  }
});


// * Actualizar registros
app.put('/usuario/:id', function (req, res) {
    let id = req.params.id;
    res.json({
        id
    });
  });

// * Crear registros
app.delete('/usuario', function (req, res) {
    res.json('Deleting usuarios!!')
  });
 
app.listen(process.env.PORT, () => {
    console.log('Escuchando en el puerto', 3000);    
})
// * R E Q U I R E S

require('./config/config');

const path = require('path');
const mongoose = require('mongoose');
const express = require('express');
const app = express();

// * BODY-PARSER
const bodyParser = require('body-parser');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
 
// parse application/json
app.use(bodyParser.json())

// * H A B I L I T A R   C A R  P E T A   P U B L I C
app.use( express.static(path.resolve(__dirname , '../public')));



// * R O U T E S
app.use(require('./routes/index'));


// * CONECTING TO DATABASE

mongoose.connect(process.env.URLDB,
    {useNewUrlParser: true,useCreateIndex: true,useUnifiedTopology: true},
    (err,res) =>{
  if (err) {
    throw err;
  }else {
    console.log('Base de datos ONLINE');
  }   
});

app.listen(process.env.PORT, () => {
    console.log('Escuchando en el puerto', 3000);    
});
//? *************************************************************
//? ***                 'Requires '                           ***
//? *************************************************************

const fs = require('fs');
const path = require('path');
const express = require('express');
let app = express();
const { verficaToken } = require('../middlewares/autenticacion');


// *************************************************************
// ***              'Find  file'                           ***
// *************************************************************

app.get('/imagen/:tipo/:img' , verficaToken, (req,res) => {

    let tipo = req.params.tipo;
    let img = req.params.img;
    let pathImg = path.resolve(__dirname, `../../uploads/${tipo}/${img}`);

	if (fs.existsSync(pathImg)) {
		res.sendFile(pathImg);
	}else {
        let noImagePath = path.resolve(__dirname, '../assets/no-image.jpg');
        res.sendFile(noImagePath);
    }   
});




module.exports = app;



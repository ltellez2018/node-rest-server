// * R E Q U I R E S
const Usuario = require('../models/usuario');
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const app = express();


// * R E Q U I R E S

app.post('/login',(req,res) =>{
    let body = req.body;

    Usuario.findOne({email: body.email}, (err, usuarioDB) =>{

        // ! E R R O R   D E  S E R V E R
        if (err) {
			return res.status(500).json({
				ok: false,
				err: err
			});
        };

        // ! U S U A R I O  N O  E N C O N T R A D O
        if(!usuarioDB){ 
            return res.status(500).json({
				ok: false,
				err: {
                    message: '[Usuario] o Contraseña incorrectos'
                }
			});
        }

        // * E V A L U A R   C O N T R A S E Ñ A
        if( !bcrypt.compareSync(body.password,usuarioDB.password)) {
            // ! C O N T R A S E Ñ A  I N C O R E C T A
            return res.status(400).json({
				ok: false,
				err: {
                    message: 'Usuario o [Contraseña] incorrectos'
                }
			});
        }

        // * U S U A R I O  V A L I D O

        // * G E N E R A N D O  E L  J W T

        let token =  jwt.sign({
            usuario: usuarioDB
        }, process.env.SEED, {expiresIn: process.env.CADUCIDAD_TOKEN});

        res.json({
            ok: true,
            Usuario: usuarioDB,
            token
        });
    });	
});


module.exports = app;
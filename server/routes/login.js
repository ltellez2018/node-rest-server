// * R E Q U I R E S
const Usuario = require('../models/usuario');
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const app = express();
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);


// * R E Q U I R E S

app.post('/login', (req, res) => {
    let body = req.body;

    Usuario.findOne({ email: body.email }, (err, usuarioDB) => {

        // ! E R R O R   D E  S E R V E R
        if (err) {
            return res.status(500).json({
                ok: false,
                err: err
            });
        };

        // ! U S U A R I O  N O  E N C O N T R A D O
        if (!usuarioDB) {
            return res.status(500).json({
                ok: false,
                err: {
                    message: '[Usuario] o Contraseña incorrectos'
                }
            });
        }

        // * E V A L U A R   C O N T R A S E Ñ A
        if (!bcrypt.compareSync(body.password, usuarioDB.password)) {
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

        let token = jwt.sign({
            usuario: usuarioDB
        }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN });

        res.json({
            ok: true,
            Usuario: usuarioDB,
            token
        });
    });
});

// Configuraciones de google

async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();

    return {
        nombre: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true
    }
}


app.post('/google', async (req, res) => {
    let token = req.body.idtoken;
    let gogoleUSer = await verify(token).catch(err => {
        return res.status(403).json({
            ok: false,
            err
        });
    });

    Usuario.findOne({ email: gogoleUSer.email }, (err, usuarioDB) => {
        // ! E R R O R   D E  S E R V E R
        if (err) {
            return res.status(500).json({
                ok: false,
                err: err
            });
        };

        if (usuario) {
            if (usuarioDB.google === false) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'Debe usar la autenticacion normal'
                    }
                });
            } else {
                let token = jwt.sign({
                    usuario: usuarioDB
                }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN });
                
                return res.json({
                    ok: true,
                    usuario: usuarioDB,
                    token
                });
            }
        } else{
            // ! No existe el usuario.
            let usuario = new Usuario();
            usuario.nombre = gogoleUSer.nombre;
            usuario.email = gogoleUSer.email;
            usuario.img = gogoleUSer.img;
            usuario.google = true
            usuario.password = ';)';

            usuarioDB.save((err, usuarioDB) =>{
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        err
                    });
                };
                let token = jwt.sign({
                    usuario: usuarioDB
                }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN });
                
                return res.json({
                    ok: true,
                    usuario: usuarioDB,
                    token
                });
            });
        }
    });
});


module.exports = app;
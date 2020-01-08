// * R E Q U I R E S

const Usuario = require('../models/usuario');
const express = require('express');
const bcrypt = require('bcryptjs');
const _ = require('underscore');
const app = express();

// * R E Q U E S T S


// * O B T I E N E  U S U A R I O S

app.get('/usuario', function (req, res) {
	let desde = req.query.desde || 0;
	desde = Number(desde);
	let limite = req.query.limite || 5;
	limite = Number(limite);

	Usuario.find({estado:true},'nombre email role estado google img	')
		.skip(desde)
		.limit(limite)
		.exec((err, usuarios) => {
			if (err) {
				return res.status(400).json({
					ok: false,
					err: err
				});
			};

			Usuario.count({estado:true},(err,conteo)=>{
				res.json({
					ok:true,
					usuarios,
					conteo
				});	
			});		
		});
});

// * C R E A  U S U A R I O S
app.post('/usuario', function (req, res) {
	let body = req.body;
	let usuario = new Usuario({
		nombre: body.nombre,
		email: body.email,
		password: bcrypt.hashSync(body.password, 10),
		role: body.role
	});

	usuario.save((err, usuarioDB) => {
		if (err) {
			return res.status(400).json({
				ok: false,
				err: err
			});
		};

		res.json({
			ok: true,
			usuario: usuarioDB
		});
	});
});


// * A C T U A L I Z A R   U S U A R I O S
app.put('/usuario/:id', function (req, res) {
	let id = req.params.id;
	let body = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'estado']);

	Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, usuarioDB) => {

		if (err) {
			return res.status(400).json({
				ok: false,
				err: err
			});
		};

		res.json({
			ok: true,
			usuario: usuarioDB
		});

	});


});


// * B O R R A D O  F I S I C O

/* app.delete('/usuario/:id', function (req, res) {
	let id = req.params.id;
	
	Usuario.findByIdAndRemove(id, (err, usuarioEliminado) => {
		
		if (err) {
			return res.status(400).json({
				ok: false,
				err: err
			});
		};

		if(!usuarioEliminado) {
			return res.status(400).json({
				ok: false,
				err:  {
					message: 'Usuario no encontrado'
				}
			});
		}

		res.json({
			ok: true,
			usuario: usuarioEliminado
		});

	});
});
 */
// * B O R R A D O  L O G I C O

app.delete('/usuario/:id', function (req, res) {
	let id = req.params.id;
	let body = {
		estado: false
	};
	console.log('Id' , id);
	
	Usuario.findByIdAndUpdate(id, body, { new: true}, (err, usuarioActualizado	) => {
		
		if (err) {
			return res.status(400).json({
				ok: false,
				err: err
			});
		};

		if(!usuarioActualizado) {
			return res.status(400).json({
				ok: false,
				err:  {
					message: 'Usuario no encontrado'
				}
			});
		}

		res.json({
			ok: true,
			usuario: usuarioActualizado
		});

	});
});

module.exports = app;
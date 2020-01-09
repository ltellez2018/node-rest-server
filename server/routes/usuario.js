//? *************************************************************
//? ***                 'Requires '                           ***
//? *************************************************************

const Usuario = require('../models/usuario');
const  {verficaToken,verificaAdminRole}  = require('../middlewares/autenticacion');	
const express = require('express');
const bcrypt = require('bcryptjs');
const _ = require('underscore');
const app = express();

// * R E Q U E S T S

// *************************************************************
// ***              'Get all users'                          ***
// *************************************************************

app.get('/usuario', verficaToken,(req, res) => {

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


// *************************************************************
// ***                  'Save user'                          ***
// *************************************************************
app.post('/usuario',[verficaToken,verificaAdminRole],(req, res) =>{
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


// *************************************************************
// ***                  'Update user'                        ***
// *************************************************************
app.put('/usuario/:id', [verficaToken,verificaAdminRole] , (req, res) =>{
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

// *************************************************************
// ***             'Update [DELETE] user'                    ***
// *************************************************************

app.delete('/usuario/:id', [verficaToken, verificaAdminRole] , (req, res) =>{
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
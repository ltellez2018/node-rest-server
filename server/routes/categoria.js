//? *************************************************************
//? ***                 'Requires '                           ***
//? *************************************************************

let { verficaToken, verificaAdminRole } = require('../middlewares/autenticacion');
const express = require('express');
let app = express();
const Categoria = require('../models/categoria');


// *************************************************************
// ***              'Get all catgories'                      ***
// *************************************************************

app.get('/categoria', verficaToken, (req, res) => {

	Categoria.find({})
		.sort('descripcion')
		.populate('usuario','nombre email')
		.exec((err, categorias) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err: err
            });
        };
        res.json({
            ok: true,
            categorias
        });
    });
});

// *************************************************************
// ***              'Save a categorie'                       ***
// *************************************************************

app.post('/categoria',verficaToken,(req, res) =>{
	let body = req.body;
	let categoria = new Categoria({
		descripcion: body.descripcion,
		usuario: req.usuario._id
	});

	categoria.save((err, categoriaDB) => {
		if (err) {
			return res.status(400).json({
				ok: false,
				err: err
			});
		};

		res.json({
			ok: true,
			categoria: categoriaDB
		});
	});
});


// *************************************************************
// ***              'Update a categorie'                     ***
// *************************************************************

app.put('/categoria/:id', verficaToken  , (req, res) =>{
	let id = req.params.id;
	let body = req.body;

	Categoria.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, categoriaDB) => {

		if (err) {
			return res.status(400).json({
				ok: false,
				err: err
			});
		};

		if(!categoriaDB) {
			return res.status(400).json({
				ok: false,
				err:  {
					message: 'Categoria no encontrada'
				}
			});
		}

		res.json({
			ok: true,
			categoria: categoriaDB
		});
	});
});


//! *************************************************************
//! *** 			'Cmplete Delete a Categorie'    		  ***
//! *************************************************************

app.delete('/categoria/:id',[verficaToken, verificaAdminRole] , (req, res) => {
	let id = req.params.id;	
	Categoria.findByIdAndRemove(id, (err, CategoriaEliminada) => {
		
		if (err) {
			return res.status(400).json({
				ok: false,
				err: err
			});
		};

		if(!CategoriaEliminada) {
			return res.status(400).json({
				ok: false,
				err:  {
					message: 'Categoria no encontrada'
				}
			});
		}

		res.json({
			ok: true,
			usuario: CategoriaEliminada
		});

	});
});

module.exports = app;
//? *************************************************************
//? ***                 'Requires '                           ***
//? *************************************************************

const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();
app.use(fileUpload({ useTempFiles: true }));
const Usuario = require('../models/usuario');
const Producto = require('../models/producto');
const fs = require('fs');
const path = require('path');

// *************************************************************
// ***              'Upload files'                         ***
// *************************************************************

app.put('/upload/:tipo/:id', (req, res) => {

	let tipo = req.params.tipo;
	let id = req.params.id;

	// ! N O  H A Y  A R C H I V O S
	if (!req.files || Object.keys(req.files).length === 0) {
		return res.status(400).json(
			{
				ok: true,
				err: {
					message: 'No se ha seleccionado ningun archivo'
				}
			});
	}
	// * V A L I D A   T I P O
	let tipoVaidos = ['producto', 'usuario'];
	if (tipoVaidos.indexOf(tipo) < 0) {
		return res.status(400).json({
			ok: false,
			err: {
				message: 'Los tipos permitdss son: ' + tipoVaidos.join(', '),
				tipo
			}
		});
	}


	// * V A L I D A   E X T E N S I O N
	let archivo = req.files.archivo;
	let extensionesValida = ['png', 'gif', 'jpg', 'jpeg'];
	let nombreArchivo = archivo.name.split('.');
	let extension = nombreArchivo[nombreArchivo.length - 1];

	if (extensionesValida.indexOf(extension) < 0) {
		return res.status(400).json({
			ok: false,
			err: {
				message: 'Las extensiones permitdas son ' + extensionesValida.join(', '),
				extension
			}
		});
	}

	// * C A M B I A N D O  N O M B R E  A L  A R C H I V O
	let nombreArchioFinal = `${id}-${new Date().getMilliseconds()}.${extension}`;

	// * S U B I E N D O  A R C H I V O
	archivo.mv(`uploads/${tipo}/${nombreArchioFinal}`, (err) => {
		if (err) {
			return res.status(500).json({
				ok: false,
				err
			});
		}
		if(tipo === 'usuario') {
			imagenUsuario(id, res, nombreArchioFinal);
		}else {
			imagenProducto(id, res, nombreArchioFinal);
		}
	});
});


let imagenProducto = (id, res, nombre) => {
	Producto.findById(id, (err, productoDb) => {
		if (err) {
			borraArchivo(nombre,'producto')
			return res.status(500).json({
				ok: false,
				err
			});
		}

		if (!productoDb) {
			borraArchivo(nombre,'producto')
			return res.status(400).json({
				ok: false,
				err: {
					message: 'Producto no existe'
				}
			});
		}

		// ! E L I M I N A  I M A G E N
		borraArchivo(productoDb.img,'producto')

		productoDb.img = nombre;
		productoDb.save((err, productoDB) => {
			if (err) {
				return res.status(400).json({
					ok: false,
					err
				});
			}
			res.json({
				ok: true,
				producto: productoDB,
				img: nombre
			})
		});


	});
};
 

let imagenUsuario = (id, res,nombre) => {
	Usuario.findById(id, (err, usuarioDb) => {
		if (err) {
			borraArchivo(nombre,'usuario')
			return res.status(500).json({
				ok: false,
				err
			});
		}

		if (!usuarioDb) {
			borraArchivo(nombre,'usuario')
			return res.status(400).json({
				ok: false,
				err: {
					message: 'Usuario no existe'
				}
			});
		}

		// ! E L I M I N A  I M A G E N
		borraArchivo(usuarioDb.img,'usuario')

		usuarioDb.img = nombre;
		usuarioDb.save((err, usuarioDB) => {
			if (err) {
				return res.status(400).json({
					ok: false,
					err
				});
			}
			res.json({
				ok: true,
				usuario: usuarioDB,
				img: nombre
			})
		});


	});
};


let borraArchivo = (nombreImagen, tipo) => {
	// * V E R I F I C A  R U T A   D E L  A R C H I V O
	let pathUrl = path.resolve(__dirname, `../../uploads/${tipo}/${nombreImagen}`);

	// ! E L I M I N A  I M A G E N
	if (fs.existsSync(pathUrl)) {
		fs.unlinkSync(pathUrl);
	}
}
module.exports = app;
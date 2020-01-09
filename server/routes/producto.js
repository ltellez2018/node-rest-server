
//? *************************************************************
//? ***                 'Requires '                           ***
//? *************************************************************

let { verficaToken } = require('../middlewares/autenticacion');
const express = require('express');
let app = express();
const Producto = require('../models/producto');



// *************************************************************
// ***              'Get all products'                       ***
// *************************************************************

app.get('/producto', verficaToken, (req, res) => {

    let desde = req.query.desde || 0;
    desde = Number(desde);
    let limite = req.query.limite || 5;
    limite = Number(limite);

    Producto.find({})
        .sort('nombre')
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .skip(desde)
        .limit(limite)
        .exec((err, productos) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err: err
                });
            };

            Producto.count((err, conteo) => {
                res.json({
                    ok: true,
                    productos,
                    conteo
                });
            });
        });
});

// *************************************************************
// ***             'Get products by Id'                      ***
// *************************************************************

app.get('/producto/:id', verficaToken, (req, res) => {
    let id = req.params.id
    Producto.findById(id)
        .sort('descripcion')
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, producto) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err: err
                });
            };

            if (!producto) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'Producto no encontrada'
                    }
                });
            }
            res.json({
                ok: true,
                producto
            });
        });
});


// *************************************************************
// ***              'Find products'                       ***
// *************************************************************

app.get('/producto/buscar/:termino', verficaToken, (req, res) => {
		let termino = req.params.termino;
		let regex = new RegExp(termino,'i');

		Producto.findOne({nombre: regex})
        .populate('categoria','nombre')
        .exec((err,productos) => {
						
						if (err) {
                return res.status(400).json({
                    ok: false,
                    err: err
                });
						};

						res.json({
							ok: true,
							producto: productos
					});
						
        });

});

// *************************************************************
// ***              'Save a products'                       ***
// *************************************************************

app.post('/producto', verficaToken, (req, res) => {
    let body = req.body;

    let producto = new Producto({
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        disponible: true,
        categoria: body.categoria,
        usuario: req.usuario._id
    });

    producto.save((err, productoDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err: err
            });
        };

        res.json({
            ok: true,
            producto: productoDB
        });
    });
});

// *************************************************************
// ***              'Update a product'                       ***
// *************************************************************

app.put('/producto/:id', verficaToken, (req, res) => {
    let id = req.params.id;
    let body = req.body;

    Producto.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, productoDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err: err
            });
        };

        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Producto no encontrada'
                }
            });
        }

        res.json({
            ok: true,
            producto: productoDB
        });
    });
});


// *************************************************************
// ***              'Logic DELETE  a products'               ***
// *************************************************************

app.delete('/producto/:id', function (req, res) {
    let id = req.params.id;
    let body = {
        disponible: false
    }
    Producto.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, productoDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err: err
            });
        };

        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Producto no encontrado'
                }
            });
        }

        res.json({
            ok: true,
            producto: productoDB
        });

    });
});



module.exports = app;
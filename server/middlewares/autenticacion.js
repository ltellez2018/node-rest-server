// * R E Q U I R E S
const jwt = require('jsonwebtoken');



// *  V E R I F I C A R  T O K E N
let verficaToken = (req, res, next) => {
	let token = req.get('token');

	jwt.verify(token, process.env.SEED, (err, decode) => {

		// ! T O K E N  I N C O R R E C T O
		if (err) {
			return res.status(400).json({
				ok: false,
				err: {
					messagge: 'Token no valido'
				}
			});
		}

		// * T O K E N  V A L I D O
		req.usuario = decode.usuario;
		next();
	});
};


// * V E R I F I C A  A D M I N R O L E

let verificaAdminRole = (req, res, next) => {
	let usuario = req.usuario;

	// ! R O L E  I N C O R R E C T O
	if (usuario.role !== 'ADMIN_ROLE') {
		return res.status(400).json({
			ok: false,
			err: {
				messagge: 'El usuario no es administrador'
			}
		});
	};
	next();
};

module.exports = {
	verficaToken,
	verificaAdminRole
};
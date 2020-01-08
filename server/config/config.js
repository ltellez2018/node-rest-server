// * P U E R T O
process.env.PORT = process.env.PORT || 3000;

// * E N T O R N O
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

// * E X P I R A C I O N  D E L  T O K E N
// * 60 segundos
// * 60 minutos
// * 24 horas
// * 30 dias
process.env.CADUCIDAD_TOKEN = 60 * 60 * 24 * 30;

// * S E M I L L A  D E  A U T E N T I C A C I O N

process.env.SEED = process.env.SEED ||'este-es-el-seed-desarrollo';

// * B A S E   D E  D A T O S
let urlDB;
//urlDB = 'mongodb+srv://Leomich:2L87Al0gmHi2y5a8@cluster0-yvlci.mongodb.net/cafe?retryWrites=true&w=majority';
if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://127.0.0.1:27017/cafe';
}else {
	urlDB = process.env.MONGO_URI;
}

process.env.URLDB = urlDB;

// * G O O G L E  C L I E N T   I D 

process.env.CLIENT_ID = process.env.CLIENT_ID || '358870217690-dlt3c3o6rq6jtjtlg9ibfq7k1ronv7nu.apps.googleusercontent.com';

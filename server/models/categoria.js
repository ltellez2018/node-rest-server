// *************************************************************
// ***              'Model to Categorias'                    ***
// ***                  '09-Enero-2010'                      ***
// *************************************************************
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let categoriasSchema = new Schema({
    descripcion: { type: String, unique: true, 	required: [true, 'La descripcion  es obligatoria']} ,
    usuario: {type: Schema.Types.ObjectId, ref: 'Usuario'}
});

module.exports = mongoose.model('Categoria', categoriasSchema);


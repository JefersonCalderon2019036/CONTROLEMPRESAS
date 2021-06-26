const mongooes = require("mongoose");
var Schema = mongooes.Schema;

var UsuarioSchema = Schema({

    nombre: String,
    empresa: String,
    departamento: String,
    puesto: String
       
})

module.exports = mongooes.model("Usuarios",UsuarioSchema);
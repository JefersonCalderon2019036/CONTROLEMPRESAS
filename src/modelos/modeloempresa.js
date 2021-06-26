const mongooes = require("mongoose");
var Schema = mongooes.Schema;

var EmpresaSchema = Schema({
    
    //datos para logearse la empresa
    email: String,
    password: String,

    //datos de la empresa
    nombre: String,
    direccion: String
       
})

module.exports = mongooes.model("Empresas",EmpresaSchema);
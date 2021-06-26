"use strict"

//Importaciones
const Empresas = require("../modelos/modeloempresa");
const bcrypt = require("bcrypt-nodejs");
const jwt = require("../servicios/jwt");

//Funcion Ejemplo
function ejemplo(req, res){
    res.status(200).send({mensaje: "Este es una prueba de conexion"})
}

function EmpresasMater(req, res){
    var EmpresasModelo = Empresas();

    Empresas.find({$or:[
        {email: "Admin"},
        {password: "123456"}
    ]}).exec((err, EmpresaEncontrada) => {
        if(err) return res.status(500).send({mensaje: "Erro en la peticion de la Empresas"})

        if(EmpresaEncontrada && EmpresaEncontrada.length >= 1){
            return res.status(500).send({mensaje: "El empresa ya existe"});
        }else{
            bcrypt.hash("123456", null, null, (err, passencriptada) => {
                EmpresasModelo.password = passencriptada;
                EmpresasModelo.email = "Admin";
                EmpresasModelo.nombre = "Empresa Maestra";

                EmpresasModelo.save((err, EmpresaGuardada) => {

                    if(err) return res.status(500).send({mensaje: "Error al guardar la empresa"})

                    if(EmpresaGuardada){
                        res.status(200).send(EmpresaGuardada);
                    }else{
                        res.status(404).send({mensaje: "No se a podido registrar la nueva emrpesa"});
                    }
                })
            })
        }
    })
}

function Login(req, res){
    var params = req.body;

    if(params.email){
        if(params.password){
            Empresas.findOne({ email: params.email}, (err, EmpresaEncontrada) =>{
                if (err) return res.status(500).send({mensaje: "Error en la peticion"});

                if(EmpresaEncontrada){
                    bcrypt.compare(params.password, EmpresaEncontrada.password, (err, passCorrecta) => {
                        if(passCorrecta){
                            if(params.token == "true"){
                                return res.status(200).send({ toke: jwt.createToken(EmpresaEncontrada)})
                            }else{
                                EmpresaEncontrada.password = undefined;
                                return res.status(200).send({EmpresaEncontrada})
                            }
                        }else{
                            res.status(404).send({mensaje: "No se a podido encontrar la empresa"})
                        }
                    })
                }else{
                    res.status(404).send({mensaje: "La Empresa no se a podido ingresar"})
                }
            })
        }else{
            res.status(500).send({mensaje: "Rellene la contraseña para ingresar"})
        }
    }else{
        res.status(500).send({mensaje: "Rellene el email para ingresar"})
    }
}

function AgregarEmpresas(req, res){

    var EmpresasModelo = Empresas();
    var params = req.body;

    if(params.emailempresa == "Admin" && params.pasemrpesa == "123456"){
    if(params.email){
        if(params.password){
            Empresas.find({$or:[
                {email: params.email},
                {password: params.password}
            ]}).exec((err, EmpresaEncontrada) => {
                if(err) return res.status(500).send({mensaje: "Erro en la peticion de las Empresas"})
        
                if(EmpresaEncontrada && EmpresaEncontrada.length >= 1){
                    return res.status(500).send({mensaje: "El empresa ya existe"});
                }else{
                    bcrypt.hash(params.password, null, null, (err, passencriptada) => {
                        EmpresasModelo.password = passencriptada;
                        EmpresasModelo.email = params.email;
                        EmpresasModelo.nombre = params.nombre;
                        EmpresasModelo.direccion = params.direccion;
                        EmpresasModelo.save((err, EmpresaGuardada) => {
                            if(err) return res.status(500).send({mensaje: "Error al guardar la empresa"})
                            if(EmpresaGuardada){
                                res.status(200).send(EmpresaGuardada);
                            }else{
                                res.status(404).send({mensaje: "No se a podido registrar la nueva emrpesa"});
                            }
                        })
                    })
                }
            })
        }else{
            res.status(500).send({mensaje: "Rellene la contraseña para registrar una nueva emrpesa"})
        }
    }else{
        res.status(500).send({mensaje: "Rellene el Email para registrar una nueva empresa"});
    }
    }else{
        res.status(500).send({mensaje: "No tiene autorizacion para la creacion de nuevas empresas"})
    }
    
}

function VerTodasLasEmpresas(req, res){
    Empresas.find((err,EmpresaEncontrada) => {
        if(err) return res.status(500).send({mensaje: "Error en la peticion de las empresas"})

        if(!EmpresaEncontrada) return res.status(500).send({mensaje: "Error en la consulta de las empresas"})
        return res.status(200).send({EmpresaEncontrada});
    })
}

module.exports = {
    ejemplo,
    EmpresasMater,
    Login,
    AgregarEmpresas,
    VerTodasLasEmpresas
}
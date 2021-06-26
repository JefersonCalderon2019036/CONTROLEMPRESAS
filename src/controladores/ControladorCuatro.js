"use strict"

//Importaciones
const Empresas = require("../modelos/modeloempresa");
const Usuarios = require("../modelos/modelousuarios");
const bcrypt = require("bcrypt-nodejs");
const jwt = require("../servicios/jwt");
const PDF = require("pdfkit")
const fs = require("fs");
const { DocumentProvider } = require("mongoose");

function EditarEmpresas(req, res){
    var params = req.body;
    if(params.email && params.password){
        if(params.email == "Admin" && params.password == "123456"){
            Empresas.findByIdAndUpdate({_id: params.idEmpresaModificar}, {nombre: params.nombreEmpresaModificar, direccion: params.direccionEmpresaModificar},
                { new: true, useFindAndModify: true}, (err, EmpresaModificada) => {
                    if(err) return res.status(500).send({mensaje: "Error en la peticion"})

                    if(EmpresaModificada){
                        res.status(200).send({EmpresaModificada})
                    }else{
                        res.status(404).send({mensaje: "No se a podido modificar la empresa"})
                    }
                })
        }else{
            res.status(200).send({mensaje: "No tiene autorizacion para hacer cambios en las empresas"})
        }
    }else{
        res.status(500).send({mensaje: "Rellene los datos necesarios para la verificación"})
    }
}

function EditarUsuarios(req, res){
    var params = req.body;

    if(params.email){
        if(params.password){
            Empresas.findOne({ email: params.email}, (err, EmpresaEncontrada) =>{
                if (err) return res.status(500).send({mensaje: "Error en la peticion"});

                if(EmpresaEncontrada){
                    bcrypt.compare(params.password, EmpresaEncontrada.password, (err, passCorrecta) => {
                        if(passCorrecta){
                            Usuarios.findByIdAndUpdate({_id: params.idUsuarioModificar}, 
                                {nombre: params.nombreModificado, departamento: params.departamentoModificado, puesto: params.puestoModificado},
                                { new: true, useFindAndModify: true}, (err, UsuarioMoficado) => {
                                    if(err) return res.status(500).send({mensaje: "Error en la peticion"})
                
                                    if(UsuarioMoficado){
                                        res.status(200).send({UsuarioMoficado})
                                    }else{
                                        res.status(404).send({mensaje: "No se a podido modificar la empresa"})
                                    }
                                })
                        }else{
                            res.status(404).send({mensaje: "No tiene la autorizacion para realizar un cambio "})
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


module.exports = {
    EditarEmpresas,
    EditarUsuarios
}
"use strict"

//Importaciones
const Empresas = require("../modelos/modeloempresa");
const Usuarios = require("../modelos/modelousuarios");
const bcrypt = require("bcrypt-nodejs");
const jwt = require("../servicios/jwt");

function VerTodosLosUsuarios(req, res){
    Usuarios.find((err, UsuariosEncontrados) => {
        if(err) return res.status(500).send({mensaje: "Error en la petición"})

        if(UsuariosEncontrados){
            res.status(200).send({UsuariosEncontrados});
        }else{
            res.status(500).send({mensaje: "No se encontro ningun usuario"});
        }
    })
}

function VerUsuariosPorId(req, res){
    var params = req.body;

    Usuarios.find({ _id: params.id}, (err, UsuariosEncotrados) => {
      if(err) return res.status(500).send({mensaje: "Error en la peticion"})
            
         if(UsuariosEncotrados){
             res.status(200).send({UsuariosEncotrados});
            }else{
            res.status(404).send({mensaje: "Error en la busqueda"});
          }
       })
}

function EliminarEmpresa(req, res){
    var params = req.body;
    if(params.email && params.password && params.delete){

        if(params.email == "Admin" && params.password == "123456"){
        Empresas.find({$or: [
            { nombre: params.delete}
        ]}).exec((err, EmpresasEncontrada) => {
            if(err) return res.status(500).send({mensaje: "Error en la primera peticón"})

            if(EmpresasEncontrada && EmpresasEncontrada.length >= 1){
               
                Empresas.findOneAndDelete(EmpresasEncontrada._id, function(err){
                    if(err){
                        res.status(500).send({mensaje: "Error en la peticion", err})
                    }else{
                        Empresas.find((err,EmpresaEncontrada) => {
                            if(err) return res.status(500).send({mensaje: "Error en la peticion de las empresas"})
                    
                            if(!EmpresaEncontrada) return res.status(500).send({mensaje: "Error en la consulta de las empresas"})
                            return res.status(200).send({EmpresaEncontrada});
                        })
                    }
                })
            }else{
                res.status(404).send({mensaje: "La empresa no existe"})
            }
        })
    }else{
        res.status(500).send({mensaje: "No tiene permisos para eliminar las empresas"})
    }
    }else{
        res.status(500).send({mensaje: "Rellene los datos necesarios"})
    }
}

function EliminarUsuarios(req, res){
    var params = req.body;

    if(params.email){
        if(params.password){
            Empresas.findOne({ email: params.email}, (err, EmpresaEncontrada) =>{
                if (err) return res.status(500).send({mensaje: "Error en la peticion"});

                if(EmpresaEncontrada){
                    bcrypt.compare(params.password, EmpresaEncontrada.password, (err, passCorrecta) => {
                        if(passCorrecta){
                            Usuarios.find({$or: [
                                {nombre: params.delete}
                            ]}).exec((err, UsuariosEncontrados) => {
                                if(err) return res.status(500).send({mensaje: "Errir en la peticion"})

                                if(UsuariosEncontrados){
                                    Usuarios.findOneAndDelete(UsuariosEncontrados._id, function(err){
                                        if(err){
                                            res.status(404).send({mensaje: "No se apodido eliminar su usuario"}) 
                                        }else{
                                            Usuarios.find((err, UsuariosEncontrados) => {
                                                if(err) return res.status(500).send({mensaje: "Error en la petición"})
                                        
                                                if(UsuariosEncontrados){
                                                    res.status(200).send({UsuariosEncontrados});
                                                }else{
                                                    res.status(500).send({mensaje: "No se encontro ningun usuario"});
                                                }
                                            }) 
                                        }
                                    })
                                }else{
                                    res.status(404).send({mensaje: "No existe Usuarios con este nombre"}) 
                                }
                            })
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

module.exports = {
    VerTodosLosUsuarios,
    VerUsuariosPorId,
    EliminarEmpresa,
    EliminarUsuarios
}
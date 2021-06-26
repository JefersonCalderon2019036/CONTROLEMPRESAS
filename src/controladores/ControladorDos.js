"use strict"

//Importaciones
const Empresas = require("../modelos/modeloempresa");
const Usuarios = require("../modelos/modelousuarios");
const bcrypt = require("bcrypt-nodejs");
const jwt = require("../servicios/jwt");

function AgregarUsuario(req, res){
  var UsuariosModelo = new Usuarios();
  var params = req.body;

  if(params.personal && params.puesto && params.departamento && params.empresas && params.password){
    Usuarios.find({$or: [
      {nombre: params.nombre}
    ]}).exec((err, UsuarioEncontrado) => {
      if(err) return res.status(500).send({mensaje: "Error en la primera petición"})

      if(UsuarioEncontrado && UsuarioEncontrado.length >= 1){
        res.status(404).send({mensaje: "Usuario ya existe"});
      }else{
        Empresas.findOne({ email: params.empresas}, (err, EmpresaEncontrada) =>{
          if (err) return res.status(500).send({mensaje: "Error en la segunda peticion"});

          if(EmpresaEncontrada){
              bcrypt.compare(params.password, EmpresaEncontrada.password, (err, passCorrecta) => {
                  if(passCorrecta){
                      UsuariosModelo.nombre = params.personal;
                      UsuariosModelo.puesto = params.puesto;
                      UsuariosModelo.departamento = params.departamento;
                      UsuariosModelo.empresa = EmpresaEncontrada.nombre;

                      UsuariosModelo.save((err, EmpresaGuardada) => {

                        if(err) return res.status(500).send({mensaje: "Error al guardar la empresa"})
    
                        if(EmpresaGuardada){
                            res.status(200).send(EmpresaGuardada);
                        }else{
                            res.status(404).send({mensaje: "No se a podido registrar la nueva emrpesa"});
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
      }
    })
  }else{
      res.status(500).send({mensaje: "Rellene los datos necesarios"});
  }
}

function VerTodosUsuariosEmpresas(req, res){
  var params = req.body;

    Usuarios.find({empresa: params.empresas}, (err, UsuariosEncotrados) => {
      if(err) return res.status(500).send({mensaje: "Error en la peticion"})
            
         if(UsuariosEncotrados){
             res.status(200).send({UsuariosEncotrados});
            }else{
            res.status(404).send({mensaje: "Error en la busqueda"});
          }
       })
}

function verusuariosporpuesto(req, res){
  var params = req.body;

  Usuarios.find({puesto: params.puesto}, (err, UsuariosEncotrados) => {
    if(err) return res.status(500).send({mensaje: "Error en la peticion"})
          
       if(UsuariosEncotrados){
           res.status(200).send({UsuariosEncotrados});
          }else{
          res.status(404).send({mensaje: "Error en la busqueda"});
        }
     })
}

function verUsuariosPorDepartamento( req, res){
  var params = req.body;

  Usuarios.find({departamento: params.departamento}, (err, UsuariosEncotrados) => {
    if(err) return res.status(500).send({mensaje: "Error en la peticion"})
          
       if(UsuariosEncotrados){
           res.status(200).send({UsuariosEncotrados});
          }else{
          res.status(404).send({mensaje: "Error en la busqueda"});
        }
     })
}

function verUsuariosPorNombre(req, res){
  var params = req.body;

  Usuarios.find({nombre: params.nombre}, (err, UsuariosEncotrados) => {
    if(err) return res.status(500).send({mensaje: "Error en la peticion"})
          
       if(UsuariosEncotrados){
           res.status(200).send({UsuariosEncotrados});
          }else{
          res.status(404).send({mensaje: "Error en la busqueda"});
        }
     })
}

module.exports = {
    AgregarUsuario,
    VerTodosUsuariosEmpresas,
    verusuariosporpuesto,
    verUsuariosPorDepartamento,
    verUsuariosPorNombre
}
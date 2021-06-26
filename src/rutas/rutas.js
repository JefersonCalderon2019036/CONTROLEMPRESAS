"use strict"

//Exportaciones
const express = require("express");
const ControllerOne = require("../controladores/ControladorUno");
const ControllerTwo = require("../controladores/ControladorDos");
const ControllerThree = require("../controladores/ControladorTres");
const ControllerFour = require("../controladores/ControladorCuatro");
const md_autentificador = require("../autentificador/autentificador");


//Rutas
//localhost:3000/api/<<funcion>>
var api = express.Router();
api.get("/PruebadeConexion", ControllerOne.ejemplo);
api.get("/EmpresaMaestra", ControllerOne.EmpresasMater);
api.post("/Login", ControllerOne.Login);
api.post("/AgregarEmpresa", md_autentificador.ensureAuth, ControllerOne.AgregarEmpresas);
api.get("/TodasLasEmpresas", md_autentificador.ensureAuth, ControllerOne.VerTodasLasEmpresas);
api.post("/AgregarUsuario", md_autentificador.ensureAuth, ControllerTwo.AgregarUsuario);
api.post("/VerUsuarios", md_autentificador.ensureAuth, ControllerTwo.VerTodosUsuariosEmpresas);
api.post("/verUsuariosPorPuesto", md_autentificador.ensureAuth, ControllerTwo.verusuariosporpuesto);
api.post("/VerUsuariosPorDepartamento", md_autentificador.ensureAuth, ControllerTwo.verUsuariosPorDepartamento);
api.post("/VerUsuariosPorNombre", md_autentificador.ensureAuth, ControllerTwo.verUsuariosPorNombre);
api.get("/VerTodosLosUsuarios", md_autentificador.ensureAuth, ControllerThree.VerTodosLosUsuarios);
api.post("/VerUsuariosPorId", md_autentificador.ensureAuth, ControllerThree.VerUsuariosPorId);
api.post("/EliminarEmpresas", md_autentificador.ensureAuth, ControllerThree.EliminarEmpresa);
api.post("/EliminarUsuarios", md_autentificador.ensureAuth, ControllerThree.EliminarUsuarios);
api.post("/EditarEmpresa", md_autentificador.ensureAuth, ControllerFour.EditarEmpresas);
api.post("/EditarUsuarios", md_autentificador.ensureAuth, ControllerFour.EditarUsuarios);

module.exports = api;
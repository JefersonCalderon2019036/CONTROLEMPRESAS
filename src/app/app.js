"use strict"

//Variables Globales
const express = require("express");
const app = express();
const bodyParser = require("body-parser")
const cors= require("cors");

//Importaciones Rutas
const ruta = require("../rutas/rutas");

//Middlewars
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

//Cabeceras
app.use(cors());

//Carga de rutas
app.use("/api",ruta);

//Exportar
module.exports = app;

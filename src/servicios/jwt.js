"use strict"

var jwt = require("jwt-simple");
var moment = require("moment");
require('dotenv').config();

var secret = process.env.token;

exports.createToken = function (empresa){
    var playload = {
        sub: empresa._id,
        nombre: empresa.nombre,
        email: empresa.email,
        direccion: empresa.direccion,
        iat: moment().unix(),
        exp: moment().day(10, "days").unix()
    }

    return jwt.encode(playload, secret);
}
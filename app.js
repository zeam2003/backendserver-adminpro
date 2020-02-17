//jshint esversion: 6
// Requires
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

// Inicializar variables
var app = express();


// Body Parser - x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false}));
app.use(bodyParser.json());

// Importar Rutas
var appRoutes = require('./routes/app');
var usuarioRoutes = require('./routes/usuario');
var loginRoutes = require('./routes/login');
var hospitalRoutes = require('./routes/hospital');
var medicoRoutes = require('./routes/medico');
var busquedaRoutes = require('./routes/busqueda');
var uploadRoutes = require('./routes/upload');
var imagenesRoutes = require('./routes/imagenes');




// Conexión a la base de datos
/* mongoose.connection.openUri('mongodb://localhost:27017/hospitalDB', ( err, res )=> {
    if ( err ) throw err;

    console.log('Base de datos: \x1b[32m%s\x1B[0m', 'Online');
}); */

mongoose.connect('mongodb://localhost:27017/hospitalDB', { useNewUrlParser: "true",useUnifiedTopology: true });
mongoose.set('useCreateIndex', true);
mongoose.connection.on("error",(err)=>{

    console.log("error",err);
});

mongoose.connection.on('Conectado',(err,res)=>{
    console.log('Base de Datos: \x1b[32m%s\x1B[0m', 'Online');
});

// Server Index Config
/* var serveIndex = require('serve-index');
app.use(express.static(__dirname + '/'))
app.use('/uploads', serveIndex(__dirname + '/uploads')); */



// Rutas
app.use('/usuario', usuarioRoutes);
app.use('/hospital', hospitalRoutes);
app.use('/medico', medicoRoutes);
app.use('/login', loginRoutes);
app.use('/busqueda', busquedaRoutes);
app.use('/upload', uploadRoutes);
app.use('/img', imagenesRoutes);
app.use('/', appRoutes);


// Escuchar peticiones
app.listen(3000, () => {
    console.log('Express Server puerto 3000: \x1b[32m%s\x1B[0m', 'Online');
});
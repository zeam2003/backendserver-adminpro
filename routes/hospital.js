//jshint esversion: 6
var express = require('express');

var mdAutenticacion = require('../middlewares/autenticacion');


var app = express();

const Hospital = require('../models/hospital');

// =========================================
// Obtener todos los Hospitales
// =========================================

app.get('/', (req, res, next ) => {

    var desde = req.query.desde ||  0;
    desde = Number(desde);

    Hospital.find({})
    .skip(desde)
    .limit(5)
    .populate('usuario', 'nombre email')
           .exec(
                (err, hospitales )=> {

        if( err ) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error cargando Hospital',
                errors: err
            });
        }

        Hospital.count({}, (err, conteo) => {
            res.status(200).json({
                ok: true,
                hospitales,
                total: conteo
            });
        });

        
    });

    
});






// =========================================
// Actualizar hospital
// =========================================
app.put('/:id', mdAutenticacion.verifcaToken, (req, res) => {

    var id = req.params.id;
    var body = req.body;

    Hospital.findById( id, (err, hospital) => {

        
        if( err ) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar Hospital',
                errors: err
            });
        }

        if ( !hospital ){

            return res.status(400).json({
                ok: false,
                mensaje: 'El hospital con el id no existe',
                errors: { message: ' NO existe un hospital con ese ID ' }
            });
        }

        hospital.nombre = body.nombre;
        hospital.usuario = req.usuario._id;
        
    
        hospital.save( (err, hospitalGuardado) => {

            if(err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualziar hospital',
                    errors: err
                });
            }

           

            res.status(200).json({
                ok: true,
                hospital: hospitalGuardado
            });

        });

    });

});

// =========================================
// Crear un nuevo hospital
// =========================================
app.post('/', mdAutenticacion.verifcaToken, (req, res)=> {

    var body = req.body;

    var hospital = new Hospital({
        nombre: body.nombre,
        usuario: req.usuario._id
    });

    hospital.save( ( err, hospitalGuardado ) => {

        if( err ) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear hospital',
                errors: err
            });
        }

        res.status(201).json({
            ok: true,
            hospital: hospitalGuardado
        });

    });

   

});

// =========================================
// Borrar un Hospital por el ID
// =========================================
app.delete('/:id', mdAutenticacion.verifcaToken, (req, res) =>{

    var id = req.params.id;

    Hospital.findByIdAndRemove(id, ( err, hospitalBorrado )=>{

        if( err ) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al borrar hospital',
                errors: err
            });
        }

        if( !hospitalBorrado  ) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No existe ningun Hospital con ese ID',
                errors: { message: 'No existe ningun Hospital con ese ID'}
            });
        }

        res.status(200).json({
            ok: true,
            hosptial: hospitalBorrado
        });
    });

});

module.exports = app;
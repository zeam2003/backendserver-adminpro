//jshint esversion: 6
var express = require('express');

var mdAutenticacion = require('../middlewares/autenticacion');


var app = express();

const Medico = require('../models/medico');

// =========================================
// Obtener todos los Medicos
// =========================================

app.get('/', (req, res, next ) => {

    var desde = req.query.desde ||  0;
    desde = Number(desde);

    Medico.find({})
           .skip(desde)
           .limit(5)
           .populate('usuario', 'nombre email')
           .populate('hospital')
           .exec(
                (err, medicos )=> {

        if( err ) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error cargando Medico',
                errors: err
            });
        }

        Medico.count({}, (err, conteo) => {
            res.status(200).json({
                ok: true,
                medicos,
                total: conteo
            });
        });

        
    });

    
});






// =========================================
// Actualizar medico
// =========================================
app.put('/:id', mdAutenticacion.verifcaToken, (req, res) => {

    var id = req.params.id;
    var body = req.body;

    Medico.findById( id, (err, medico) => {

        
        if( err ) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar Medico',
                errors: err
            });
        }

        if ( !medico ){

            return res.status(400).json({
                ok: false,
                mensaje: 'El medico con el id no existe',
                errors: { message: ' NO existe un medico con ese ID ' }
            });
        }

        medico.nombre = body.nombre;
        medico.usuario = req.usuario._id;
        medico.hospital = body.hospital;

        
    
        medico.save( (err, medicoGuardado) => {

            if(err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualziar medico',
                    errors: err
                });
            }

           

            res.status(200).json({
                ok: true,
                medico: medicoGuardado
            });

        });

    });

});

// =========================================
// Crear un nuevo medico
// =========================================
app.post('/', mdAutenticacion.verifcaToken, (req, res)=> {

    var body = req.body;

    var medico = new Medico({
        nombre: body.nombre,
        usuario: req.usuario._id,
        hospital: body.hospital
    });

    medico.save( ( err, medicoGuardado ) => {

        if( err ) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear medico',
                errors: err
            });
        }

        res.status(201).json({
            ok: true,
            medico: medicoGuardado
        });

    });

   

});

// =========================================
// Borrar un Medico por el ID
// =========================================
app.delete('/:id', mdAutenticacion.verifcaToken, (req, res) =>{

    var id = req.params.id;

    Medico.findByIdAndRemove(id, ( err, medicoBorrado )=>{

        if( err ) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al borrar medico',
                errors: err
            });
        }

        if( !medicoBorrado  ) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No existe ningun Medico con ese ID',
                errors: { message: 'No existe ningun Medico con ese ID'}
            });
        }

        res.status(200).json({
            ok: true,
            medico: medicoBorrado
        });
    });

});

module.exports = app;
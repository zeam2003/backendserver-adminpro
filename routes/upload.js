//jshint esversion: 6
var express = require('express');
var fileUpload = require('express-fileupload');
var fs = require('fs');

var app = express();

var Usuario = require('../models/usuario');
var Medico = require('../models/medico');
var Hospital = require('../models/hospital');

// Default Options
app.use(fileUpload());


app.put('/:tipo/:id', (req, res, next ) => {

    var tipo = req.params.tipo;
    var id = req.params.id;


    // tipos de colección
    var tiposValidos = ['hospitales', 'medicos', 'usuarios'];
    if (tiposValidos.indexOf(tipo) < 0) {
        return res.status(400).json({
            ok: false,
            mensaje: 'Tipo de colección no es válida',
            errors: { message: 'Tipo de colección no es válida' }
        });
    }


    if (!req.files ){
        return res.status(400).json({
            ok: false,
            mensaje: 'no seleccionó nada',
            errors: { message: 'Debe de seleccionar una imagen' }
        });
    }

    // Obtener nombre del archivo
    var archivo = req.files.imagen;
    var nombreCortado = archivo.name.split('.');
    var extensionArchivo = nombreCortado[nombreCortado.length - 1];

    // Sólo estas extensiones aceptamos
    var extensionesValidas = ['png', 'jpg', 'gif', 'jpeg'];

    if (extensionesValidas.indexOf(extensionArchivo) < 0) {
        return res.status(400).json({
            ok: false,
            mensaje: 'Extension no válida',
            errors: { message: 'Las extensiones válidas son ' + extensionesValidas.join(', ') }
        });
    }

    var nombreArchivo = `${ id }-${ (new Date().getMilliseconds()) }.${ extensionArchivo }`;


    // Mover el archivo del temporal a un path
    var path = `./uploads/${ tipo }/${ nombreArchivo }`;

    archivo.mv( path, err => {
        if(err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al mover archivo',
                errors: err
            });
        }

        console.log(id);

        

        subirPorTipo( tipo, id, nombreArchivo, res );

      
    });
    
    
});

function subirPorTipo( tipo, id, nombreArchivo, res ) {

    if( tipo === 'usuarios'){
        
        Usuario.findById( id, (err, usuario) =>{

            if(!usuario) {
                return res.status(400).json({
                    ok: true,
                    mensaje: 'Usuario no existe',
                    errors: { message: 'Usuario no existe' }
                });
            }

            if( !usuario ) {
                return res.status(400).json({
                    ok: true,
                    mensaje: 'Usuario no existe',
                    errors: { message: 'Usuario no existe'}
                }); 
            }

            var pathViejo = './uploads/usuarios/' + usuario.img;

            // Si existe elimina la imagen anterior
            if( fs.existsSync( pathViejo) ){
               
                    fs.unlinkSync( pathViejo);            
                }

            usuario.img = nombreArchivo;

            usuario.save( (err, usuarioActualizado) =>{

                usuarioActualizado.password = ':)';
                    
                return res.status(200).json({
                        ok: true,
                        mensaje: 'Imagen de usuario actualizada',
                        usuario: usuarioActualizado
                    }); 


            });

        });
    }

    if( tipo === 'medicos'){

        Medico.findById( id, (err, medico) =>{

            if(!medico) {
                return res.status(400).json({
                    ok: true,
                    mensaje: 'El medico no existe',
                    errors: { message: 'El medico no existe' }
                });
            }

            if( !medico ) {
                return res.status(400).json({
                    ok: true,
                    mensaje: 'Medico no existe',
                    errors: { message: 'Medico no existe'}
                }); 
            }

            var pathViejo = './uploads/medicos/' + medico.img;

            // Si existe elimina la imagen anterior
            if( fs.existsSync( pathViejo) ){
               
                    fs.unlinkSync( pathViejo);            
                }

            medico.img = nombreArchivo;

            medico.save( (err, medicoActualizado) =>{

                    
                return res.status(200).json({
                        ok: true,
                        mensaje: 'Imagen del medico actualizada',
                        usuario: medicoActualizado
                    }); 


            });

        });

    }

    if( tipo === 'hospitales'){

        Hospital.findById( id, (err, hospital) =>{

            if(!hospital) {
                return res.status(400).json({
                    ok: true,
                    mensaje: 'El hospital no existe',
                    errors: { message: 'El hospital no existe' }
                });
            }

            if( !hospital ) {
                return res.status(400).json({
                    ok: true,
                    mensaje: 'Hospital no existe',
                    errors: { message: 'Hospital no existe'}
                }); 
            }

            var pathViejo = './uploads/hospitals/' + hospital.img;

            // Si existe elimina la imagen anterior
            if( fs.existsSync( pathViejo) ){
               
                    fs.unlinkSync( pathViejo);            
                }

            hospital.img = nombreArchivo;

            hospital.save( (err, hospitalActualizado) =>{
            
                    
                return res.status(200).json({
                        ok: true,
                        mensaje: 'Imagen del medico actualizada',
                        usuario: hospitalActualizado
                    }); 


            });

        });

        
    }

} 





module.exports = app;
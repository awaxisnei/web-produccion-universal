'use strict';
const nodemailer = require('nodemailer');


function pruebas(req,res)
{
    res.status(200).send({
        message: 'Probando el controlador para mandar un mail'
    });
}

function sendMail(req, res)
{

    //Recogemos los parámetros (body) de la petición
    var params=req.body;
    var nombre=params.nombre;
    var asunto=params.asunto;
    var mensaje=params.mensaje;
    var telefono=params.telefono;
    var email=params.email;

    console.log(params);
    

    // Generate test SMTP service account from ethereal.email
    // Only needed if you don't have a real mail account for testing
    nodemailer.createTestAccount((err, account) => {
        // create reusable transporter object using the default SMTP transport
        let transporter = nodemailer.createTransport({
            host: 'smtp.luismiguelmorales.com',
            port: 465,
            secure: true, // true for 465, false for other ports
            auth: {
                user: 'luismiguelmorales@luismiguelmorales.com', // generated ethereal user
                pass: 'S4l4h4ll41' // generated ethereal password
            },
            tls: {
                    rejectUnauthorized: false
                 }
        });

        // setup email data with unicode symbols
        let mailOptions = {
            from: '"Luis Miguel" <luismiguelmorales@luismiguelmorales.com>', // sender address
            to: 'luismi.morales@gmail.com', // list of receivers
            subject: 'Página de contacto', // Subject line
            text: 'Nombre: '+nombre+' Asunto:'+asunto+' telefono:'+telefono+' email:'+email+'mensaje: '+mensaje, // plain text body
            html: '<p>Nombre: '+nombre+'</p>'+ // html body
                  '<p>Email: '+email+'</p>'+ 
                  '<p>Teléfono: '+telefono+'</p>'+ 
                  '<p>Asunto: '+asunto+'</p>'+ 
                  '<p>Mensaje: '+mensaje+'</p>' 
        };

        // send mail with defined transport object
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return console.log(error);
            }
            console.log('Message sent: %s', info.messageId);
            // Preview only available when sending through an Ethereal account
            console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
            res.status(200).send({
                message: 'Email enviado correctamente'
            });
            // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
            // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
        });
    });


    

}



module.exports={
    pruebas,
    sendMail
};
const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware obligatorios - MODIFICADO CON CORS EXTENDIDO PARA VERCEL
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Configuración del puente directo con los servidores seguros de Google Gmail
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS // Tu contraseña de aplicación de 16 letras de Google
  }
});

// Ruta única de la API para procesar el formulario de la terminal
app.post('/api/transmit', (req, res) => {
  const { name, company, email, subject, message } = req.body;

  // Maquetación del correo que vas a recibir en tu bandeja de entrada
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.EMAIL_USER, // Te llegará el correo a ti mismo
    replyTo: email,             // Si le das a "Responder", le escribirás directamente al reclutador
    subject: `[TERMINAL_OS] ${subject}`,
    text: `
==================================================
  NUEVA TRANSMISIÓN RECIBIDA DESDE EL PORTFOLIO
==================================================
REMITENTE: ${name}
ORGANIZACIÓN: ${company || 'No especificada'}
CORREO DE CONTACTO: ${email}
--------------------------------------------------
MENSAJE:
${message}
==================================================
    `
  };

  // Ejecutar el envío del correo electrónico
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error en el protocolo de envío:', error);
      // Retornamos un estado estructurado para que no rompa el JSON del frontend
      return res.status(500).json({ 
        status: 'ERROR', 
        message: error.message || 'Fallo de conexión con el servidor de Gmail.' 
      });
    }
    console.log('Transmisión completada con éxito:', info.response);
    
    // Cambiado 'SUCCESS' por el mensaje que espera tu index.html para ponerse verde
    res.status(200).json({ 
      status: 'TRANSMISSION_SUCCESSFUL', 
      message: 'Transmisión enviada al núcleo con éxito.' 
    });
  });
});

// Levantar el servidor en el puerto asignado una sola vez
app.listen(PORT, () => {
  console.log(`[CORE_ONLINE] Servidor corriendo en http://localhost:${PORT}`);
});
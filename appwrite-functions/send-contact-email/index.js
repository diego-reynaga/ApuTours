import { Client, Databases } from 'node-appwrite';
import nodemailer from 'nodemailer';

export default async ({ req, res, log, error }) => {
  try {
    // Parse payload
    const payload = JSON.parse(req.body || '{}');
    const { mensajeId, nombre, email, telefono, asunto, mensaje } = payload;

    log(`Procesando mensaje de contacto: ${nombre} <${email}>`);

    // Validar datos requeridos
    if (!nombre || !email || !asunto || !mensaje) {
      error('Faltan datos requeridos');
      return res.json({
        success: false,
        error: 'Datos incompletos'
      }, 400);
    }

    // Configurar transporter de nodemailer
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // Verificar conexión SMTP
    await transporter.verify();
    log('Conexión SMTP verificada');

    // HTML del email
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f7fafc; padding: 30px; border-radius: 0 0 10px 10px; }
          .field { margin-bottom: 15px; }
          .label { font-weight: bold; color: #2d3748; }
          .value { color: #4a5568; margin-left: 10px; }
          .message-box { background: white; padding: 20px; border-radius: 8px; margin-top: 15px; border-left: 4px solid #667eea; }
          .footer { text-align: center; margin-top: 20px; color: #718096; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>📧 Nuevo Mensaje de Contacto</h1>
            <p>ApuTours - Sistema de Gestión</p>
          </div>
          <div class="content">
            <div class="field">
              <span class="label">👤 Nombre:</span>
              <span class="value">${nombre}</span>
            </div>
            <div class="field">
              <span class="label">📧 Email:</span>
              <span class="value">${email}</span>
            </div>
            ${telefono ? `
            <div class="field">
              <span class="label">📱 Teléfono:</span>
              <span class="value">${telefono}</span>
            </div>
            ` : ''}
            <div class="field">
              <span class="label">📋 Asunto:</span>
              <span class="value">${asunto}</span>
            </div>
            <div class="message-box">
              <div class="label">💬 Mensaje:</div>
              <p>${mensaje.replace(/\n/g, '<br>')}</p>
            </div>
            ${mensajeId ? `
            <div class="field" style="margin-top: 20px; font-size: 11px; color: #a0aec0;">
              ID del mensaje: ${mensajeId}
            </div>
            ` : ''}
          </div>
          <div class="footer">
            <p>Este correo fue generado automáticamente por el sistema ApuTours</p>
            <p>No responder a este correo. Para contactar al cliente, usar: ${email}</p>
          </div>
        </div>
      </body>
      </html>
    `;

    // Enviar email
    const info = await transporter.sendMail({
      from: `"ApuTours - Contacto" <${process.env.EMAIL_FROM || process.env.SMTP_USER}>`,
      to: process.env.EMAIL_TO || 'info@aputours.com',
      replyTo: email,
      subject: `[ApuTours Contacto] ${asunto}`,
      html: htmlContent,
      text: `
Nuevo mensaje de contacto - ApuTours

Nombre: ${nombre}
Email: ${email}
Teléfono: ${telefono || 'No proporcionado'}
Asunto: ${asunto}

Mensaje:
${mensaje}

---
ID: ${mensajeId || 'N/A'}
      `.trim()
    });

    log(`Email enviado: ${info.messageId}`);

    // Opcional: Actualizar estado en la base de datos
    if (mensajeId && process.env.APPWRITE_API_KEY) {
      try {
        const client = new Client()
          .setEndpoint(process.env.APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1')
          .setProject(process.env.APPWRITE_PROJECT_ID)
          .setKey(process.env.APPWRITE_API_KEY);

        const databases = new Databases(client);
        
        await databases.updateDocument(
          process.env.APPWRITE_DATABASE_ID,
          process.env.APPWRITE_CONTACTOS_COLLECTION_ID,
          mensajeId,
          { estado: 'enviado' }
        );
        
        log('Estado actualizado en BD');
      } catch (dbError) {
        error('Error actualizando BD (no crítico): ' + dbError.message);
      }
    }

    return res.json({
      success: true,
      messageId: info.messageId,
      message: 'Email enviado correctamente'
    });

  } catch (err) {
    error('Error en la función: ' + err.message);
    return res.json({
      success: false,
      error: err.message
    }, 500);
  }
};

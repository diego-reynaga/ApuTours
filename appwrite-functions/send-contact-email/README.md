# Appwrite Function: Enviar Email de Contacto

Esta función envía correos electrónicos cuando un cliente envía un mensaje desde el formulario de contacto.

## Configuración

### Variables de entorno necesarias:

```bash
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=tu_email@gmail.com
SMTP_PASS=tu_contraseña_de_aplicación
EMAIL_FROM=noreply@aputours.com
EMAIL_TO=info@aputours.com
```

### Para Gmail:
1. Habilita verificación en 2 pasos en tu cuenta
2. Genera una contraseña de aplicación en https://myaccount.google.com/apppasswords
3. Usa esa contraseña en `SMTP_PASS`

## Instalación

### 1. Crear la función en Appwrite Console:

1. Ve a tu proyecto en Appwrite Console
2. Functions → Create Function
3. Nombre: `send-contact-email`
4. Runtime: `Node.js 18.0`
5. Execute Access: `Any` (para que clientes puedan ejecutarla)

### 2. Deploy del código:

```bash
# Desde la carpeta del proyecto
cd appwrite-functions/send-contact-email
appwrite deploy function --functionId send-contact-email
```

O manualmente:
1. Copia el contenido de `index.js`
2. Pega en el editor de la función en Appwrite Console
3. Guarda y despliega

### 3. Configurar variables de entorno:

En Appwrite Console → Functions → send-contact-email → Settings → Variables:

```
SMTP_HOST: smtp.gmail.com
SMTP_PORT: 587
SMTP_SECURE: false
SMTP_USER: tu_email@gmail.com
SMTP_PASS: tu_contraseña_aplicación
EMAIL_FROM: noreply@aputours.com
EMAIL_TO: info@aputours.com
```

### 4. Actualizar ID en environment.ts:

```typescript
appwriteFunctions: {
  sendContactEmailFunctionId: 'send-contact-email' // o el ID generado
}
```

## Uso desde la aplicación

El servicio `ContactoService` ejecuta automáticamente esta función cuando se envía un mensaje:

```typescript
await this.functions.createExecution(
  functionId,
  JSON.stringify({
    mensajeId: '...',
    nombre: 'Juan Pérez',
    email: 'juan@example.com',
    telefono: '+51999999999',
    asunto: 'Consulta sobre tours',
    mensaje: 'Quiero información sobre...'
  }),
  false
);
```

## Testing

Prueba la función desde Appwrite Console:
1. Functions → send-contact-email → Execute
2. Payload de prueba:
```json
{
  "nombre": "Test User",
  "email": "test@example.com",
  "telefono": "+51999999999",
  "asunto": "Test",
  "mensaje": "Mensaje de prueba"
}
```

## Logs

Revisa los logs de ejecución en:
Functions → send-contact-email → Executions

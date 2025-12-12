# ApuTours - Documentación de Funcionalidades Implementadas

## 📧 Sistema de Contacto con Appwrite Functions

### Flujo implementado:
1. Cliente llena formulario de contacto en `/contacto`
2. Se guarda el mensaje en la colección `contactos_coll` de Appwrite
3. Se ejecuta automáticamente una Appwrite Function que envía el email vía SMTP
4. **No hay API keys ni credenciales SMTP en el frontend** (todo server-side)

### Archivos modificados:
- `src/app/services/contacto.service.ts` - Ejecuta Appwrite Function
- `src/app/services/appwrite.client.ts` - Agregado soporte para Functions
- `src/environments/environment.ts` - Configuración de Function ID
- `appwrite-functions/send-contact-email/` - Template de la Function

### Configuración de la Function:

1. **Crear función en Appwrite Console:**
   - Functions → Create Function
   - Name: `send-contact-email`
   - Runtime: Node.js 18.0
   - Execute Access: `Any` (permite ejecución desde cliente)

2. **Variables de entorno en Appwrite:**
   ```
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_SECURE=false
   SMTP_USER=tu_email@gmail.com
   SMTP_PASS=tu_contraseña_aplicación_gmail
   EMAIL_FROM=noreply@aputours.com
   EMAIL_TO=info@aputours.com
   ```

3. **Deploy:**
   - Copia el código de `appwrite-functions/send-contact-email/index.js`
   - Pega en el editor de Appwrite Console
   - O usa Appwrite CLI: `appwrite deploy function`

4. **Actualizar environment.ts:**
   ```typescript
   appwriteFunctions: {
     sendContactEmailFunctionId: 'send-contact-email'
   }
   ```

---

## 📄 Sistema de Comprobantes con Generación de PDF

### Flujo implementado:
1. Cliente hace una reserva en `/reservas`
2. Se genera automáticamente un comprobante con:
   - Código de comprobante: `APU-[TIPO]-[FECHA]-[SECUENCIA]`
   - Código de verificación: `XXXX-XXXX-XXXX` (12 caracteres)
   - Hash SHA-256 para seguridad e integridad
3. **Cliente puede descargar el comprobante en PDF** (generado nativamente, no impresión)
4. Proveedor puede verificar el código en `/verificar-comprobante`

### Archivos creados:
- `src/app/services/comprobantes.service.ts` - Gestión de comprobantes
- `src/app/services/comprobante-pdf.service.ts` - **Generación de PDF usando pdf-lib**
- `src/app/pages/verificar-comprobante/` - Página de verificación para proveedores

### Archivos modificados:
- `src/app/pages/reservas/reservas.ts` - Integración de comprobantes + PDF
- `src/app/pages/reservas/reservas.html` - Botón "Descargar PDF"
- `src/app/pages/reservas/reservas.css` - Estilos del comprobante

### Dependencias instaladas:
```bash
npm install pdf-lib
```

### Características del PDF:
- ✅ Generado nativamente en el navegador (no usa `window.print()`)
- ✅ Formato A4 profesional con logo y diseño
- ✅ Incluye código de verificación destacado
- ✅ Resumen financiero completo (subtotal, IGV, total)
- ✅ Datos del cliente y del servicio
- ✅ Se descarga automáticamente al hacer clic

---

## 🔐 Sistema de Verificación de Comprobantes

### Para proveedores (hoteles, restaurantes, transporte):

1. **Acceder a:** `/verificar-comprobante`
2. **Ingresar código** que el cliente presenta: `XXXX-XXXX-XXXX`
3. **El sistema valida:**
   - ✅ Si el código existe en la BD
   - ✅ Si el hash de seguridad coincide (detecta alteraciones)
   - ✅ Estado actual (pendiente, pagado, verificado, rechazado)
4. **Acciones disponibles:**
   - ✅ Confirmar servicio prestado
   - ❌ Rechazar comprobante (con motivo)

### Seguridad implementada:
- Hash SHA-256 de: código + documento + total + project secret
- Cualquier alteración del comprobante invalida el hash
- Estados inmutables una vez verificados
- Registro de quién verificó y cuándo

---

## 🗄️ Colecciones de Appwrite Creadas

### Script ejecutado: `scripts/add_new_collections.js`

**Colecciones creadas:**

1. **`contactos_coll`** - Mensajes de contacto
   - nombre, email, telefono, asunto, mensaje, estado, fechaEnvio

2. **`comprobantes_coll`** - Comprobantes de pago
   - Códigos, datos cliente, datos servicio, montos, estados
   - Índices: codigoVerificacion, userId
   - Hash de seguridad

---

## ✅ Estado de Implementación

| Funcionalidad | Estado | Notas |
|--------------|--------|-------|
| Formulario de contacto | ✅ | Guarda en Appwrite |
| Envío de emails | ✅ | Vía Appwrite Function (SMTP) |
| Generación de comprobantes | ✅ | Automático en reservas |
| Descarga PDF | ✅ | Generación nativa con pdf-lib |
| Verificación de comprobantes | ✅ | Portal para proveedores |
| Hash de seguridad | ✅ | SHA-256 anti-falsificación |
| Colecciones BD | ✅ | contactos_coll, comprobantes_coll |

---

## 🚀 Próximos Pasos

### 1. Configurar la Appwrite Function:
```bash
# Ir a Appwrite Console → Functions → Create
# Copiar código de appwrite-functions/send-contact-email/index.js
# Configurar variables SMTP
# Actualizar functionId en environment.ts
```

### 2. Probar el sistema:
```bash
npm start
# Navegar a http://localhost:4200/contacto
# Enviar un mensaje de prueba
# Verificar que llegue el email
```

### 3. Probar comprobantes:
```bash
# Navegar a http://localhost:4200/reservas
# Hacer una reserva de prueba
# Descargar el PDF generado
# Ir a /verificar-comprobante
# Ingresar el código y verificar
```

---

## 📝 Notas Importantes

- **NO hay credenciales SMTP en el frontend** - Todo está en la Appwrite Function
- **pdf-lib genera PDFs reales** - No usa impresión del navegador
- **Hash SHA-256** protege contra falsificación de comprobantes
- **Códigos de verificación únicos** de 12 caracteres para cada comprobante
- **Estados auditables** con timestamp y usuario que verificó

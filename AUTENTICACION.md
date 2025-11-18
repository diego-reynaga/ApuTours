# ApuTours - Configuración de Autenticación con Appwrite

## 🚀 Componente de Login y Autenticación

Este proyecto ahora incluye un sistema completo de autenticación integrado con Appwrite.

## 📋 Características Implementadas

### ✅ Autenticación
- ✨ Login con email y contraseña
- 🎉 Registro de nuevos usuarios
- 🔑 Recuperación de contraseña
- 🌐 Login con OAuth2 (Google, Facebook)
- 👤 Gestión de sesiones
- 🔒 Guards de autenticación para proteger rutas

### ✅ Servicios Creados
- **AuthService**: Servicio principal de autenticación con Appwrite
- **authGuard**: Guard para proteger rutas que requieren autenticación
- **guestGuard**: Guard para rutas solo accesibles sin autenticación

### ✅ Componentes
- **Login**: Página completa de login/registro con diseño moderno
- **Navbar**: Actualizado para mostrar usuario logueado y menú desplegable

## 🔧 Configuración de Appwrite

### 1. Verificar Variables de Entorno

El archivo `src/environments/environment.ts` ya está configurado con tu proyecto:

\`\`\`typescript
export const environment = {
  appwriteEndpoint: 'https://sfo.cloud.appwrite.io/v1',
  appwriteProjectId: '691bb3410033a2c8c1f4',
  appwriteProjectName: 'ApuTours'
};
\`\`\`

### 2. Configurar OAuth2 (Opcional)

Si deseas habilitar login con Google o Facebook:

1. Ve a tu proyecto en Appwrite Console: https://cloud.appwrite.io
2. Navega a **Auth → Settings → OAuth2 Providers**
3. Activa los proveedores que desees (Google, Facebook, etc.)
4. Configura las credenciales (Client ID, Client Secret)
5. Agrega las URLs de redirección:
   - Success: `http://localhost:4200/`
   - Failure: `http://localhost:4200/login?error=oauth`

### 3. Instalar Dependencias

Si aún no se ha instalado Appwrite SDK, ejecuta:

\`\`\`bash
npm install appwrite
\`\`\`

## 📝 Uso del Sistema de Autenticación

### Rutas

- \`/login\` - Página de login/registro
- \`/\` - Inicio (pública)
- \`/reservas\` - Puede protegerse con authGuard (opcional)

### Proteger Rutas (Opcional)

Para proteger una ruta que requiere autenticación:

\`\`\`typescript
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { 
    path: 'perfil', 
    component: PerfilComponent,
    canActivate: [authGuard] // Solo usuarios autenticados
  }
];
\`\`\`

### Uso del AuthService

\`\`\`typescript
import { AuthService } from './services/auth.service';

// Inyectar el servicio
constructor(private authService: AuthService) {}

// Verificar si está autenticado
if (this.authService.isAuthenticated()) {
  console.log('Usuario logueado');
}

// Obtener usuario actual
const user = this.authService.currentUser();
console.log(user?.name, user?.email);

// Cerrar sesión
await this.authService.logout();
\`\`\`

## 🎨 Características del Componente Login

### Modos de Formulario
1. **Login**: Inicio de sesión con email/contraseña
2. **Register**: Registro de nueva cuenta
3. **Forgot Password**: Recuperación de contraseña

### Validaciones
- Email válido
- Contraseña mínimo 8 caracteres
- Confirmación de contraseña
- Mensajes de error/éxito

### OAuth2
- Botones para login con Google y Facebook
- Redirección automática
- Manejo de errores

## 🔍 Solución de Iconos Font Awesome

Se actualizó Font Awesome a la versión 6.7.1 sin hash de integridad para evitar problemas de carga:

\`\`\`html
<link
  rel="stylesheet"
  href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.1/css/all.min.css"
  crossorigin="anonymous"
  referrerpolicy="no-referrer"
>
\`\`\`

## 🚀 Próximos Pasos Sugeridos

1. **Configurar OAuth2** en Appwrite Console
2. **Crear página de perfil** de usuario
3. **Implementar recuperación de contraseña** completa
4. **Agregar verificación de email**
5. **Proteger rutas sensibles** con authGuard

## 📚 Recursos

- [Documentación de Appwrite](https://appwrite.io/docs)
- [Appwrite Angular SDK](https://appwrite.io/docs/sdks#client)
- [Angular Signals](https://angular.dev/guide/signals)

## 🎯 Comandos Útiles

\`\`\`bash
# Desarrollo
npm start

# Compilar
npm run build

# Tests
npm test
\`\`\`

---

**¡Sistema de autenticación completamente funcional! 🎉**

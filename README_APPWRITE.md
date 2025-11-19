# ApuTours - Integración con Appwrite

## 🚀 Resumen de cambios

El proyecto ApuTours ahora está completamente integrado con Appwrite como backend. Todos los módulos principales usan Appwrite Databases para almacenamiento y gestión de datos.

## 📦 Servicios creados

### 1. **DestinosService** (`src/app/services/destinos.service.ts`)
- CRUD completo de destinos turísticos
- Búsqueda por categoría
- Señales reactivas de Angular 18

### 2. **ReservasService** (`src/app/services/reservas.service.ts`)
- Crear reservas vinculadas a usuarios autenticados
- Generación automática de códigos de confirmación
- Gestión de estados: pendiente, confirmada, cancelada

### 3. **HospedajeService** (`src/app/services/hospedaje.service.ts`)
- CRUD de alojamientos (hoteles, hostales, lodges, casas rurales)
- Filtros por categoría
- Rating y reviews

### 4. **GastronomiaService** (`src/app/services/gastronomia.service.ts`)
- Gestión de establecimientos gastronómicos
- Filtros por categoría y nivel de precio
- Especialidades y horarios

### 5. **TransporteService** (`src/app/services/transporte.service.ts`)
- Opciones de transporte (bus, taxi, privado, compartido)
- Filtros por tipo y disponibilidad
- Precios y características

### 6. **AuthService** (existente, mejorado)
- Autenticación con email/password
- OAuth2 (Google, Facebook)
- Gestión de sesiones con señales reactivas

## 🗄️ Estructura de base de datos

El script `scripts/create_appwrite_db.js` crea automáticamente:

### Database: **ApuTours DB**

### Colecciones:

#### 1. **users**
- `name` (string): Nombre completo
- `email` (email): Correo electrónico

#### 2. **destinos**
- `nombre` (string): Nombre del destino
- `descripcion` (string): Descripción detallada
- `imagen` (string): URL de la imagen
- `categorias` (array): Categorías (natural, arqueológico, aventura, cultural)
- `duracion` (string): Duración estimada
- `distancia` (string): Distancia desde el centro
- `dificultad` (string): Nivel de dificultad
- `precio` (float): Precio base
- `rating` (float): Calificación promedio
- `reviews` (integer): Número de reseñas
- `destacado` (boolean): Si es destacado

#### 3. **reservas**
- `userId` (string): ID del usuario
- `tipo` (string): package, destination, accommodation, transport
- `destinoId` (string): ID del destino (opcional)
- `destinoNombre` (string): Nombre del destino
- `fechaInicio` (string): Fecha de inicio
- `fechaFin` (string): Fecha de fin
- `adultos` (integer): Número de adultos
- `ninos` (integer): Número de niños
- `precioTotal` (float): Precio total
- `estado` (string): pendiente, confirmada, cancelada
- `nombreCompleto` (string): Nombre completo
- `email` (email): Email
- `telefono` (string): Teléfono
- `documento` (string): Número de documento
- `solicitudesEspeciales` (string): Solicitudes especiales
- `codigoConfirmacion` (string): Código de confirmación

#### 4. **hospedajes**
- `nombre` (string): Nombre del alojamiento
- `categoria` (string): hoteles, hostales, casas-rurales, lodges
- `descripcion` (string): Descripción
- `amenidades` (array): Lista de amenidades
- `precioPorNoche` (float): Precio por noche
- `rating` (float): Calificación
- `reviews` (integer): Número de reseñas
- `ubicacion` (string): Ubicación
- `imagen` (string): URL de imagen
- `destacado` (boolean): Si es destacado

#### 5. **gastronomia**
- `nombre` (string): Nombre del establecimiento
- `categoria` (string): restaurantes, bares, cafeterias, street-food
- `nivelPrecio` (string): económico, moderado, premium
- `descripcion` (string): Descripción
- `especialidades` (string): Platos especiales
- `horario` (string): Horario de atención
- `ubicacion` (string): Ubicación
- `rating` (float): Calificación
- `imagen` (string): URL de imagen
- `caracteristicas` (array): Características especiales

#### 6. **transportes**
- `tipo` (string): bus, taxi, privado, compartido
- `nombre` (string): Nombre del servicio
- `descripcion` (string): Descripción
- `origen` (string): Punto de origen
- `destino` (string): Punto de destino
- `precio` (float): Precio
- `duracion` (string): Duración del trayecto
- `horarios` (array): Horarios disponibles
- `capacidad` (integer): Capacidad de pasajeros
- `caracteristicas` (array): Características
- `imagen` (string): URL de imagen
- `disponible` (boolean): Disponibilidad

## ⚙️ Configuración paso a paso

### 1. Instalar dependencias

```powershell
cd C:\Users\User\Desktop\get\ApuTours
npm install
```

### 2. Configurar Appwrite

Ve a https://cloud.appwrite.io y:
1. Crea una cuenta o inicia sesión
2. Crea un nuevo proyecto (o usa el existente: 691bb3410033a2c8c1f4)
3. Ve a "Settings" → "API Keys"
4. Crea una API Key con permisos de `databases.write`

### 3. Ejecutar script de creación de DB

```powershell
# Exportar variables de entorno
$env:APPWRITE_ENDPOINT = 'https://sfo.cloud.appwrite.io/v1'
$env:APPWRITE_PROJECT = '691bb3410033a2c8c1f4'
$env:APPWRITE_API_KEY = 'TU_API_KEY_AQUI'

# Ejecutar script
node scripts/create_appwrite_db.js
```

El script mostrará algo como:
```
✅ Database creada: 67abc123def456
   users: '67abc124xyz789'
   destinos: '67abc125abc123'
   ...
```

### 4. Actualizar environment.ts

Copia los IDs generados a `src/environments/environment.ts`:

```typescript
export const environment = {
  appwriteEndpoint: 'https://sfo.cloud.appwrite.io/v1',
  appwriteProjectId: '691bb3410033a2c8c1f4',
  appwriteProjectName: 'ApuTours',
  appwriteDatabaseId: '67abc123def456', // ← Tu ID
  appwriteCollections: {
    users: '67abc124xyz789', // ← Tu ID
    destinos: '67abc125abc123', // ← Tu ID
    reservas: '...',
    hospedajes: '...',
    gastronomia: '...',
    transportes: '...'
  }
};
```

### 5. Compilar y ejecutar

```powershell
npm run build
npm run dev
```

## 🧪 Probar la integración

### 1. Autenticación
- Ve a `/login`
- Registra un nuevo usuario o inicia sesión
- El navbar mostrará tu nombre y menú de usuario

### 2. Crear una reserva
- Ve a `/reservas`
- Llena el formulario (debes estar autenticado)
- La reserva se guardará en Appwrite con código de confirmación

### 3. Ver datos (una vez poblada la DB)
- `/destinos`: Ver destinos turísticos
- `/hospedaje`: Ver alojamientos
- `/gastronomia`: Ver establecimientos
- `/transporte`: Ver opciones de transporte

## 📝 Agregar datos de prueba

Puedes agregar datos de dos formas:

### Opción A: Consola de Appwrite
1. Ve a https://cloud.appwrite.io/console
2. Selecciona tu proyecto
3. Ve a "Databases" → Tu database → Selecciona colección
4. Click en "Add Document"
5. Llena los campos manualmente

### Opción B: Script personalizado
Crea un script similar a `create_appwrite_db.js` que use `databases.createDocument()` para poblar datos.

## 🔒 Configurar permisos (Producción)

Por defecto, el script crea colecciones con permisos abiertos (`['*']`).

Para producción, configura en la consola de Appwrite:

### Destinos, Hospedajes, Gastronomía, Transportes
- **Read**: `any` (lectura pública)
- **Write**: Solo usuarios con rol `admin`

### Reservas
- **Read**: `user:{userId}` (cada usuario ve solo sus reservas)
- **Write**: `user:{userId}` (cada usuario crea/modifica solo sus reservas)

### Users
- **Read/Write**: `user:{userId}` (privacidad total)

## 🎯 Próximos pasos

1. **Poblar base de datos**: Agrega destinos, hospedajes, etc.
2. **Configurar OAuth**: Activa Google/Facebook en Appwrite Console
3. **Subir imágenes**: Configura Appwrite Storage para imágenes
4. **Personalizar permisos**: Ajusta según necesidades de seguridad
5. **Deploy**: Considera Vercel/Netlify para frontend y Appwrite Cloud para backend

## 🐛 Troubleshooting

**Error: "Collection not found"**
- Verifica que copiaste los IDs correctamente en `environment.ts`

**Reservas no se crean**
- Verifica que estés autenticado (revisa consola del navegador)
- Revisa permisos de la colección `reservas` en Appwrite

**Datos no aparecen**
- Asegúrate de haber poblado las colecciones con datos
- Revisa la consola del navegador (F12) para ver errores

**CORS errors**
- Ve a Appwrite Console → Settings → Platforms
- Agrega tu dominio (ej: `http://localhost:4200`)

## 📚 Documentación adicional

- **APPWRITE_SETUP.md**: Guía detallada de configuración
- **AUTENTICACION.md**: Documentación del sistema de autenticación
- Appwrite Docs: https://appwrite.io/docs
- Angular Docs: https://angular.dev

## 🤝 Contribuir

Para contribuir al proyecto:
1. Crea una rama feature
2. Implementa cambios
3. Ejecuta tests (si existen)
4. Envía pull request

---

**Versión**: 1.0.0  
**Última actualización**: Noviembre 2025  
**Stack**: Angular 18 + Appwrite + TypeScript

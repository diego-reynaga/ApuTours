# Configuración de Appwrite para ApuTours

## Requisitos
- Tener una instancia de Appwrite (local o cloud: https://cloud.appwrite.io).
- Obtener `PROJECT ID` y una `API KEY` con permisos para crear bases de datos (API Key desde la consola Appwrite).

## Variables de entorno necesarias

Para el script de creación de base de datos:
- `APPWRITE_ENDPOINT` (ej: `https://cloud.appwrite.io/v1`)
- `APPWRITE_PROJECT` (el ID del proyecto)
- `APPWRITE_API_KEY` (clave de administrador para crear recursos desde script)

## Crear la base de datos y colecciones

### 1. Instalar dependencias

```powershell
cd ApuTours
npm install
```

### 2. Ejecutar el script de creación

```powershell
# Exportar variables de entorno (PowerShell)
$env:APPWRITE_ENDPOINT = 'https://sfo.cloud.appwrite.io/v1'
$env:APPWRITE_PROJECT = '691bb3410033a2c8c1f4'
$env:APPWRITE_API_KEY = 'TU_API_KEY_AQUI'

# Ejecutar el script
node scripts/create_appwrite_db.js
```

### 3. Copiar los IDs generados

El script generará una database y 6 colecciones:
- `users`: Usuarios del sistema
- `destinos`: Destinos turísticos
- `reservas`: Reservas de clientes
- `hospedajes`: Alojamientos disponibles
- `gastronomia`: Establecimientos gastronómicos
- `transportes`: Opciones de transporte

**Importante**: Después de ejecutar el script, copia todos los IDs que se muestran en la consola y pégalos en `src/environments/environment.ts`:

```typescript
export const environment = {
  appwriteEndpoint: 'https://sfo.cloud.appwrite.io/v1',
  appwriteProjectId: '691bb3410033a2c8c1f4',
  appwriteProjectName: 'ApuTours',
  appwriteDatabaseId: 'COPIA_EL_ID_DE_DATABASE',
  appwriteCollections: {
    users: 'COPIA_EL_ID_DE_USERS',
    destinos: 'COPIA_EL_ID_DE_DESTINOS',
    reservas: 'COPIA_EL_ID_DE_RESERVAS',
    hospedajes: 'COPIA_EL_ID_DE_HOSPEDAJES',
    gastronomia: 'COPIA_EL_ID_DE_GASTRONOMIA',
    transportes: 'COPIA_EL_ID_DE_TRANSPORTES'
  }
};
```

## Alternativa: Crear manualmente desde la consola

Si prefieres usar la consola web de Appwrite:

1. Ve a https://cloud.appwrite.io/console
2. Selecciona tu proyecto
3. Ve a "Databases" → "Create Database"
4. Crea las colecciones según el schema del script (ver `scripts/create_appwrite_db.js`)

## Integración en la app Angular

### Servicios creados

El proyecto incluye servicios para cada colección:
- `DestinosService`: CRUD de destinos turísticos
- `ReservasService`: Gestión de reservas con autenticación
- `HospedajeService`: CRUD de alojamientos
- `GastronomiaService`: Gestión de establecimientos gastronómicos
- `TransporteService`: Opciones de transporte
- `AuthService`: Autenticación con Appwrite (ya configurado)

### Cliente centralizado

- El cliente de Appwrite está en `src/app/services/appwrite.client.ts`
- Usa la configuración de `environment.ts`
- Exporta `AppwriteClient` y `AppwriteDatabases` para uso en servicios

### Uso en componentes

Los componentes ya están configurados para usar los servicios:
```typescript
constructor(private destinosService: DestinosService) {}

ngOnInit(): void {
  // Los datos se cargan automáticamente
  this.destinos = this.destinosService.destinos();
}
```

## Permisos y seguridad

El script crea las colecciones con permisos `['*']` para lectura y escritura (desarrollo).

**Para producción**, configura permisos específicos desde la consola:
- **Destinos, Hospedajes, Gastronomía, Transportes**: Lectura pública, escritura solo admin
- **Reservas**: Lectura/escritura solo para el usuario propietario
- **Users**: Lectura/escritura solo para el usuario propietario

## Verificación

Después de configurar:
1. Verifica en la consola de Appwrite que las colecciones existan
2. Ejecuta `npm run build` para verificar que no hay errores TypeScript
3. Ejecuta `npm run dev` y verifica que la app cargue correctamente

## Datos de prueba

Para agregar datos de prueba, puedes:
1. Usar la consola web de Appwrite para crear documentos manualmente
2. Crear un script adicional para poblar las colecciones
3. Usar las interfaces de la aplicación (una vez autenticado)

## Troubleshooting

**Error: "Invalid API key"**
- Verifica que la API key tenga permisos de `databases.write`

**Error: "Collection not found"**
- Verifica que copiaste correctamente los IDs a `environment.ts`

**Error: "Project not found"**
- Verifica que el `appwriteProjectId` coincida con tu proyecto en Appwrite

**Los datos no se cargan**
- Abre la consola del navegador (F12) y revisa errores
- Verifica que las colecciones tengan permisos de lectura configurados

## Recursos

- Documentación de Appwrite: https://appwrite.io/docs
- Angular + Appwrite: https://appwrite.io/docs/sdks#client-web
- Console de Appwrite: https://cloud.appwrite.io


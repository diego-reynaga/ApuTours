// scripts/create_appwrite_db.js
const sdk = require('node-appwrite');

// Obtener variables de entorno
const endpoint = process.env.APPWRITE_ENDPOINT;
const project = process.env.APPWRITE_PROJECT;
const apiKey = process.env.APPWRITE_API_KEY;

if (!endpoint || !project || !apiKey) {
  console.error('❌ Error: Variables de entorno faltantes.');
  console.error('Asegúrate de exportar:');
  console.error('  $env:APPWRITE_ENDPOINT = "https://sfo.cloud.appwrite.io/v1"');
  console.error('  $env:APPWRITE_PROJECT = "691bb3410033a2c8c1f4"');
  console.error('  $env:APPWRITE_API_KEY = "standard_f552c961d4e2067472ad048b7ecece3b9c2c657b5c677cf4e46525ff515d8cd59d1c1226ed5b5a9e19f0aa3e978b75640fbfa6eecc46b35aa577d40b84b858a6c995094c7792fa225db12a9f4fc235231f2f2b976d4fc122c68f25709fe56b3f43cb74b5483df30ccfc7b5554bec88024c94c2461f6e68403f00c6966dad0070"');
  process.exit(1);
}

// Inicializar cliente con node-appwrite
const client = new sdk.Client();
client
  .setEndpoint(endpoint)
  .setProject(project)
  .setKey(apiKey);

const databases = new sdk.Databases(client);

async function createDatabase() {
  try {
    console.log('🚀 Creando base de datos "ApuTours DB"...');
    
    // Usar ID válido para la database
    const databaseId = 'apuTours_db';
    const database = await databases.create(databaseId, 'ApuTours DB');
    console.log(`✅ Database creada: ${databaseId}`);
    
    // Crear colecciones con IDs válidos
    const collections = [
      { name: 'users', id: 'users_coll' },
      { name: 'destinos', id: 'destinos_coll' },
      { name: 'reservas', id: 'reservas_coll' },
      { name: 'hospedajes', id: 'hospedajes_coll' },
      { name: 'gastronomia', id: 'gastronomia_coll' },
      { name: 'transportes', id: 'transportes_coll' }
    ];

    const collectionIds = {};

    for (const collection of collections) {
      console.log(`📝 Creando colección: ${collection.name}`);
      
      const coll = await databases.createCollection(
        databaseId,
        collection.id,  // Usar ID válido
        collection.name,
        undefined, // permissions (por defecto: any)
        false // documentSecurity
      );
      
      const collectionId = coll.$id;
      collectionIds[collection.name] = collectionId;
      
      // Definir atributos por colección
      let attributes = [];
      if (collection.name === 'users') {
        attributes = [
          { key: 'name', type: 'string', size: 255, required: true },
          { key: 'email', type: 'email', required: true }
        ];
      } else if (collection.name === 'destinos') {
        attributes = [
          { key: 'nombre', type: 'string', size: 255, required: true },
          { key: 'descripcion', type: 'string', size: 1000, required: true },
          { key: 'imagen', type: 'string', size: 500, required: false },
          { key: 'categorias', type: 'string', size: 500, required: false }, // Cambiar array a string para compatibilidad
          { key: 'duracion', type: 'string', size: 100, required: false },
          { key: 'distancia', type: 'string', size: 100, required: false },
          { key: 'dificultad', type: 'string', size: 50, required: false },
          { key: 'precio', type: 'float', required: false },
          { key: 'rating', type: 'float', required: false },
          { key: 'reviews', type: 'integer', required: false },
          { key: 'destacado', type: 'boolean', required: false }
        ];
      } else if (collection.name === 'reservas') {
        attributes = [
          { key: 'userId', type: 'string', size: 50, required: true },
          { key: 'tipo', type: 'string', size: 50, required: true },
          { key: 'destinoId', type: 'string', size: 50, required: false },
          { key: 'destinoNombre', type: 'string', size: 255, required: true },
          { key: 'fechaInicio', type: 'string', size: 20, required: true },
          { key: 'fechaFin', type: 'string', size: 20, required: true },
          { key: 'adultos', type: 'integer', required: true },
          { key: 'ninos', type: 'integer', required: false },
          { key: 'precioTotal', type: 'float', required: true },
          { key: 'estado', type: 'string', size: 20, required: true },
          { key: 'nombreCompleto', type: 'string', size: 255, required: true },
          { key: 'email', type: 'email', required: true },
          { key: 'telefono', type: 'string', size: 20, required: true },
          { key: 'documento', type: 'string', size: 20, required: true },
          { key: 'solicitudesEspeciales', type: 'string', size: 500, required: false },
          { key: 'codigoConfirmacion', type: 'string', size: 10, required: true }
        ];
      } else if (collection.name === 'hospedajes') {
        attributes = [
          { key: 'nombre', type: 'string', size: 255, required: true },
          { key: 'categoria', type: 'string', size: 50, required: true },
          { key: 'descripcion', type: 'string', size: 1000, required: true },
          { key: 'amenidades', type: 'string', size: 500, required: false }, // Cambiar array a string
          { key: 'precioPorNoche', type: 'float', required: true },
          { key: 'rating', type: 'float', required: false },
          { key: 'reviews', type: 'integer', required: false },
          { key: 'ubicacion', type: 'string', size: 255, required: true },
          { key: 'imagen', type: 'string', size: 500, required: false },
          { key: 'destacado', type: 'boolean', required: false }
        ];
      } else if (collection.name === 'gastronomia') {
        attributes = [
          { key: 'nombre', type: 'string', size: 255, required: true },
          { key: 'categoria', type: 'string', size: 50, required: true },
          { key: 'nivelPrecio', type: 'string', size: 20, required: true },
          { key: 'descripcion', type: 'string', size: 1000, required: true },
          { key: 'especialidades', type: 'string', size: 500, required: false },
          { key: 'horario', type: 'string', size: 100, required: false },
          { key: 'ubicacion', type: 'string', size: 255, required: true },
          { key: 'rating', type: 'float', required: false },
          { key: 'imagen', type: 'string', size: 500, required: false },
          { key: 'caracteristicas', type: 'string', size: 500, required: false } // Cambiar array a string
        ];
      } else if (collection.name === 'transportes') {
        attributes = [
          { key: 'tipo', type: 'string', size: 50, required: true },
          { key: 'nombre', type: 'string', size: 255, required: true },
          { key: 'descripcion', type: 'string', size: 1000, required: true },
          { key: 'origen', type: 'string', size: 255, required: true },
          { key: 'destino', type: 'string', size: 255, required: true },
          { key: 'precio', type: 'float', required: true },
          { key: 'duracion', type: 'string', size: 100, required: false },
          { key: 'horarios', type: 'string', size: 500, required: false }, // Cambiar array a string
          { key: 'capacidad', type: 'integer', required: false },
          { key: 'caracteristicas', type: 'string', size: 500, required: false }, // Cambiar array a string
          { key: 'imagen', type: 'string', size: 500, required: false },
          { key: 'disponible', type: 'boolean', required: false }
        ];
      }
      
      // Crear atributos
      for (const attr of attributes) {
        if (attr.type === 'string') {
          await databases.createStringAttribute(databaseId, collectionId, attr.key, attr.size, attr.required, attr.default || undefined);
        } else if (attr.type === 'email') {
          await databases.createEmailAttribute(databaseId, collectionId, attr.key, attr.required);
        } else if (attr.type === 'integer') {
          await databases.createIntegerAttribute(databaseId, collectionId, attr.key, attr.required, attr.min || undefined, attr.max || undefined, attr.default || undefined);
        } else if (attr.type === 'float') {
          await databases.createFloatAttribute(databaseId, collectionId, attr.key, attr.required, attr.min || undefined, attr.max || undefined, attr.default || undefined);
        } else if (attr.type === 'boolean') {
          await databases.createBooleanAttribute(databaseId, collectionId, attr.key, attr.required, attr.default || undefined);
        }
      }
      
      console.log(`✅ ${collection.name}: ${collectionId}`);
    }

    console.log('\n🎉 ¡Base de datos creada exitosamente!');
    console.log('📋 IDs generados:');
    console.log(`   Database: ${databaseId}`);
    Object.entries(collectionIds).forEach(([name, id]) => {
      console.log(`   ${name}: '${id}'`);
    });
    
    console.log('\n📝 Próximos pasos:');
    console.log('1. Copia estos IDs a src/environments/environment.ts');
    console.log('2. Pobla las colecciones con datos de prueba');
    console.log('3. Ejecuta npm run dev para probar');

  } catch (error) {
    console.error('❌ Error creando base de datos:', error.message);
    if (error.code) {
      console.error('Código de error:', error.code);
    }
  }
}

createDatabase();
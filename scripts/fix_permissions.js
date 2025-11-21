const sdk = require('node-appwrite');

// Obtener variables de entorno
const endpoint = process.env.APPWRITE_ENDPOINT;
const project = process.env.APPWRITE_PROJECT;
const apiKey = process.env.APPWRITE_API_KEY;

if (!endpoint || !project || !apiKey) {
  console.error('❌ Error: Variables de entorno faltantes.');
  console.error('Asegúrate de tener las variables configuradas en tu terminal (igual que para seed_db.js)');
  process.exit(1);
}

const client = new sdk.Client();
client
  .setEndpoint(endpoint)
  .setProject(project)
  .setKey(apiKey);

const databases = new sdk.Databases(client);
const databaseId = 'apuTours_db';

async function fixPermissions() {
  console.log('🔧 Corrigiendo permisos de colecciones...');

  // Colecciones que deben ser públicas para lectura
  const publicCollections = [
    'destinos_coll',
    'hospedajes_coll',
    'gastronomia_coll',
    'transportes_coll'
  ];

  for (const colId of publicCollections) {
    try {
      const col = await databases.getCollection(databaseId, colId);
      
      await databases.updateCollection(
        databaseId,
        colId,
        col.name,
        [
            sdk.Permission.read(sdk.Role.any()) // Permitir lectura a cualquiera (invitados y usuarios)
        ]
      );
      console.log(`✅ Permisos actualizados para: ${col.name} (Lectura pública habilitada)`);
    } catch (error) {
      console.error(`❌ Error actualizando ${colId}: ${error.message}`);
    }
  }

  // Colección de Reservas (Permitir crear a cualquiera)
  try {
      const colId = 'reservas_coll';
      const col = await databases.getCollection(databaseId, colId);
      await databases.updateCollection(
        databaseId,
        colId,
        col.name,
        [
            sdk.Permission.create(sdk.Role.any()), // Cualquiera puede crear
            sdk.Permission.read(sdk.Role.users()), // Solo usuarios registrados pueden leer (general)
            // Nota: Para seguridad real por documento, se necesita 'documentSecurity: true' y asignar permisos al crear el documento.
        ]
      );
      console.log(`✅ Permisos actualizados para: ${col.name} (Creación pública habilitada)`);
  } catch (error) {
      console.error(`❌ Error en reservas_coll: ${error.message}`);
  }

  console.log('\n✨ ¡Permisos corregidos! Ahora la página debería mostrar los datos.');
}

fixPermissions();

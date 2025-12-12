const sdk = require('node-appwrite');

// Obtener variables de entorno
const endpoint = process.env.APPWRITE_ENDPOINT || 'https://sfo.cloud.appwrite.io/v1';
const project = process.env.APPWRITE_PROJECT || '691bb3410033a2c8c1f4';
const apiKey = process.env.APPWRITE_API_KEY;

if (!apiKey) {
  console.error('❌ Error: APPWRITE_API_KEY no está configurada');
  console.log('\nEjecuta primero:');
  console.log('$env:APPWRITE_API_KEY = "tu_api_key"');
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
  console.log('🔧 Corrigiendo permisos de colecciones...\n');

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
      console.log(`✅ ${col.name} - Lectura pública habilitada`);
    } catch (error) {
      console.error(`❌ Error actualizando ${colId}: ${error.message}`);
    }
  }

  // Colección de Reservas (Permitir crear a usuarios autenticados)
  try {
      const colId = 'reservas_coll';
      const col = await databases.getCollection(databaseId, colId);
      await databases.updateCollection(
        databaseId,
        colId,
        col.name,
        [
            sdk.Permission.create(sdk.Role.users()), // Usuarios autenticados pueden crear
            sdk.Permission.read(sdk.Role.users()), // Usuarios registrados pueden leer
            sdk.Permission.update(sdk.Role.users()), // Usuarios pueden actualizar sus reservas
        ]
      );
      console.log(`✅ ${col.name} - Permisos de usuarios configurados`);
  } catch (error) {
      console.error(`❌ Error en reservas_coll: ${error.message}`);
  }

  // Colección de Comprobantes (CRÍTICO - debe permitir crear a usuarios)
  try {
      const colId = 'comprobantes_coll';
      const col = await databases.getCollection(databaseId, colId);
      await databases.updateCollection(
        databaseId,
        colId,
        col.name,
        [
            sdk.Permission.read(sdk.Role.any()), // Cualquiera puede leer para verificar
            sdk.Permission.create(sdk.Role.users()), // Usuarios autenticados pueden crear
            sdk.Permission.update(sdk.Role.users()), // Usuarios pueden actualizar
        ]
      );
      console.log(`✅ ${col.name} - Permisos actualizados (CRÍTICO)`);
  } catch (error) {
      console.error(`❌ Error en comprobantes_coll: ${error.message}`);
  }

  console.log('\n✨ ¡Permisos corregidos!');
  console.log('\n📋 Resumen:');
  console.log('   • Colecciones públicas: destinos, hospedajes, gastronomía, transportes');
  console.log('   • Reservas: Solo usuarios autenticados pueden crear/leer/actualizar');
  console.log('   • Comprobantes: Lectura pública, creación/actualización para usuarios');
  console.log('\n🎉 Ahora los usuarios podrán crear reservas y comprobantes!');
}

fixPermissions();

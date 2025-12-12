/**
 * Script para actualizar la colección reservas_coll
 * - Ajustar codigoConfirmacion a 10 caracteres
 * - Agregar precioUnitario
 * 
 * Ejecutar con:
 * $env:APPWRITE_API_KEY = "TU_API_KEY"
 * node scripts/update_reservas_collection.js
 */

const sdk = require('node-appwrite');

const config = {
  endpoint: 'https://sfo.cloud.appwrite.io/v1',
  projectId: '691bb3410033a2c8c1f4',
  databaseId: 'apuTours_db',
  collectionId: 'reservas_coll'
};

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function updateReservasCollection() {
  const apiKey = process.env.APPWRITE_API_KEY;
  
  if (!apiKey) {
    console.error('❌ Error: APPWRITE_API_KEY no está configurada');
    console.log('\nEjecuta primero:');
    console.log('$env:APPWRITE_API_KEY = "tu_api_key"');
    process.exit(1);
  }

  const client = new sdk.Client()
    .setEndpoint(config.endpoint)
    .setProject(config.projectId)
    .setKey(apiKey);

  const databases = new sdk.Databases(client);

  console.log('🚀 Actualizando colección reservas_coll...\n');

  try {
    // 1. Actualizar codigoConfirmacion
    console.log('📝 [1/2] Actualizando codigoConfirmacion...');
    try {
      // Intentar eliminar el atributo existente
      await databases.deleteAttribute(
        config.databaseId,
        config.collectionId,
        'codigoConfirmacion'
      );
      console.log('   ✅ Atributo antiguo eliminado');
      await sleep(3000); // Esperar a que Appwrite procese
    } catch (e) {
      console.log('   ℹ️  Atributo no existe o ya fue eliminado');
    }

    // Crear el nuevo atributo con tamaño correcto
    try {
      await databases.createStringAttribute(
        config.databaseId,
        config.collectionId,
        'codigoConfirmacion',
        10,  // APU + 7 caracteres
        false,
        undefined,
        false
      );
      console.log('   ✅ Atributo codigoConfirmacion creado (10 chars)');
      await sleep(2000);
    } catch (e) {
      if (e.message.includes('already exists')) {
        console.log('   ✅ Atributo codigoConfirmacion ya existe');
      } else {
        throw e;
      }
    }

    // 2. Agregar precioUnitario si no existe
    console.log('\n📝 [2/2] Verificando precioUnitario...');
    try {
      await databases.getAttribute(
        config.databaseId,
        config.collectionId,
        'precioUnitario'
      );
      console.log('   ✅ Atributo precioUnitario ya existe');
    } catch (e) {
      // No existe, crearlo
      await databases.createFloatAttribute(
        config.databaseId,
        config.collectionId,
        'precioUnitario',
        true  // required
      );
      console.log('   ✅ Atributo precioUnitario creado (float)');
    }
    
    console.log('\n✅ Colección actualizada exitosamente!');
    console.log('\n📋 Resumen de cambios:');
    console.log('   • codigoConfirmacion: 10 caracteres (APU + 7)');
    console.log('   • precioUnitario: float (precio base por día/persona)');
    console.log('\n🎉 Ahora puedes crear reservas correctamente!');
    
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    if (error.response) {
      console.error('Respuesta:', error.response);
    }
    process.exit(1);
  }
}

updateReservasCollection();

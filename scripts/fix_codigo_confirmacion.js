/**
 * Script para actualizar el atributo codigoConfirmacion en la colección reservas_coll
 * 
 * Ejecutar con:
 * $env:APPWRITE_API_KEY = "TU_API_KEY"
 * node scripts/fix_codigo_confirmacion.js
 */

const sdk = require('node-appwrite');

const config = {
  endpoint: 'https://sfo.cloud.appwrite.io/v1',
  projectId: '691bb3410033a2c8c1f4',
  databaseId: 'apuTours_db',
  collectionId: 'reservas_coll'
};

async function fixCodigoConfirmacion() {
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

  console.log('🔧 Actualizando atributo codigoConfirmacion...\n');

  try {
    // Primero intentamos eliminar el atributo existente
    try {
      console.log('📝 Eliminando atributo antiguo...');
      await databases.deleteAttribute(
        config.databaseId,
        config.collectionId,
        'codigoConfirmacion'
      );
      console.log('✅ Atributo eliminado');
      
      // Esperar un poco para que Appwrite procese el cambio
      await new Promise(resolve => setTimeout(resolve, 2000));
    } catch (e) {
      console.log('⚠️  Atributo no existe o ya fue eliminado');
    }

    // Crear el nuevo atributo con tamaño correcto (10 caracteres)
    console.log('📝 Creando atributo con nuevo tamaño (10 caracteres)...');
    await databases.createStringAttribute(
      config.databaseId,
      config.collectionId,
      'codigoConfirmacion',
      10,  // Tamaño correcto para "APU" + 7 caracteres
      false,
      undefined,
      false
    );
    
    console.log('✅ Atributo codigoConfirmacion creado correctamente');
    console.log('\n📋 Configuración:');
    console.log('   - Tamaño: 10 caracteres');
    console.log('   - Formato: APU + 7 dígitos alfanuméricos');
    console.log('   - Ejemplo: APUA2B3C4D');
    console.log('\n✅ Proceso completado exitosamente!');
    
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    console.error('\nDetalles completos:', error);
    process.exit(1);
  }
}

fixCodigoConfirmacion();

/**
 * Script para agregar el atributo precioUnitario a la colección reservas_coll
 * 
 * Ejecutar con:
 * $env:APPWRITE_API_KEY = "TU_API_KEY"
 * node scripts/add_precio_unitario.js
 */

const sdk = require('node-appwrite');

const config = {
  endpoint: 'https://sfo.cloud.appwrite.io/v1',
  projectId: '691bb3410033a2c8c1f4',
  databaseId: 'apuTours_db',
  collectionId: 'reservas_coll'
};

async function addPrecioUnitario() {
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

  console.log('🔧 Agregando atributo precioUnitario...\n');

  try {
    // Verificar si el atributo ya existe
    try {
      await databases.getAttribute(
        config.databaseId,
        config.collectionId,
        'precioUnitario'
      );
      console.log('✅ El atributo precioUnitario ya existe');
      return;
    } catch (e) {
      // El atributo no existe, continuamos para crearlo
    }

    // Crear el nuevo atributo tipo float
    console.log('📝 Creando atributo precioUnitario (tipo float)...');
    await databases.createFloatAttribute(
      config.databaseId,
      config.collectionId,
      'precioUnitario',
      true  // required
    );
    
    console.log('✅ Atributo precioUnitario creado correctamente');
    console.log('\n📋 Configuración:');
    console.log('   - Tipo: Float');
    console.log('   - Requerido: Sí');
    console.log('   - Descripción: Precio base por día/persona');
    console.log('\n✅ Proceso completado exitosamente!');
    
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    console.error('\nDetalles completos:', error);
    process.exit(1);
  }
}

addPrecioUnitario();

/**
 * Script de prueba para verificar un comprobante
 * 
 * Ejecutar con:
 * $env:APPWRITE_API_KEY = "TU_API_KEY"
 * node scripts/test_verificar.js VER5TD6HMT
 */

const sdk = require('node-appwrite');

const config = {
  endpoint: 'https://sfo.cloud.appwrite.io/v1',
  projectId: '691bb3410033a2c8c1f4',
  databaseId: 'apuTours_db',
  collectionId: 'comprobantes_coll'
};

async function testVerificar() {
  const apiKey = process.env.APPWRITE_API_KEY;
  const codigo = process.argv[2];
  
  if (!apiKey) {
    console.error('❌ Error: APPWRITE_API_KEY no está configurada');
    process.exit(1);
  }

  if (!codigo) {
    console.error('❌ Error: Debes proporcionar el código de verificación');
    console.log('\nUso: node scripts/test_verificar.js VER5TD6HMT');
    process.exit(1);
  }

  const client = new sdk.Client()
    .setEndpoint(config.endpoint)
    .setProject(config.projectId)
    .setKey(apiKey);

  const databases = new sdk.Databases(client);

  console.log('🔍 Buscando comprobante...');
  console.log('Código a buscar:', codigo);
  console.log('');

  try {
    // Buscar sin normalizar
    const response1 = await databases.listDocuments(
      config.databaseId,
      config.collectionId,
      [sdk.Query.equal('codigoVerificacion', codigo)]
    );

    console.log('📋 Búsqueda directa:', response1.total, 'resultados');
    
    if (response1.total > 0) {
      const doc = response1.documents[0];
      console.log('\n✅ Comprobante encontrado:');
      console.log('  - Código Comprobante:', doc.codigoComprobante);
      console.log('  - Código Verificación:', doc.codigoVerificacion);
      console.log('  - Cliente:', doc.clienteNombre);
      console.log('  - Total:', 'S/', doc.total);
      console.log('  - Estado:', doc.estado);
    } else {
      console.log('\n❌ No se encontró el comprobante con ese código');
      
      // Listar todos los códigos de verificación
      console.log('\n📝 Listando todos los comprobantes:');
      const all = await databases.listDocuments(
        config.databaseId,
        config.collectionId
      );
      
      all.documents.forEach((doc, i) => {
        console.log(`  ${i+1}. Código: ${doc.codigoVerificacion} - Cliente: ${doc.clienteNombre}`);
      });
    }
    
  } catch (error) {
    console.error('\n❌ Error:', error.message);
  }
}

testVerificar();

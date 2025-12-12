const sdk = require('node-appwrite');

const client = new sdk.Client()
  .setEndpoint('https://sfo.cloud.appwrite.io/v1')
  .setProject('691bb3410033a2c8c1f4')
  .setKey(process.env.APPWRITE_API_KEY);

const db = new sdk.Databases(client);

async function checkPermissions() {
  if (!process.env.APPWRITE_API_KEY) {
    console.error('❌ APPWRITE_API_KEY no configurada');
    return;
  }
  
  try {
    const collection = await db.getCollection('apuTours_db', 'comprobantes_coll');
    console.log('📋 Colección:', collection.name);
    console.log('🔐 Permisos:', JSON.stringify(collection.$permissions, null, 2));
    console.log('📊 Document Security:', collection.documentSecurity);
  } catch (e) {
    console.error('Error:', e.message);
  }
}

checkPermissions();

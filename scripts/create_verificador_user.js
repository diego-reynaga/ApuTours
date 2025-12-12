/**
 * Script para crear el usuario verificador de comprobantes
 * 
 * Este usuario tendrá acceso a la página de verificación de comprobantes.
 * 
 * Para ejecutar: node scripts/create_verificador_user.js
 */

const { Client, Account, Databases, ID, Query } = require('node-appwrite');

// Configuración de Appwrite
const config = {
  endpoint: 'https://sfo.cloud.appwrite.io/v1',
  projectId: '691bb3410033a2c8c1f4',
  // IMPORTANTE: Reemplazar con tu API Key de Appwrite
  apiKey: 'TU_API_KEY_AQUI',
  databaseId: 'apuTours_db'
};

// Datos del usuario verificador
const verificadorUser = {
  email: 'verificador@aputours.com',
  password: 'Apu2024Verificador!',
  name: 'Verificador ApuTours'
};

async function createVerificadorUser() {
  console.log('🔐 Creando usuario verificador de comprobantes...\n');

  // Inicializar cliente de Appwrite
  const client = new Client()
    .setEndpoint(config.endpoint)
    .setProject(config.projectId)
    .setKey(config.apiKey);

  const databases = new Databases(client);

  try {
    // Verificar si la colección de usuarios tiene el campo 'rol'
    // Si no existe, crear el documento de perfil del verificador
    
    const usersCollectionId = 'users_coll';
    
    // Verificar si ya existe un verificador
    const existingUsers = await databases.listDocuments(
      config.databaseId,
      usersCollectionId,
      [Query.equal('email', verificadorUser.email)]
    );

    if (existingUsers.documents.length > 0) {
      console.log('⚠️  Ya existe un usuario verificador con este email.');
      console.log('📧 Email:', verificadorUser.email);
      console.log('🔑 Password: Apu2024Verificador!');
      return;
    }

    // Crear documento de perfil del verificador
    const verificadorProfile = await databases.createDocument(
      config.databaseId,
      usersCollectionId,
      ID.unique(),
      {
        email: verificadorUser.email,
        nombre: verificadorUser.name,
        rol: 'verificador', // Rol especial para verificar comprobantes
        fechaCreacion: new Date().toISOString(),
        activo: true
      }
    );

    console.log('✅ Perfil de verificador creado exitosamente!\n');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📋 CREDENCIALES DEL VERIFICADOR:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📧 Email:    ', verificadorUser.email);
    console.log('🔑 Password: ', verificadorUser.password);
    console.log('👤 Nombre:   ', verificadorUser.name);
    console.log('🏷️  Rol:      ', 'verificador');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    console.log('💡 IMPORTANTE:');
    console.log('   1. El usuario debe registrarse en la app con estas credenciales');
    console.log('   2. El rol "verificador" le dará acceso a /verificar-comprobante');
    console.log('   3. Cambia la contraseña después del primer inicio de sesión\n');
    
    console.log('📝 ID del perfil:', verificadorProfile.$id);

  } catch (error) {
    console.error('❌ Error:', error.message);
    
    if (error.code === 401) {
      console.log('\n💡 Asegúrate de configurar tu API Key de Appwrite en el script.');
    }
    
    if (error.code === 404) {
      console.log('\n💡 La colección users_coll no existe o no tiene los campos necesarios.');
      console.log('   Necesitas agregar el campo "rol" (string) a la colección users_coll.');
    }
  }
}

// Ejecutar
createVerificadorUser();

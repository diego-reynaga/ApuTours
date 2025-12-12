/**
 * Script para agregar el campo 'rol' a la colección users_coll
 * y crear el usuario verificador
 * 
 * Para ejecutar:
 * 1. En PowerShell: 
 *    $env:APPWRITE_API_KEY = "TU_API_KEY"
 * 2. node scripts/setup_verificador.js
 */

const sdk = require('node-appwrite');

// Configuración
const config = {
  endpoint: 'https://sfo.cloud.appwrite.io/v1',
  projectId: '691bb3410033a2c8c1f4',
  databaseId: 'apuTours_db',
  usersCollectionId: 'users_coll'
};

// Datos del usuario verificador
const verificadorData = {
  email: 'verificador@aputours.com',
  nombre: 'Verificador ApuTours',
  rol: 'verificador'
};

async function setupVerificador() {
  // Obtener API Key de variable de entorno
  const apiKey = process.env.APPWRITE_API_KEY;
  
  if (!apiKey) {
    console.error('❌ Error: Falta la variable de entorno APPWRITE_API_KEY');
    console.log('\n💡 Ejecuta primero:');
    console.log('   $env:APPWRITE_API_KEY = "TU_API_KEY_DE_APPWRITE"');
    process.exit(1);
  }

  // Inicializar cliente
  const client = new sdk.Client();
  client
    .setEndpoint(config.endpoint)
    .setProject(config.projectId)
    .setKey(apiKey);

  const databases = new sdk.Databases(client);

  console.log('🔧 Configurando sistema de verificación de comprobantes...\n');

  try {
    // Paso 1: Agregar atributo 'rol' a la colección users_coll
    console.log('1️⃣  Agregando campo "rol" a la colección users_coll...');
    
    try {
      await databases.createStringAttribute(
        config.databaseId,
        config.usersCollectionId,
        'rol',          // key
        50,             // size
        false,          // required
        'usuario',      // default value
        false           // array
      );
      console.log('   ✅ Campo "rol" creado correctamente');
      
      // Esperar a que el atributo esté disponible
      console.log('   ⏳ Esperando a que el atributo esté disponible...');
      await new Promise(resolve => setTimeout(resolve, 3000));
    } catch (error) {
      if (error.code === 409) {
        console.log('   ⚠️  El campo "rol" ya existe (ignorando)');
      } else {
        throw error;
      }
    }

    // Paso 2: Agregar campo 'activo' 
    console.log('2️⃣  Agregando campo "activo" a la colección...');
    
    try {
      await databases.createBooleanAttribute(
        config.databaseId,
        config.usersCollectionId,
        'activo',       // key
        false,          // required
        true            // default value
      );
      console.log('   ✅ Campo "activo" creado correctamente');
      await new Promise(resolve => setTimeout(resolve, 2000));
    } catch (error) {
      if (error.code === 409) {
        console.log('   ⚠️  El campo "activo" ya existe (ignorando)');
      } else {
        throw error;
      }
    }

    // Paso 3: Verificar si ya existe un verificador
    console.log('3️⃣  Verificando si ya existe un usuario verificador...');
    
    const existingUsers = await databases.listDocuments(
      config.databaseId,
      config.usersCollectionId,
      [sdk.Query.equal('email', verificadorData.email)]
    );

    if (existingUsers.documents.length > 0) {
      console.log('   ⚠️  Ya existe un usuario verificador');
      console.log(`   📧 Email: ${verificadorData.email}`);
      
      // Actualizar rol si no lo tiene
      const existingUser = existingUsers.documents[0];
      if (existingUser.rol !== 'verificador') {
        await databases.updateDocument(
          config.databaseId,
          config.usersCollectionId,
          existingUser.$id,
          { rol: 'verificador', activo: true }
        );
        console.log('   ✅ Rol actualizado a "verificador"');
      }
    } else {
      // Crear documento del verificador
      console.log('4️⃣  Creando perfil del verificador...');
      
      const newVerificador = await databases.createDocument(
        config.databaseId,
        config.usersCollectionId,
        sdk.ID.unique(),
        {
          name: verificadorData.nombre,
          email: verificadorData.email,
          rol: 'verificador',
          activo: true
        }
      );
      
      console.log('   ✅ Perfil de verificador creado');
      console.log(`   📝 ID: ${newVerificador.$id}`);
    }

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('✅ CONFIGURACIÓN COMPLETADA');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    
    console.log('📋 CREDENCIALES DEL VERIFICADOR:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📧 Email:      verificador@aputours.com');
    console.log('🔑 Password:   Apu2024Verificador!');
    console.log('👤 Nombre:     Verificador ApuTours');
    console.log('🏷️  Rol:        verificador');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    
    console.log('📝 PRÓXIMOS PASOS:');
    console.log('   1. Ve a la aplicación y regístrate con el email del verificador');
    console.log('   2. Usa la contraseña: Apu2024Verificador!');
    console.log('   3. Accede a /verificar-comprobante para validar pagos');
    console.log('\n💡 Nota: El rol se asigna automáticamente al iniciar sesión');
    
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    if (error.code === 401) {
      console.log('\n💡 Verifica que tu API Key tenga permisos de escritura en databases.');
    }
    process.exit(1);
  }
}

// Ejecutar
setupVerificador();

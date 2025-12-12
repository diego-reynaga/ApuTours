/**
 * Script para configurar la colección de comprobantes en Appwrite
 * 
 * Ejecutar con:
 * $env:APPWRITE_API_KEY = "TU_API_KEY"
 * node scripts/setup_comprobantes.js
 */

const sdk = require('node-appwrite');

const config = {
  endpoint: 'https://sfo.cloud.appwrite.io/v1',
  projectId: '691bb3410033a2c8c1f4',
  databaseId: 'apuTours_db',
  collectionId: 'comprobantes_coll'
};

async function setupComprobantes() {
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

  console.log('🚀 Configurando colección de comprobantes...\n');

  try {
    // Verificar si la colección existe
    try {
      await databases.getCollection(config.databaseId, config.collectionId);
      console.log('✅ La colección comprobantes_coll ya existe');
    } catch (e) {
      // Crear la colección si no existe
      console.log('📝 Creando colección comprobantes_coll...');
      await databases.createCollection(
        config.databaseId,
        config.collectionId,
        'Comprobantes',
        [
          sdk.Permission.read(sdk.Role.any()),
          sdk.Permission.create(sdk.Role.users()),
          sdk.Permission.update(sdk.Role.users()),
        ]
      );
      console.log('✅ Colección creada');
    }

    // Definir atributos necesarios
    const attributes = [
      { key: 'codigoComprobante', type: 'string', size: 12, required: true },
      { key: 'codigoVerificacion', type: 'string', size: 10, required: true },
      { key: 'reservaId', type: 'string', size: 50, required: true },
      { key: 'userId', type: 'string', size: 50, required: true },
      { key: 'tipoServicio', type: 'string', size: 20, required: true },
      { key: 'proveedorId', type: 'string', size: 50, required: false },
      { key: 'proveedorNombre', type: 'string', size: 100, required: true },
      { key: 'clienteNombre', type: 'string', size: 255, required: true },
      { key: 'clienteEmail', type: 'string', size: 255, required: true },
      { key: 'clienteDocumento', type: 'string', size: 20, required: true },
      { key: 'clienteTelefono', type: 'string', size: 20, required: true },
      { key: 'descripcionServicio', type: 'string', size: 500, required: true },
      { key: 'fechaServicio', type: 'string', size: 20, required: true },
      { key: 'fechaFinServicio', type: 'string', size: 20, required: false },
      { key: 'cantidadPersonas', type: 'integer', required: true },
      { key: 'subtotal', type: 'float', required: true },
      { key: 'impuestos', type: 'float', required: true },
      { key: 'descuento', type: 'float', required: true },
      { key: 'total', type: 'float', required: true },
      { key: 'estado', type: 'string', size: 20, required: true },
      { key: 'metodoPago', type: 'string', size: 50, required: true },
      { key: 'fechaPago', type: 'string', size: 30, required: false },
      { key: 'verificadoPor', type: 'string', size: 100, required: false },
      { key: 'fechaVerificacion', type: 'string', size: 30, required: false },
      { key: 'notasVerificacion', type: 'string', size: 500, required: false },
      { key: 'hashSeguridad', type: 'string', size: 64, required: true },
    ];

    console.log('\n📋 Creando atributos...');
    
    for (const attr of attributes) {
      try {
        if (attr.type === 'string') {
          await databases.createStringAttribute(
            config.databaseId,
            config.collectionId,
            attr.key,
            attr.size,
            attr.required,
            undefined,
            false
          );
        } else if (attr.type === 'integer') {
          await databases.createIntegerAttribute(
            config.databaseId,
            config.collectionId,
            attr.key,
            attr.required
          );
        } else if (attr.type === 'float') {
          await databases.createFloatAttribute(
            config.databaseId,
            config.collectionId,
            attr.key,
            attr.required
          );
        }
        console.log(`  ✅ ${attr.key}`);
      } catch (e) {
        if (e.code === 409) {
          console.log(`  ⏭️  ${attr.key} (ya existe)`);
        } else {
          console.log(`  ❌ ${attr.key}: ${e.message}`);
        }
      }
    }

    // Crear índices
    console.log('\n📋 Creando índices...');
    
    const indexes = [
      { key: 'idx_codigo_verificacion', attributes: ['codigoVerificacion'] },
      { key: 'idx_reserva', attributes: ['reservaId'] },
      { key: 'idx_user', attributes: ['userId'] },
      { key: 'idx_estado', attributes: ['estado'] },
    ];

    for (const idx of indexes) {
      try {
        await databases.createIndex(
          config.databaseId,
          config.collectionId,
          idx.key,
          'key',
          idx.attributes
        );
        console.log(`  ✅ ${idx.key}`);
      } catch (e) {
        if (e.code === 409) {
          console.log(`  ⏭️  ${idx.key} (ya existe)`);
        } else {
          console.log(`  ❌ ${idx.key}: ${e.message}`);
        }
      }
    }

    console.log('\n✅ Configuración completada!');
    console.log('\n📌 Recuerda actualizar también el atributo codigoConfirmacion');
    console.log('   en la colección reservas_coll para aceptar 12 caracteres.');

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

setupComprobantes();

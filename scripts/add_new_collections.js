// scripts/add_new_collections.js
// Script para agregar las colecciones de contactos y comprobantes a la base de datos existente
const sdk = require('node-appwrite');

// Obtener variables de entorno
const endpoint = process.env.APPWRITE_ENDPOINT;
const project = process.env.APPWRITE_PROJECT;
const apiKey = process.env.APPWRITE_API_KEY;

if (!endpoint || !project || !apiKey) {
  console.error('❌ Error: Variables de entorno faltantes.');
  console.error('Asegúrate de exportar:');
  console.error('  $env:APPWRITE_ENDPOINT = "https://sfo.cloud.appwrite.io/v1"');
  console.error('  $env:APPWRITE_PROJECT = "691bb3410033a2c8c1f4"');
  console.error('  $env:APPWRITE_API_KEY = "<tu_api_key>"');
  process.exit(1);
}

// Inicializar cliente con node-appwrite
const client = new sdk.Client();
client
  .setEndpoint(endpoint)
  .setProject(project)
  .setKey(apiKey);

const databases = new sdk.Databases(client);

// ID de la base de datos existente
const databaseId = 'apuTours_db';

async function addNewCollections() {
  try {
    console.log('🚀 Agregando nuevas colecciones a la base de datos...\n');
    
    // Colección de Contactos
    console.log('📝 Creando colección: contactos');
    try {
      await databases.createCollection(
        databaseId,
        'contactos_coll',
        'contactos',
        undefined,
        false
      );
      
      // Atributos para contactos
      const contactosAttributes = [
        { key: 'nombre', type: 'string', size: 255, required: true },
        { key: 'email', type: 'email', required: true },
        { key: 'telefono', type: 'string', size: 20, required: false },
        { key: 'asunto', type: 'string', size: 255, required: true },
        { key: 'mensaje', type: 'string', size: 2000, required: true },
        { key: 'estado', type: 'string', size: 20, required: true }, // pendiente, leido, respondido
        { key: 'fechaEnvio', type: 'string', size: 30, required: false }
      ];

      for (const attr of contactosAttributes) {
        if (attr.type === 'string') {
          await databases.createStringAttribute(databaseId, 'contactos_coll', attr.key, attr.size, attr.required);
        } else if (attr.type === 'email') {
          await databases.createEmailAttribute(databaseId, 'contactos_coll', attr.key, attr.required);
        }
        console.log(`   ✓ Atributo ${attr.key} creado`);
      }
      
      console.log('✅ Colección contactos creada exitosamente\n');
    } catch (error) {
      if (error.code === 409) {
        console.log('⚠️  Colección contactos ya existe\n');
      } else {
        throw error;
      }
    }

    // Colección de Comprobantes
    console.log('📝 Creando colección: comprobantes');
    try {
      await databases.createCollection(
        databaseId,
        'comprobantes_coll',
        'comprobantes',
        undefined,
        false
      );
      
      // Atributos para comprobantes
      const comprobantesAttributes = [
        { key: 'codigoComprobante', type: 'string', size: 30, required: true },
        { key: 'codigoVerificacion', type: 'string', size: 20, required: true },
        { key: 'reservaId', type: 'string', size: 50, required: true },
        { key: 'userId', type: 'string', size: 50, required: true },
        { key: 'tipoServicio', type: 'string', size: 30, required: true }, // hospedaje, gastronomia, transporte, tour, paquete
        { key: 'proveedorId', type: 'string', size: 50, required: false },
        { key: 'proveedorNombre', type: 'string', size: 255, required: true },
        
        // Datos del cliente
        { key: 'clienteNombre', type: 'string', size: 255, required: true },
        { key: 'clienteEmail', type: 'email', required: true },
        { key: 'clienteDocumento', type: 'string', size: 20, required: true },
        { key: 'clienteTelefono', type: 'string', size: 20, required: true },
        
        // Detalles del servicio
        { key: 'descripcionServicio', type: 'string', size: 500, required: true },
        { key: 'fechaServicio', type: 'string', size: 30, required: true },
        { key: 'fechaFinServicio', type: 'string', size: 30, required: false },
        { key: 'cantidadPersonas', type: 'integer', required: true },
        
        // Montos
        { key: 'subtotal', type: 'float', required: true },
        { key: 'impuestos', type: 'float', required: true },
        { key: 'descuento', type: 'float', required: false },
        { key: 'total', type: 'float', required: true },
        
        // Estado y verificación
        { key: 'estado', type: 'string', size: 20, required: true }, // pendiente, pagado, verificado, rechazado, cancelado
        { key: 'metodoPago', type: 'string', size: 50, required: true },
        { key: 'fechaPago', type: 'string', size: 30, required: false },
        { key: 'verificadoPor', type: 'string', size: 255, required: false },
        { key: 'fechaVerificacion', type: 'string', size: 30, required: false },
        { key: 'notasVerificacion', type: 'string', size: 500, required: false },
        
        // Seguridad
        { key: 'hashSeguridad', type: 'string', size: 64, required: true }
      ];

      for (const attr of comprobantesAttributes) {
        if (attr.type === 'string') {
          await databases.createStringAttribute(databaseId, 'comprobantes_coll', attr.key, attr.size, attr.required);
        } else if (attr.type === 'email') {
          await databases.createEmailAttribute(databaseId, 'comprobantes_coll', attr.key, attr.required);
        } else if (attr.type === 'integer') {
          await databases.createIntegerAttribute(databaseId, 'comprobantes_coll', attr.key, attr.required);
        } else if (attr.type === 'float') {
          await databases.createFloatAttribute(databaseId, 'comprobantes_coll', attr.key, attr.required);
        }
        console.log(`   ✓ Atributo ${attr.key} creado`);
      }

      // Crear índice para código de verificación (para búsquedas rápidas)
      console.log('   📊 Creando índices...');
      await new Promise(resolve => setTimeout(resolve, 3000)); // Esperar a que se creen los atributos
      
      try {
        await databases.createIndex(
          databaseId,
          'comprobantes_coll',
          'idx_codigoVerificacion',
          'key',
          ['codigoVerificacion']
        );
        console.log('   ✓ Índice codigoVerificacion creado');
      } catch (e) {
        console.log('   ⚠️ Índice puede tardar en crearse');
      }

      try {
        await databases.createIndex(
          databaseId,
          'comprobantes_coll',
          'idx_userId',
          'key',
          ['userId']
        );
        console.log('   ✓ Índice userId creado');
      } catch (e) {
        console.log('   ⚠️ Índice puede tardar en crearse');
      }
      
      console.log('✅ Colección comprobantes creada exitosamente\n');
    } catch (error) {
      if (error.code === 409) {
        console.log('⚠️  Colección comprobantes ya existe\n');
      } else {
        throw error;
      }
    }

    console.log('🎉 ¡Proceso completado!');
    console.log('\n📋 Colecciones agregadas:');
    console.log('   - contactos: contactos_coll');
    console.log('   - comprobantes: comprobantes_coll');
    console.log('\n📝 Asegúrate de que environment.ts tenga estas colecciones configuradas.');

  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.code) {
      console.error('Código de error:', error.code);
    }
  }
}

addNewCollections();

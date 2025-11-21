const sdk = require('node-appwrite');

// Obtener variables de entorno
const endpoint = process.env.APPWRITE_ENDPOINT || 'https://sfo.cloud.appwrite.io/v1';
const project = process.env.APPWRITE_PROJECT || '691bb3410033a2c8c1f4';
const apiKey = process.env.APPWRITE_API_KEY;

if (!apiKey) {
  console.error('❌ Error: Variable de entorno APPWRITE_API_KEY faltante.');
  console.error('Por favor, establece la variable de entorno antes de ejecutar el script.');
  process.exit(1);
}

const client = new sdk.Client();
client
  .setEndpoint(endpoint)
  .setProject(project)
  .setKey(apiKey);

const databases = new sdk.Databases(client);
const databaseId = 'apuTours_db';
const collectionId = 'transportes_coll';

const transportes = [
  {
    tipo: 'taxi',
    nombre: 'Taxi Seguro - City Tour',
    descripcion: 'Servicio de taxi seguro y confiable para recorrer los principales puntos de la ciudad de Andahuaylas.',
    origen: 'Plaza de Armas',
    destino: 'Mirador de Waywaka',
    precio: 15.00,
    duracion: '20 min',
    horarios: JSON.stringify(['A pedido']),
    capacidad: 4,
    caracteristicas: JSON.stringify(['Seguro', 'Chofer Guía', 'Paradas fotográficas']),
    imagen: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    disponible: true
  },
  {
    tipo: 'compartido',
    nombre: 'Colectivo a Pacucha',
    descripcion: 'Transporte económico y frecuente hacia la hermosa Laguna de Pacucha. Salidas constantes desde el paradero.',
    origen: 'Paradero Pacucha (Centro)',
    destino: 'Laguna de Pacucha',
    precio: 5.00,
    duracion: '30 min',
    horarios: JSON.stringify(['Cada 15 min', '06:00 - 19:00']),
    capacidad: 4,
    caracteristicas: JSON.stringify(['Económico', 'Rápido', 'Frecuente']),
    imagen: 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    disponible: true
  },
  {
    tipo: 'privado',
    nombre: 'Van Turística - Sondor',
    descripcion: 'Servicio privado ideal para familias o grupos pequeños que desean visitar el Complejo Arqueológico de Sondor con comodidad.',
    origen: 'Recojo en Hotel',
    destino: 'Complejo Arqueológico de Sondor',
    precio: 120.00,
    duracion: '45 min',
    horarios: JSON.stringify(['A elección del cliente']),
    capacidad: 10,
    caracteristicas: JSON.stringify(['Aire acondicionado', 'Asientos cómodos', 'Paradas libres', 'Guía opcional']),
    imagen: 'https://images.unsplash.com/photo-1566232392379-afd9298e6a46?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    disponible: true
  },
  {
    tipo: 'bus',
    nombre: 'Bus a Pampachiri',
    descripcion: 'Excursión en bus turístico hacia el enigmático Bosque de Piedras de Pampachiri (Aldea de los Pitufos).',
    origen: 'Plaza de Armas',
    destino: 'Bosque de Piedras de Pampachiri',
    precio: 45.00,
    duracion: '3h 30min',
    horarios: JSON.stringify(['07:00 AM (Sábados y Domingos)']),
    capacidad: 30,
    caracteristicas: JSON.stringify(['Guía a bordo', 'Botiquín', 'Oxígeno', 'Snack incluido']),
    imagen: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    disponible: true
  },
  {
    tipo: 'taxi',
    nombre: 'Traslado Aeropuerto',
    descripcion: 'Servicio de traslado directo desde o hacia el Aeropuerto de Andahuaylas. Puntualidad garantizada.',
    origen: 'Aeropuerto de Andahuaylas',
    destino: 'Centro de la Ciudad / Hotel',
    precio: 25.00,
    duracion: '25 min',
    horarios: JSON.stringify(['Según vuelos']),
    capacidad: 3,
    caracteristicas: JSON.stringify(['Maletera amplia', 'Puntualidad', 'Factura disponible']),
    imagen: 'https://images.unsplash.com/photo-1556122071-e404eaedb77f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    disponible: true
  },
  {
    tipo: 'privado',
    nombre: 'Camioneta 4x4 - Ruta Aventura',
    descripcion: 'Alquiler de camioneta con conductor para rutas de difícil acceso y aventura en los alrededores.',
    origen: 'Andahuaylas',
    destino: 'Rutas Varias (Aventura)',
    precio: 250.00,
    duracion: 'Por día',
    horarios: JSON.stringify(['08:00 - 18:00']),
    capacidad: 4,
    caracteristicas: JSON.stringify(['4x4', 'Conductor experto', 'Combustible no incluido']),
    imagen: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    disponible: true
  }
];

async function seedTransportes() {
  console.log('🚌 Iniciando carga de datos de transporte...');

  for (const item of transportes) {
    try {
      await databases.createDocument(
        databaseId,
        collectionId,
        sdk.ID.unique(),
        item
      );
      console.log(`   ✅ Insertado: ${item.nombre}`);
    } catch (error) {
      console.error(`   ❌ Error insertando ${item.nombre}: ${error.message}`);
    }
  }

  console.log('\n✨ ¡Carga de transportes completada!');
}

seedTransportes();

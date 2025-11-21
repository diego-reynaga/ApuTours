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
  console.error('  $env:APPWRITE_API_KEY = "..."');
  process.exit(1);
}

const client = new sdk.Client();
client
  .setEndpoint(endpoint)
  .setProject(project)
  .setKey(apiKey);

const databases = new sdk.Databases(client);
const databaseId = 'apuTours_db';

const data = {
  destinos: [
    {
      nombre: 'Laguna de Pacucha',
      descripcion: 'Considerada una de las lagunas más bellas y grandes del Perú. Sus aguas azules y tibias son ideales para paseos en bote y disfrutar de la gastronomía local.',
      imagen: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/Laguna_de_Pacucha_-_Andahuaylas.jpg/1200px-Laguna_de_Pacucha_-_Andahuaylas.jpg',
      categorias: JSON.stringify(['Naturaleza', 'Gastronomía', 'Paseos']),
      duracion: 'Medio día',
      distancia: '17 km de Andahuaylas',
      dificultad: 'Baja',
      precio: 20.00,
      rating: 4.8,
      reviews: 340,
      destacado: true
    },
    {
      nombre: 'Complejo Arqueológico de Sondor',
      descripcion: 'Centro ceremonial y militar de la cultura Chanka. Destaca por su arquitectura piramidal y vistas panorámicas impresionantes.',
      imagen: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Sondor_Raymi.jpg/1200px-Sondor_Raymi.jpg',
      categorias: JSON.stringify(['Historia', 'Arqueología', 'Cultura']),
      duracion: 'Medio día',
      distancia: '21 km de Andahuaylas',
      dificultad: 'Media',
      precio: 15.00,
      rating: 4.9,
      reviews: 210,
      destacado: true
    },
    {
      nombre: 'Bosque de Piedras de Pampachiri',
      descripcion: 'Conocido como la "Aldea de los Pitufos" por sus formaciones rocosas cónicas. Un paisaje surrealista único en los Andes.',
      imagen: 'https://www.peru.travel/Contenido/Atractivo/Imagen/es/188/1.1/Principal/bosque-de-piedras-de-pampachiri.jpg',
      categorias: JSON.stringify(['Aventura', 'Naturaleza', 'Trekking']),
      duracion: 'Día completo',
      distancia: '130 km de Andahuaylas',
      dificultad: 'Media-Alta',
      precio: 80.00,
      rating: 4.7,
      reviews: 150,
      destacado: true
    },
    {
      nombre: 'Santuario de Campanayoq',
      descripcion: 'Mirador natural y sitio religioso con vistas espectaculares del valle de Chumbao y la ciudad de Andahuaylas.',
      imagen: 'https://live.staticflickr.com/3904/14936763678_5863060663_b.jpg',
      categorias: JSON.stringify(['Mirador', 'Religión', 'Caminata']),
      duracion: '3 horas',
      distancia: '5 km de Andahuaylas',
      dificultad: 'Baja',
      precio: 0.00,
      rating: 4.6,
      reviews: 90,
      destacado: false
    }
  ],
  hospedajes: [
    {
      nombre: 'Hotel Sol de Oro',
      categoria: 'Confort',
      descripcion: 'Hotel moderno en el centro de Andahuaylas con todas las comodidades.',
      amenidades: JSON.stringify(['Wifi', 'Desayuno', 'Agua Caliente', 'TV Cable']),
      precioPorNoche: 120.00,
      rating: 4.5,
      reviews: 80,
      ubicacion: 'Jr. Juan Antonio Trelles, Andahuaylas',
      imagen: 'https://cf.bstatic.com/xdata/images/hotel/max1024x768/253636872.jpg?k=8a8a8a8a8a8a8a8a8a8a8a8a8a8a8a8a8a8a8a8a8a8a8a8a8a8a8a8a8a8a8a8a&o=&hp=1',
      destacado: true
    },
    {
      nombre: 'Recreo Turístico El Lago',
      categoria: 'Bungalows',
      descripcion: 'Hospedaje rústico frente a la Laguna de Pacucha, ideal para desconectar.',
      amenidades: JSON.stringify(['Vista al lago', 'Restaurante', 'Jardines']),
      precioPorNoche: 90.00,
      rating: 4.6,
      reviews: 120,
      ubicacion: 'Pacucha, Andahuaylas',
      imagen: 'https://media-cdn.tripadvisor.com/media/photo-s/0d/8e/8e/8e/vista-desde-el-hotel.jpg',
      destacado: true
    }
  ],
  gastronomia: [
    {
      nombre: 'Recreo Campestre El Manantial',
      categoria: 'Típica',
      nivelPrecio: '$$',
      descripcion: 'Especialidad en Cuy Chactado y Chicharrón con mote.',
      especialidades: JSON.stringify(['Cuy Chactado', 'Chicharrón', 'Tallarín de Casa']),
      horario: '10:00 AM - 6:00 PM',
      ubicacion: 'San Jerónimo, Andahuaylas',
      rating: 4.7,
      imagen: 'https://media-cdn.tripadvisor.com/media/photo-s/1a/1a/1a/1a/cuy-chactado.jpg',
      caracteristicas: JSON.stringify(['Juegos para niños', 'Estacionamiento', 'Música en vivo'])
    },
    {
      nombre: 'Pizzería El Horno',
      categoria: 'Italiana/Fusión',
      nivelPrecio: '$$',
      descripcion: 'Las mejores pizzas a la leña y pastas artesanales en la ciudad.',
      especialidades: JSON.stringify(['Pizza Andina', 'Lasaña', 'Vinos']),
      horario: '5:00 PM - 11:00 PM',
      ubicacion: 'Plaza de Armas, Andahuaylas',
      rating: 4.5,
      imagen: 'https://media-cdn.tripadvisor.com/media/photo-s/1b/1b/1b/1b/pizza.jpg',
      caracteristicas: JSON.stringify(['Delivery', 'Céntrico'])
    }
  ],
  transportes: [
    {
      tipo: 'Bus Interprovincial',
      nombre: 'Expreso Los Chankas',
      descripcion: 'Conexión diaria Lima - Andahuaylas - Cusco.',
      origen: 'Lima',
      destino: 'Andahuaylas',
      precio: 80.00,
      duracion: '14h',
      horarios: JSON.stringify(['14:00', '16:00']),
      capacidad: 50,
      caracteristicas: JSON.stringify(['Asientos reclinables', 'Baño', 'Video']),
      imagen: 'https://live.staticflickr.com/65535/51234567890_abcdef1234_b.jpg',
      disponible: true
    },
    {
      tipo: 'Colectivo',
      nombre: 'Ruta Pacucha',
      descripcion: 'Transporte rápido y frecuente a la Laguna de Pacucha.',
      origen: 'Andahuaylas',
      destino: 'Pacucha',
      precio: 5.00,
      duracion: '30 min',
      horarios: JSON.stringify(['Cada 15 min']),
      capacidad: 4,
      caracteristicas: JSON.stringify(['Rápido', 'Económico']),
      imagen: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a1/Mototaxi_in_Peru.jpg/1200px-Mototaxi_in_Peru.jpg',
      disponible: true
    }
  ]
};

async function seedDatabase() {
  console.log('🌱 Iniciando poblado de base de datos con información de Andahuaylas...');

  for (const [collectionName, items] of Object.entries(data)) {
    const collectionId = `${collectionName}_coll`;
    console.log(`\n📂 Procesando colección: ${collectionName} (${collectionId})`);

    for (const item of items) {
      try {
        await databases.createDocument(
          databaseId,
          collectionId,
          sdk.ID.unique(),
          item
        );
        console.log(`   ✅ Insertado: ${item.nombre || item.tipo}`);
      } catch (error) {
        console.error(`   ❌ Error insertando ${item.nombre}: ${error.message}`);
      }
    }
  }

  console.log('\n✨ ¡Proceso de seed completado!');
}

seedDatabase();
// falta machupicchu
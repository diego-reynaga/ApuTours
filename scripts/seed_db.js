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
      nombre: 'Machu Picchu',
      descripcion: 'La ciudad perdida de los Incas, una de las 7 maravillas del mundo moderno. Un lugar lleno de energía e historia.',
      imagen: 'https://images.unsplash.com/photo-1587595431973-160d0d94add1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1476&q=80',
      categorias: JSON.stringify(['Historia', 'Cultura', 'Montaña']),
      duracion: '1 día',
      distancia: '74 km de Cusco',
      dificultad: 'Media',
      precio: 150.00,
      rating: 4.9,
      reviews: 1250,
      destacado: true
    },
    {
      nombre: 'Montaña de 7 Colores',
      descripcion: 'Vinicunca, la montaña arcoíris. Un espectáculo natural impresionante a más de 5000 msnm.',
      imagen: 'https://images.unsplash.com/photo-1535961652354-923cb08225a7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1374&q=80',
      categorias: JSON.stringify(['Aventura', 'Naturaleza', 'Trekking']),
      duracion: '1 día',
      distancia: '100 km de Cusco',
      dificultad: 'Alta',
      precio: 80.00,
      rating: 4.7,
      reviews: 850,
      destacado: true
    },
    {
      nombre: 'Laguna Humantay',
      descripcion: 'Una joya turquesa en medio de los andes, custodiada por el nevado Salkantay.',
      imagen: 'https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80',
      categorias: JSON.stringify(['Naturaleza', 'Trekking', 'Paisaje']),
      duracion: '1 día',
      distancia: '120 km de Cusco',
      dificultad: 'Media-Alta',
      precio: 90.00,
      rating: 4.8,
      reviews: 620,
      destacado: false
    }
  ],
  hospedajes: [
    {
      nombre: 'Hotel Monasterio',
      categoria: 'Lujo',
      descripcion: 'Un antiguo monasterio convertido en hotel de lujo, combinando historia colonial con confort moderno.',
      amenidades: JSON.stringify(['Wifi', 'Restaurante', 'Spa', 'Oxígeno']),
      precioPorNoche: 350.00,
      rating: 4.9,
      reviews: 450,
      ubicacion: 'Centro Histórico, Cusco',
      imagen: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80',
      destacado: true
    },
    {
      nombre: 'Casa Andina Standard',
      categoria: 'Confort',
      descripcion: 'Comodidad y excelente ubicación a pasos de la Plaza de Armas.',
      amenidades: JSON.stringify(['Wifi', 'Desayuno', 'Calefacción']),
      precioPorNoche: 120.00,
      rating: 4.5,
      reviews: 320,
      ubicacion: 'Cusco',
      imagen: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80',
      destacado: false
    }
  ],
  gastronomia: [
    {
      nombre: 'Chicha por Gastón Acurio',
      categoria: 'Fusión',
      nivelPrecio: '$$$',
      descripcion: 'Homenaje a la sabiduría culinaria cusqueña con el toque del reconocido chef Gastón Acurio.',
      especialidades: JSON.stringify(['Cuy Pekinés', 'Ravioles de Choclo', 'Alpaca']),
      horario: '12:00 PM - 10:00 PM',
      ubicacion: 'Plaza Regocijo, Cusco',
      rating: 4.8,
      imagen: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80',
      caracteristicas: JSON.stringify(['Reserva recomendada', 'Bar completo'])
    },
    {
      nombre: 'Morena Peruvian Kitchen',
      categoria: 'Peruana Moderna',
      nivelPrecio: '$$',
      descripcion: 'Sabores peruanos auténticos en un ambiente moderno y vibrante.',
      especialidades: JSON.stringify(['Lomo Saltado', 'Ceviche de Trucha', 'Pisco Sour']),
      horario: '11:00 AM - 10:00 PM',
      ubicacion: 'Calle Plateros, Cusco',
      rating: 4.7,
      imagen: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1374&q=80',
      caracteristicas: JSON.stringify(['Ambiente casual', 'Cócteles'])
    }
  ],
  transportes: [
    {
      tipo: 'Tren',
      nombre: 'Vistadome',
      descripcion: 'Tren panorámico con ventanas amplias para disfrutar del paisaje del Valle Sagrado.',
      origen: 'Ollantaytambo',
      destino: 'Aguas Calientes',
      precio: 85.00,
      duracion: '1h 30m',
      horarios: JSON.stringify(['07:05', '08:00', '13:27', '15:37']),
      capacidad: 48,
      caracteristicas: JSON.stringify(['Snack a bordo', 'Show cultural', 'Aire acondicionado']),
      imagen: 'https://images.unsplash.com/photo-1541280732-625994405583?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80',
      disponible: true
    },
    {
      tipo: 'Bus',
      nombre: 'Turismo Mer',
      descripcion: 'Bus turístico de Cusco a Puno con paradas en sitios arqueológicos.',
      origen: 'Cusco',
      destino: 'Puno',
      precio: 60.00,
      duracion: '10h',
      horarios: JSON.stringify(['07:00']),
      capacidad: 40,
      caracteristicas: JSON.stringify(['Guía a bordo', 'Almuerzo buffet', 'Wifi', 'Baño']),
      imagen: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?ixlib=rb-4.0.3&auto=format&fit=crop&w=1469&q=80',
      disponible: true
    }
  ]
};

async function seedDatabase() {
  console.log('🌱 Iniciando poblado de base de datos...');

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
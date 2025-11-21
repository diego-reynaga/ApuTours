
const sdk = require('node-appwrite');

// Configuración
const client = new sdk.Client();

// Obtener credenciales de variables de entorno
const ENDPOINT = process.env.APPWRITE_ENDPOINT || 'https://sfo.cloud.appwrite.io/v1';
const PROJECT_ID = process.env.APPWRITE_PROJECT_ID || '691bb3410033a2c8c1f4';
const API_KEY = process.env.APPWRITE_API_KEY; // Necesario para escritura
const DATABASE_ID = process.env.APPWRITE_DATABASE_ID || 'apuTours_db';
const COLLECTION_ID = 'hospedajes_coll';

if (!API_KEY) {
    console.error('❌ Error: La variable de entorno APPWRITE_API_KEY es requerida.');
    console.log('Uso: $env:APPWRITE_API_KEY="tu_api_key"; node scripts/seed-hospedajes.js');
    process.exit(1);
}

client
    .setEndpoint(ENDPOINT)
    .setProject(PROJECT_ID)
    .setKey(API_KEY);

const databases = new sdk.Databases(client);

const hospedajes = [
    {
        nombre: "Hotel Sol de Oro",
        categoria: "hoteles",
        descripcion: "Elegante hotel en el centro de Andahuaylas con todas las comodidades modernas. Ideal para viajeros de negocios y familias que buscan confort.",
        amenidades: ["Wifi Gratis", "Desayuno Buffet", "Restaurante", "Room Service", "Lavandería"],
        precioPorNoche: 120,
        rating: 4.5,
        reviews: 128,
        ubicacion: "Jr. Constitución 450, Andahuaylas",
        imagen: "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
        destacado: true
    },
    {
        nombre: "Lodge Laguna de Pacucha",
        categoria: "lodges",
        descripcion: "Experiencia única frente a la laguna de Pacucha. Bungalows ecológicos con vistas impresionantes y actividades al aire libre.",
        amenidades: ["Vista a la Laguna", "Restaurante Típico", "Paseos en Bote", "Zona de Fogata", "Estacionamiento"],
        precioPorNoche: 180,
        rating: 4.8,
        reviews: 95,
        ubicacion: "Ribera Laguna de Pacucha, Km 15",
        imagen: "https://images.unsplash.com/photo-1582719508461-905c673771fd?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
        destacado: true
    },
    {
        nombre: "Hostal El Caminante",
        categoria: "hostales",
        descripcion: "Ambiente acogedor y económico para mochileros y viajeros jóvenes. Cerca de la plaza de armas y zonas comerciales.",
        amenidades: ["Wifi", "Cocina Compartida", "Información Turística", "Agua Caliente"],
        precioPorNoche: 45,
        rating: 4.0,
        reviews: 210,
        ubicacion: "Av. Perú 320, Andahuaylas",
        imagen: "https://images.unsplash.com/photo-1555854785-985c9e3a884c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
        destacado: false
    },
    {
        nombre: "Casa Rural Los Chankas",
        categoria: "casas-rurales",
        descripcion: "Vive la experiencia de la vida en el campo. Casa tradicional renovada con huerto orgánico y animales de granja.",
        amenidades: ["Desayuno Orgánico", "Jardines", "Actividades de Granja", "Pet Friendly"],
        precioPorNoche: 90,
        rating: 4.6,
        reviews: 56,
        ubicacion: "Comunidad de Talavera, Sector 3",
        imagen: "https://images.unsplash.com/photo-1587061949409-02df41d5e562?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
        destacado: false
    },
    {
        nombre: "Gran Hotel Panamericano",
        categoria: "hoteles",
        descripcion: "Tradición y servicio de primera clase. Habitaciones amplias y salones de eventos para ocasiones especiales.",
        amenidades: ["Gimnasio", "Bar", "Salón de Eventos", "Wifi Alta Velocidad", "Cochera"],
        precioPorNoche: 150,
        rating: 4.3,
        reviews: 88,
        ubicacion: "Jr. Ramón Castilla 100, Andahuaylas",
        imagen: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
        destacado: false
    },
    {
        nombre: "Eco-Lodge Bosque de Piedras",
        categoria: "lodges",
        descripcion: "Refugio de montaña cerca de Pampachiri. Ideal para desconectarse y disfrutar del paisaje lunar del bosque de piedras.",
        amenidades: ["Energía Solar", "Trekking", "Guías Locales", "Comida Vegetariana"],
        precioPorNoche: 200,
        rating: 4.9,
        reviews: 42,
        ubicacion: "Pampachiri, Km 40",
        imagen: "https://images.unsplash.com/photo-1445019980597-93fa8acb246c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
        destacado: true
    }
];

async function seed() {
    console.log('🚀 Iniciando sembrado de datos para Hospedajes...');
    
    try {
        // Verificar si la colección existe (opcional, asumiendo que ya está creada por el esquema)
        console.log(`Conectando a base de datos: ${DATABASE_ID}, colección: ${COLLECTION_ID}`);

        // Limpiar colección existente (opcional, cuidado en producción)
        // Para este demo, vamos a intentar listar y borrar si hay pocos, o simplemente agregar.
        // Mejor estrategia: Agregar solo si no existen (por nombre) o simplemente agregar nuevos.
        // Para simplificar: Agregamos siempre.
        
        let count = 0;
        for (const item of hospedajes) {
            try {
                // Convertir amenidades a string JSON para cumplir con el esquema de Appwrite
                const documentData = {
                    ...item,
                    amenidades: JSON.stringify(item.amenidades)
                };

                await databases.createDocument(
                    DATABASE_ID,
                    COLLECTION_ID,
                    sdk.ID.unique(),
                    documentData
                );
                console.log(`✅ Agregado: ${item.nombre}`);
                count++;
            } catch (error) {
                console.error(`❌ Error agregando ${item.nombre}:`, error.message);
            }
        }

        console.log(`\n✨ Proceso finalizado. ${count} documentos creados.`);

    } catch (error) {
        console.error('❌ Error general:', error);
    }
}

seed();

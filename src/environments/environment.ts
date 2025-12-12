export const environment: {
  appwriteEndpoint: string;
  appwriteProjectId: string;
  appwriteProjectName: string;
  appwriteDatabaseId: string;
  appwriteCollections: {
    users: string;
    destinos: string;
    reservas: string;
    hospedajes: string;
    gastronomia: string;
    transportes: string;
    contactos: string;
    comprobantes: string;
  };
  appwriteFunctions: {
    sendContactEmailFunctionId: string;
  };
} = {
  appwriteEndpoint: 'https://sfo.cloud.appwrite.io/v1',
  appwriteProjectId: '691bb3410033a2c8c1f4',
  appwriteProjectName: 'ApuTours',
  // Estos IDs se obtendrán después de ejecutar el script create_appwrite_db.js
  appwriteDatabaseId: 'apuTours_db', // Reemplazar con el ID real
  appwriteCollections: {
    users: 'users_coll',
    destinos: 'destinos_coll',
    reservas: 'reservas_coll',
    hospedajes: 'hospedajes_coll',
    gastronomia: 'gastronomia_coll',
    transportes: 'transportes_coll',
    contactos: 'contactos_coll',
    comprobantes: 'comprobantes_coll'
  },
  // Appwrite Functions (NO poner API keys aquí)
  appwriteFunctions: {
    // ID de la Function que envía correos de contacto
    sendContactEmailFunctionId: 'send-contact-email'
  }
};
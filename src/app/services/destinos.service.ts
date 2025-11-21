import { Injectable, signal } from '@angular/core';
import { AppwriteDatabases } from './appwrite.client';
import { environment } from '../../environments/environment';
import { ID, Query } from 'appwrite';

export interface Destino {
  $id?: string;
  nombre: string;
  descripcion: string;
  imagen: string;
  categorias: string[];
  duracion: string;
  distancia: string;
  dificultad: string;
  precio: number;
  rating: number;
  reviews: number;
  destacado?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class DestinosService {
  private db = AppwriteDatabases;
  private databaseId = environment.appwriteDatabaseId;
  private collectionId = environment.appwriteCollections.destinos;

  destinos = signal<Destino[]>([]);
  isLoading = signal<boolean>(false);
  error = signal<string | null>(null);

  constructor() {
    this.loadDestinos();
  }

  /**
   * Cargar todos los destinos
   */
  async loadDestinos(): Promise<void> {
    try {
      this.isLoading.set(true);
      this.error.set(null);
      
      console.log('🔄 Cargando destinos desde Appwrite...');
      console.log('Database ID:', this.databaseId);
      console.log('Collection ID:', this.collectionId);

      const response = await this.db.listDocuments(
        this.databaseId,
        this.collectionId,
        [Query.orderDesc('$createdAt'), Query.limit(100)]
      );
      
      console.log('✅ Destinos cargados:', response.documents.length);

      // Parsear categorías si vienen como string JSON
      const documents = response.documents.map((doc: any) => {
        let categorias = doc.categorias;
        if (typeof categorias === 'string') {
          try {
            categorias = JSON.parse(categorias);
          } catch (e) {
            console.warn('Error parseando categorías para destino:', doc.nombre, e);
            categorias = [categorias]; // Fallback si no es JSON válido
          }
        }
        return { ...doc, categorias };
      });

      this.destinos.set(documents as unknown as Destino[]);
    } catch (error: any) {
      this.error.set(error.message || 'Error al cargar destinos');
      console.error('❌ Error loading destinos:', error);
    } finally {
      this.isLoading.set(false);
    }
  }

  /**
   * Obtener un destino por ID
   */
  async getDestino(id: string): Promise<Destino | null> {
    try {
      const response = await this.db.getDocument(
        this.databaseId,
        this.collectionId,
        id
      );
      return response as unknown as Destino;
    } catch (error: any) {
      console.error('Error getting destino:', error);
      return null;
    }
  }

  /**
   * Crear un nuevo destino
   */
  async createDestino(destino: Omit<Destino, '$id'>): Promise<Destino | null> {
    try {
      const response = await this.db.createDocument(
        this.databaseId,
        this.collectionId,
        ID.unique(),
        destino
      );
      
      await this.loadDestinos(); // Recargar lista
      return response as unknown as Destino;
    } catch (error: any) {
      this.error.set(error.message || 'Error al crear destino');
      console.error('Error creating destino:', error);
      return null;
    }
  }

  /**
   * Actualizar un destino
   */
  async updateDestino(id: string, data: Partial<Destino>): Promise<Destino | null> {
    try {
      const response = await this.db.updateDocument(
        this.databaseId,
        this.collectionId,
        id,
        data
      );
      
      await this.loadDestinos(); // Recargar lista
      return response as unknown as Destino;
    } catch (error: any) {
      this.error.set(error.message || 'Error al actualizar destino');
      console.error('Error updating destino:', error);
      return null;
    }
  }

  /**
   * Eliminar un destino
   */
  async deleteDestino(id: string): Promise<boolean> {
    try {
      await this.db.deleteDocument(
        this.databaseId,
        this.collectionId,
        id
      );
      
      await this.loadDestinos(); // Recargar lista
      return true;
    } catch (error: any) {
      this.error.set(error.message || 'Error al eliminar destino');
      console.error('Error deleting destino:', error);
      return false;
    }
  }

  /**
   * Buscar destinos por categoría
   */
  async searchByCategory(category: string): Promise<Destino[]> {
    try {
      const response = await this.db.listDocuments(
        this.databaseId,
        this.collectionId,
        [Query.search('categorias', category)]
      );
      
      return response.documents as unknown as Destino[];
    } catch (error: any) {
      console.error('Error searching destinos:', error);
      return [];
    }
  }
}

import { Injectable, signal } from '@angular/core';
import { AppwriteDatabases } from './appwrite.client';
import { environment } from '../../environments/environment';
import { ID, Query } from 'appwrite';

export interface Hospedaje {
  $id?: string;
  nombre: string;
  categoria: 'hoteles' | 'hostales' | 'casas-rurales' | 'lodges';
  descripcion: string;
  amenidades: string[];
  precioPorNoche: number;
  rating: number;
  reviews: number;
  ubicacion: string;
  imagen: string;
  destacado?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class HospedajeService {
  private db = AppwriteDatabases;
  private databaseId = environment.appwriteDatabaseId;
  private collectionId = environment.appwriteCollections.hospedajes;

  hospedajes = signal<Hospedaje[]>([]);
  isLoading = signal<boolean>(false);
  error = signal<string | null>(null);

  constructor() {
    this.loadHospedajes();
  }

  /**
   * Cargar todos los hospedajes
   */
  async loadHospedajes(): Promise<void> {
    try {
      this.isLoading.set(true);
      this.error.set(null);
      
      const response = await this.db.listDocuments(
        this.databaseId,
        this.collectionId,
        [Query.orderDesc('rating'), Query.limit(100)]
      );
      
      this.hospedajes.set(response.documents as unknown as Hospedaje[]);
    } catch (error: any) {
      this.error.set(error.message || 'Error al cargar hospedajes');
      console.error('Error loading hospedajes:', error);
    } finally {
      this.isLoading.set(false);
    }
  }

  /**
   * Obtener un hospedaje por ID
   */
  async getHospedaje(id: string): Promise<Hospedaje | null> {
    try {
      const response = await this.db.getDocument(
        this.databaseId,
        this.collectionId,
        id
      );
      return response as unknown as Hospedaje;
    } catch (error: any) {
      console.error('Error getting hospedaje:', error);
      return null;
    }
  }

  /**
   * Crear un nuevo hospedaje
   */
  async createHospedaje(hospedaje: Omit<Hospedaje, '$id'>): Promise<Hospedaje | null> {
    try {
      const response = await this.db.createDocument(
        this.databaseId,
        this.collectionId,
        ID.unique(),
        hospedaje
      );
      
      await this.loadHospedajes();
      return response as unknown as Hospedaje;
    } catch (error: any) {
      this.error.set(error.message || 'Error al crear hospedaje');
      console.error('Error creating hospedaje:', error);
      return null;
    }
  }

  /**
   * Actualizar un hospedaje
   */
  async updateHospedaje(id: string, data: Partial<Hospedaje>): Promise<Hospedaje | null> {
    try {
      const response = await this.db.updateDocument(
        this.databaseId,
        this.collectionId,
        id,
        data
      );
      
      await this.loadHospedajes();
      return response as unknown as Hospedaje;
    } catch (error: any) {
      this.error.set(error.message || 'Error al actualizar hospedaje');
      console.error('Error updating hospedaje:', error);
      return null;
    }
  }

  /**
   * Eliminar un hospedaje
   */
  async deleteHospedaje(id: string): Promise<boolean> {
    try {
      await this.db.deleteDocument(
        this.databaseId,
        this.collectionId,
        id
      );
      
      await this.loadHospedajes();
      return true;
    } catch (error: any) {
      this.error.set(error.message || 'Error al eliminar hospedaje');
      console.error('Error deleting hospedaje:', error);
      return false;
    }
  }

  /**
   * Filtrar por categoría
   */
  async filterByCategory(category: string): Promise<Hospedaje[]> {
    try {
      const response = await this.db.listDocuments(
        this.databaseId,
        this.collectionId,
        [Query.equal('categoria', category)]
      );
      
      return response.documents as unknown as Hospedaje[];
    } catch (error: any) {
      console.error('Error filtering hospedajes:', error);
      return [];
    }
  }
}

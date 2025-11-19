import { Injectable, signal } from '@angular/core';
import { AppwriteDatabases } from './appwrite.client';
import { environment } from '../../environments/environment';
import { ID, Query } from 'appwrite';

export interface Transporte {
  $id?: string;
  tipo: 'bus' | 'taxi' | 'privado' | 'compartido';
  nombre: string;
  descripcion: string;
  origen: string;
  destino: string;
  precio: number;
  duracion: string;
  horarios?: string[];
  capacidad?: number;
  caracteristicas?: string[];
  imagen?: string;
  disponible: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class TransporteService {
  private db = AppwriteDatabases;
  private databaseId = environment.appwriteDatabaseId;
  private collectionId = environment.appwriteCollections.transportes;

  transportes = signal<Transporte[]>([]);
  isLoading = signal<boolean>(false);
  error = signal<string | null>(null);

  constructor() {
    this.loadTransportes();
  }

  /**
   * Cargar todos los transportes
   */
  async loadTransportes(): Promise<void> {
    try {
      this.isLoading.set(true);
      this.error.set(null);
      
      const response = await this.db.listDocuments(
        this.databaseId,
        this.collectionId,
        [
          Query.equal('disponible', true),
          Query.orderAsc('precio'),
          Query.limit(100)
        ]
      );
      
      this.transportes.set(response.documents as unknown as Transporte[]);
    } catch (error: any) {
      this.error.set(error.message || 'Error al cargar transportes');
      console.error('Error loading transportes:', error);
    } finally {
      this.isLoading.set(false);
    }
  }

  /**
   * Obtener un transporte por ID
   */
  async getTransporte(id: string): Promise<Transporte | null> {
    try {
      const response = await this.db.getDocument(
        this.databaseId,
        this.collectionId,
        id
      );
      return response as unknown as Transporte;
    } catch (error: any) {
      console.error('Error getting transporte:', error);
      return null;
    }
  }

  /**
   * Crear un nuevo transporte
   */
  async createTransporte(transporte: Omit<Transporte, '$id'>): Promise<Transporte | null> {
    try {
      const response = await this.db.createDocument(
        this.databaseId,
        this.collectionId,
        ID.unique(),
        transporte
      );
      
      await this.loadTransportes();
      return response as unknown as Transporte;
    } catch (error: any) {
      this.error.set(error.message || 'Error al crear transporte');
      console.error('Error creating transporte:', error);
      return null;
    }
  }

  /**
   * Actualizar un transporte
   */
  async updateTransporte(id: string, data: Partial<Transporte>): Promise<Transporte | null> {
    try {
      const response = await this.db.updateDocument(
        this.databaseId,
        this.collectionId,
        id,
        data
      );
      
      await this.loadTransportes();
      return response as unknown as Transporte;
    } catch (error: any) {
      this.error.set(error.message || 'Error al actualizar transporte');
      console.error('Error updating transporte:', error);
      return null;
    }
  }

  /**
   * Eliminar un transporte
   */
  async deleteTransporte(id: string): Promise<boolean> {
    try {
      await this.db.deleteDocument(
        this.databaseId,
        this.collectionId,
        id
      );
      
      await this.loadTransportes();
      return true;
    } catch (error: any) {
      this.error.set(error.message || 'Error al eliminar transporte');
      console.error('Error deleting transporte:', error);
      return false;
    }
  }

  /**
   * Filtrar por tipo
   */
  async filterByType(type: string): Promise<Transporte[]> {
    try {
      const response = await this.db.listDocuments(
        this.databaseId,
        this.collectionId,
        [
          Query.equal('tipo', type),
          Query.equal('disponible', true)
        ]
      );
      
      return response.documents as unknown as Transporte[];
    } catch (error: any) {
      console.error('Error filtering transportes:', error);
      return [];
    }
  }
}

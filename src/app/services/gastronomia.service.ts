import { Injectable, signal } from '@angular/core';
import { AppwriteDatabases } from './appwrite.client';
import { environment } from '../../environments/environment';
import { ID, Query } from 'appwrite';

export interface Establecimiento {
  $id?: string;
  nombre: string;
  categoria: 'restaurantes' | 'bares' | 'cafeterias' | 'street-food';
  nivelPrecio: 'económico' | 'moderado' | 'premium';
  descripcion: string;
  especialidades: string;
  horario: string;
  ubicacion: string;
  rating: number;
  imagen: string;
  caracteristicas?: string[];
}

@Injectable({
  providedIn: 'root'
})
export class GastronomiaService {
  private db = AppwriteDatabases;
  private databaseId = environment.appwriteDatabaseId;
  private collectionId = environment.appwriteCollections.gastronomia;

  establecimientos = signal<Establecimiento[]>([]);
  isLoading = signal<boolean>(false);
  error = signal<string | null>(null);

  constructor() {
    this.loadEstablecimientos();
  }

  /**
   * Cargar todos los establecimientos
   */
  async loadEstablecimientos(): Promise<void> {
    try {
      this.isLoading.set(true);
      this.error.set(null);
      
      const response = await this.db.listDocuments(
        this.databaseId,
        this.collectionId,
        [Query.orderDesc('rating'), Query.limit(100)]
      );
      
      this.establecimientos.set(response.documents as unknown as Establecimiento[]);
    } catch (error: any) {
      this.error.set(error.message || 'Error al cargar establecimientos');
      console.error('Error loading establecimientos:', error);
    } finally {
      this.isLoading.set(false);
    }
  }

  /**
   * Obtener un establecimiento por ID
   */
  async getEstablecimiento(id: string): Promise<Establecimiento | null> {
    try {
      const response = await this.db.getDocument(
        this.databaseId,
        this.collectionId,
        id
      );
      return response as unknown as Establecimiento;
    } catch (error: any) {
      console.error('Error getting establecimiento:', error);
      return null;
    }
  }

  /**
   * Crear un nuevo establecimiento
   */
  async createEstablecimiento(
    establecimiento: Omit<Establecimiento, '$id'>
  ): Promise<Establecimiento | null> {
    try {
      const response = await this.db.createDocument(
        this.databaseId,
        this.collectionId,
        ID.unique(),
        establecimiento
      );
      
      await this.loadEstablecimientos();
      return response as unknown as Establecimiento;
    } catch (error: any) {
      this.error.set(error.message || 'Error al crear establecimiento');
      console.error('Error creating establecimiento:', error);
      return null;
    }
  }

  /**
   * Actualizar un establecimiento
   */
  async updateEstablecimiento(
    id: string,
    data: Partial<Establecimiento>
  ): Promise<Establecimiento | null> {
    try {
      const response = await this.db.updateDocument(
        this.databaseId,
        this.collectionId,
        id,
        data
      );
      
      await this.loadEstablecimientos();
      return response as unknown as Establecimiento;
    } catch (error: any) {
      this.error.set(error.message || 'Error al actualizar establecimiento');
      console.error('Error updating establecimiento:', error);
      return null;
    }
  }

  /**
   * Eliminar un establecimiento
   */
  async deleteEstablecimiento(id: string): Promise<boolean> {
    try {
      await this.db.deleteDocument(
        this.databaseId,
        this.collectionId,
        id
      );
      
      await this.loadEstablecimientos();
      return true;
    } catch (error: any) {
      this.error.set(error.message || 'Error al eliminar establecimiento');
      console.error('Error deleting establecimiento:', error);
      return false;
    }
  }

  /**
   * Filtrar por categoría y precio
   */
  async filterByCategoryAndPrice(
    category?: string,
    priceLevel?: string
  ): Promise<Establecimiento[]> {
    try {
      const queries: any[] = [];
      
      if (category && category !== 'all') {
        queries.push(Query.equal('categoria', category));
      }
      
      if (priceLevel && priceLevel !== 'all') {
        queries.push(Query.equal('nivelPrecio', priceLevel));
      }
      
      const response = await this.db.listDocuments(
        this.databaseId,
        this.collectionId,
        queries
      );
      
      return response.documents as unknown as Establecimiento[];
    } catch (error: any) {
      console.error('Error filtering establecimientos:', error);
      return [];
    }
  }
}

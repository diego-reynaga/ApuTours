import { Injectable, signal } from '@angular/core';
import { AppwriteDatabases } from './appwrite.client';
import { environment } from '../../environments/environment';
import { ID, Query } from 'appwrite';

export interface Reserva {
  $id?: string;
  userId: string;
  tipo: 'package' | 'destination' | 'accommodation' | 'transport' | 'gastronomy';
  destinoId?: string;
  destinoNombre?: string;
  fechaInicio: string;
  fechaFin: string;
  adultos: number;
  ninos: number;
  precioUnitario: number;
  precioTotal: number;
  estado: 'pendiente' | 'confirmada' | 'cancelada';
  nombreCompleto: string;
  email: string;
  telefono: string;
  documento: string;
  solicitudesEspeciales?: string;
  codigoConfirmacion?: string;
  $createdAt?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ReservasService {
  private db = AppwriteDatabases;
  private databaseId = environment.appwriteDatabaseId;
  private collectionId = environment.appwriteCollections.reservas;

  reservas = signal<Reserva[]>([]);
  isLoading = signal<boolean>(false);
  error = signal<string | null>(null);

  /**
   * Cargar reservas del usuario actual
   */
  async loadUserReservas(userId: string): Promise<void> {
    try {
      this.isLoading.set(true);
      this.error.set(null);
      
      const response = await this.db.listDocuments(
        this.databaseId,
        this.collectionId,
        [
          Query.equal('userId', userId),
          Query.orderDesc('$createdAt'),
          Query.limit(100)
        ]
      );
      
      this.reservas.set(response.documents as unknown as Reserva[]);
    } catch (error: any) {
      this.error.set(error.message || 'Error al cargar reservas');
      console.error('Error loading reservas:', error);
    } finally {
      this.isLoading.set(false);
    }
  }

  /**
   * Obtener una reserva por ID
   */
  async getReserva(id: string): Promise<Reserva | null> {
    try {
      const response = await this.db.getDocument(
        this.databaseId,
        this.collectionId,
        id
      );
      return response as unknown as Reserva;
    } catch (error: any) {
      console.error('Error getting reserva:', error);
      return null;
    }
  }

  /**
   * Crear una nueva reserva
   */
  async createReserva(reserva: Omit<Reserva, '$id' | '$createdAt'>): Promise<Reserva | null> {
    try {
      // Generar código de confirmación de 10 caracteres alfanuméricos
      const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
      let codigo = 'APU';
      for (let i = 0; i < 7; i++) {
        codigo += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      
      const response = await this.db.createDocument(
        this.databaseId,
        this.collectionId,
        ID.unique(),
        {
          ...reserva,
          codigoConfirmacion: codigo,
          estado: 'pendiente'
        }
      );
      
      return response as unknown as Reserva;
    } catch (error: any) {
      this.error.set(error.message || 'Error al crear reserva');
      console.error('Error creating reserva:', error);
      return null;
    }
  }

  /**
   * Actualizar estado de una reserva
   */
  async updateReservaStatus(
    id: string,
    estado: 'pendiente' | 'confirmada' | 'cancelada'
  ): Promise<Reserva | null> {
    try {
      const response = await this.db.updateDocument(
        this.databaseId,
        this.collectionId,
        id,
        { estado }
      );
      
      return response as unknown as Reserva;
    } catch (error: any) {
      this.error.set(error.message || 'Error al actualizar reserva');
      console.error('Error updating reserva:', error);
      return null;
    }
  }

  /**
   * Cancelar una reserva
   */
  async cancelReserva(id: string): Promise<boolean> {
    try {
      await this.db.updateDocument(
        this.databaseId,
        this.collectionId,
        id,
        { estado: 'cancelada' }
      );
      
      return true;
    } catch (error: any) {
      this.error.set(error.message || 'Error al cancelar reserva');
      console.error('Error canceling reserva:', error);
      return false;
    }
  }

  /**
   * Buscar reserva por código de confirmación
   */
  async findByConfirmationCode(code: string): Promise<Reserva | null> {
    try {
      const response = await this.db.listDocuments(
        this.databaseId,
        this.collectionId,
        [Query.equal('codigoConfirmacion', code)]
      );
      
      if (response.documents.length > 0) {
        return response.documents[0] as unknown as Reserva;
      }
      
      return null;
    } catch (error: any) {
      console.error('Error finding reserva:', error);
      return null;
    }
  }
}

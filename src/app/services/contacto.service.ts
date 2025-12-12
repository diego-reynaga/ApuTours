import { Injectable, signal } from '@angular/core';
import { AppwriteDatabases, AppwriteFunctions } from './appwrite.client';
import { environment } from '../../environments/environment';
import { ID } from 'appwrite';

export interface MensajeContacto {
  $id?: string;
  nombre: string;
  email: string;
  telefono?: string;
  asunto: string;
  mensaje: string;
  estado: 'pendiente' | 'leido' | 'respondido';
  fechaEnvio?: string;
  $createdAt?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ContactoService {
  private db = AppwriteDatabases;
  private functions = AppwriteFunctions;
  private databaseId = environment.appwriteDatabaseId;
  private collectionId = environment.appwriteCollections.contactos;

  isLoading = signal<boolean>(false);
  error = signal<string | null>(null);

  /**
   * Enviar mensaje de contacto
   * Guarda en Appwrite y envía notificación por correo
   */
  async enviarMensaje(mensaje: Omit<MensajeContacto, '$id' | '$createdAt' | 'estado' | 'fechaEnvio'>): Promise<MensajeContacto | null> {
    try {
      this.isLoading.set(true);
      this.error.set(null);

      // Guardar mensaje en la base de datos
      const response = await this.db.createDocument(
        this.databaseId,
        this.collectionId,
        ID.unique(),
        {
          ...mensaje,
          estado: 'pendiente',
          fechaEnvio: new Date().toISOString()
        }
      );

      // Enviar correo vía Appwrite Function (si está configurada)
      await this.enviarNotificacionPorFunction({
        mensajeId: (response as any)?.$id,
        ...mensaje
      });

      return response as unknown as MensajeContacto;
    } catch (error: any) {
      this.error.set(error.message || 'Error al enviar mensaje');
      console.error('Error sending contact message:', error);
      return null;
    } finally {
      this.isLoading.set(false);
    }
  }

  private async enviarNotificacionPorFunction(payload: {
    mensajeId?: string;
    nombre: string;
    email: string;
    telefono?: string;
    asunto: string;
    mensaje: string;
  }): Promise<void> {
    try {
      const functionId = environment.appwriteFunctions?.sendContactEmailFunctionId;
      if (!functionId) {
        console.warn('Appwrite Function no configurada (sendContactEmailFunctionId).');
        return;
      }

      // La Function debe tener permisos para ser ejecutada por el cliente (p.ej. any/authenticated)
      await this.functions.createExecution(
        functionId,
        JSON.stringify(payload),
        false
      );
    } catch (error) {
      console.error('Error enviando notificación por Appwrite Function:', error);
    }
  }
}

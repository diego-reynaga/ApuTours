import { Injectable, signal } from '@angular/core';
import { AppwriteDatabases } from './appwrite.client';
import { environment } from '../../environments/environment';
import { ID, Query } from 'appwrite';

export type TipoServicio = 'hospedaje' | 'gastronomia' | 'transporte' | 'tour' | 'paquete';
export type EstadoComprobante = 'pendiente' | 'pagado' | 'verificado' | 'rechazado' | 'cancelado';

export interface Comprobante {
  $id?: string;
  codigoComprobante: string;
  codigoVerificacion: string;
  reservaId: string;
  userId: string;
  tipoServicio: TipoServicio;
  proveedorId?: string;
  proveedorNombre: string;
  
  // Datos del cliente
  clienteNombre: string;
  clienteEmail: string;
  clienteDocumento: string;
  clienteTelefono: string;
  
  // Detalles del servicio
  descripcionServicio: string;
  fechaServicio: string;
  fechaFinServicio?: string;
  cantidadPersonas: number;
  
  // Montos
  subtotal: number;
  impuestos: number;
  descuento: number;
  total: number;
  
  // Estado y verificación
  estado: EstadoComprobante;
  metodoPago: string;
  fechaPago?: string;
  verificadoPor?: string;
  fechaVerificacion?: string;
  notasVerificacion?: string;
  
  // Metadatos
  hashSeguridad: string;
  $createdAt?: string;
}

export interface VerificacionResult {
  esValido: boolean;
  comprobante?: Comprobante;
  mensaje: string;
  detalles?: {
    estado: EstadoComprobante;
    fechaEmision: string;
    proveedor: string;
    tipoServicio: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class ComprobantesService {
  private db = AppwriteDatabases;
  private databaseId = environment.appwriteDatabaseId;
  private collectionId = environment.appwriteCollections.comprobantes;

  comprobantes = signal<Comprobante[]>([]);
  isLoading = signal<boolean>(false);
  error = signal<string | null>(null);

  /**
   * Generar código de comprobante único
   * Formato: APU + tipo (1 letra) + fecha (4 dígitos) + secuencia (4 chars) = 12 chars
   */
  private generarCodigoComprobante(tipo: TipoServicio): string {
    const prefijos: Record<TipoServicio, string> = {
      hospedaje: 'H',
      gastronomia: 'G',
      transporte: 'T',
      tour: 'D',
      paquete: 'P'
    };
    
    const fecha = new Date();
    const mes = (fecha.getMonth() + 1).toString().padStart(2, '0');
    const dia = fecha.getDate().toString().padStart(2, '0');
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let secuencia = '';
    for (let i = 0; i < 4; i++) {
      secuencia += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    
    return `APU${prefijos[tipo]}${mes}${dia}${secuencia}`;
  }

  /**
   * Generar código de verificación único
   * Código alfanumérico de 10 caracteres
   */
  private generarCodigoVerificacion(): string {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Sin caracteres ambiguos
    let codigo = 'VER';
    for (let i = 0; i < 7; i++) {
      codigo += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return codigo;
  }

  /**
   * Generar hash de seguridad para verificar integridad
   */
  private async generarHashSeguridad(datos: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(datos + environment.appwriteProjectId);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('').substring(0, 32);
  }

  /**
   * Crear un nuevo comprobante de pago
   */
  async crearComprobante(datos: {
    reservaId: string;
    userId: string;
    tipoServicio: TipoServicio;
    proveedorId?: string;
    proveedorNombre: string;
    clienteNombre: string;
    clienteEmail: string;
    clienteDocumento: string;
    clienteTelefono: string;
    descripcionServicio: string;
    fechaServicio: string;
    fechaFinServicio?: string;
    cantidadPersonas: number;
    subtotal: number;
    impuestos?: number;
    descuento?: number;
    metodoPago: string;
  }): Promise<Comprobante | null> {
    try {
      this.isLoading.set(true);
      this.error.set(null);

      const codigoComprobante = this.generarCodigoComprobante(datos.tipoServicio);
      const codigoVerificacion = this.generarCodigoVerificacion();
      
      const impuestos = datos.impuestos ?? datos.subtotal * 0.18; // IGV 18%
      const descuento = datos.descuento ?? 0;
      const total = datos.subtotal + impuestos - descuento;
      
      const hashData = `${codigoComprobante}|${codigoVerificacion}|${datos.clienteDocumento}|${total}`;
      const hashSeguridad = await this.generarHashSeguridad(hashData);

      const comprobanteData = {
        codigoComprobante,
        codigoVerificacion,
        reservaId: datos.reservaId,
        userId: datos.userId,
        tipoServicio: datos.tipoServicio,
        proveedorId: datos.proveedorId || '',
        proveedorNombre: datos.proveedorNombre,
        clienteNombre: datos.clienteNombre,
        clienteEmail: datos.clienteEmail,
        clienteDocumento: datos.clienteDocumento,
        clienteTelefono: datos.clienteTelefono,
        descripcionServicio: datos.descripcionServicio,
        fechaServicio: datos.fechaServicio,
        fechaFinServicio: datos.fechaFinServicio || '',
        cantidadPersonas: datos.cantidadPersonas,
        subtotal: datos.subtotal,
        impuestos,
        descuento,
        total,
        estado: 'pendiente' as EstadoComprobante,
        metodoPago: datos.metodoPago,
        fechaPago: '',
        verificadoPor: '',
        fechaVerificacion: '',
        notasVerificacion: '',
        hashSeguridad
      };

      const response = await this.db.createDocument(
        this.databaseId,
        this.collectionId,
        ID.unique(),
        comprobanteData
      );

      return response as unknown as Comprobante;
    } catch (error: any) {
      this.error.set(error.message || 'Error al crear comprobante');
      console.error('Error creating comprobante:', error);
      return null;
    } finally {
      this.isLoading.set(false);
    }
  }

  /**
   * Verificar un comprobante por código de verificación
   * Este método puede ser usado por cualquier proveedor
   */
  async verificarComprobante(codigoVerificacion: string): Promise<VerificacionResult> {
    try {
      this.isLoading.set(true);
      this.error.set(null);

      // Normalizar código (quitar guiones y espacios, convertir a mayúsculas)
      const codigoNormalizado = codigoVerificacion.replace(/[-\s]/g, '').toUpperCase().trim();
      
      console.log('🔍 Verificando código:', codigoNormalizado);
      console.log('📂 Database:', this.databaseId, '| Collection:', this.collectionId);

      // Buscar por el código normalizado
      const response = await this.db.listDocuments(
        this.databaseId,
        this.collectionId,
        [Query.equal('codigoVerificacion', codigoNormalizado)]
      );

      console.log('📋 Resultados encontrados:', response.total);

      if (response.documents.length === 0) {
        return {
          esValido: false,
          mensaje: 'Comprobante no encontrado. Verifica el código ingresado.'
        };
      }

      const comprobante = response.documents[0] as unknown as Comprobante;

      // Verificar hash de seguridad
      const hashData = `${comprobante.codigoComprobante}|${comprobante.codigoVerificacion}|${comprobante.clienteDocumento}|${comprobante.total}`;
      const hashCalculado = await this.generarHashSeguridad(hashData);

      if (hashCalculado !== comprobante.hashSeguridad) {
        return {
          esValido: false,
          mensaje: 'El comprobante ha sido alterado. Posible fraude detectado.',
          comprobante
        };
      }

      // Verificar estado
      if (comprobante.estado === 'cancelado') {
        return {
          esValido: false,
          mensaje: 'Este comprobante ha sido cancelado.',
          comprobante,
          detalles: {
            estado: comprobante.estado,
            fechaEmision: comprobante.$createdAt || '',
            proveedor: comprobante.proveedorNombre,
            tipoServicio: comprobante.tipoServicio
          }
        };
      }

      if (comprobante.estado === 'rechazado') {
        return {
          esValido: false,
          mensaje: 'Este comprobante fue rechazado.',
          comprobante,
          detalles: {
            estado: comprobante.estado,
            fechaEmision: comprobante.$createdAt || '',
            proveedor: comprobante.proveedorNombre,
            tipoServicio: comprobante.tipoServicio
          }
        };
      }

      return {
        esValido: true,
        comprobante,
        mensaje: comprobante.estado === 'verificado' 
          ? 'Comprobante válido y ya verificado anteriormente.'
          : 'Comprobante válido. Puede proceder con el servicio.',
        detalles: {
          estado: comprobante.estado,
          fechaEmision: comprobante.$createdAt || '',
          proveedor: comprobante.proveedorNombre,
          tipoServicio: comprobante.tipoServicio
        }
      };
    } catch (error: any) {
      this.error.set(error.message || 'Error al verificar comprobante');
      console.error('Error verifying comprobante:', error);
      return {
        esValido: false,
        mensaje: 'Error al verificar el comprobante. Intente nuevamente.'
      };
    } finally {
      this.isLoading.set(false);
    }
  }

  /**
   * Marcar comprobante como verificado por un proveedor
   */
  async marcarComoVerificado(
    comprobanteId: string, 
    verificadoPor: string,
    notas?: string
  ): Promise<Comprobante | null> {
    try {
      this.isLoading.set(true);

      const response = await this.db.updateDocument(
        this.databaseId,
        this.collectionId,
        comprobanteId,
        {
          estado: 'verificado',
          verificadoPor,
          fechaVerificacion: new Date().toISOString(),
          notasVerificacion: notas || ''
        }
      );

      return response as unknown as Comprobante;
    } catch (error: any) {
      this.error.set(error.message || 'Error al verificar comprobante');
      console.error('Error marking comprobante as verified:', error);
      return null;
    } finally {
      this.isLoading.set(false);
    }
  }

  /**
   * Rechazar un comprobante
   */
  async rechazarComprobante(
    comprobanteId: string,
    verificadoPor: string,
    motivo: string
  ): Promise<Comprobante | null> {
    try {
      this.isLoading.set(true);

      const response = await this.db.updateDocument(
        this.databaseId,
        this.collectionId,
        comprobanteId,
        {
          estado: 'rechazado',
          verificadoPor,
          fechaVerificacion: new Date().toISOString(),
          notasVerificacion: motivo
        }
      );

      return response as unknown as Comprobante;
    } catch (error: any) {
      this.error.set(error.message || 'Error al rechazar comprobante');
      console.error('Error rejecting comprobante:', error);
      return null;
    } finally {
      this.isLoading.set(false);
    }
  }

  /**
   * Actualizar estado de pago
   */
  async marcarComoPagado(comprobanteId: string): Promise<Comprobante | null> {
    try {
      this.isLoading.set(true);

      const response = await this.db.updateDocument(
        this.databaseId,
        this.collectionId,
        comprobanteId,
        {
          estado: 'pagado',
          fechaPago: new Date().toISOString()
        }
      );

      return response as unknown as Comprobante;
    } catch (error: any) {
      this.error.set(error.message || 'Error al actualizar pago');
      console.error('Error marking as paid:', error);
      return null;
    } finally {
      this.isLoading.set(false);
    }
  }

  /**
   * Obtener comprobante por ID
   */
  async obtenerComprobante(id: string): Promise<Comprobante | null> {
    try {
      const response = await this.db.getDocument(
        this.databaseId,
        this.collectionId,
        id
      );
      return response as unknown as Comprobante;
    } catch (error: any) {
      console.error('Error getting comprobante:', error);
      return null;
    }
  }

  /**
   * Obtener comprobantes del usuario
   */
  async obtenerComprobantesUsuario(userId: string): Promise<Comprobante[]> {
    try {
      this.isLoading.set(true);

      const response = await this.db.listDocuments(
        this.databaseId,
        this.collectionId,
        [
          Query.equal('userId', userId),
          Query.orderDesc('$createdAt'),
          Query.limit(100)
        ]
      );

      const comprobantes = response.documents as unknown as Comprobante[];
      this.comprobantes.set(comprobantes);
      return comprobantes;
    } catch (error: any) {
      console.error('Error loading user comprobantes:', error);
      return [];
    } finally {
      this.isLoading.set(false);
    }
  }

  /**
   * Obtener comprobantes por proveedor (para rol de negocio)
   */
  async obtenerComprobantesProveedor(proveedorId: string): Promise<Comprobante[]> {
    try {
      this.isLoading.set(true);

      const response = await this.db.listDocuments(
        this.databaseId,
        this.collectionId,
        [
          Query.equal('proveedorId', proveedorId),
          Query.orderDesc('$createdAt'),
          Query.limit(100)
        ]
      );

      return response.documents as unknown as Comprobante[];
    } catch (error: any) {
      console.error('Error loading provider comprobantes:', error);
      return [];
    } finally {
      this.isLoading.set(false);
    }
  }
}

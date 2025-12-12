import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Navbar } from '../../components/navbar/navbar';
import { Footer } from '../../components/footer/footer';
import { ComprobantesService, Comprobante, VerificacionResult } from '../../services/comprobantes.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-verificar-comprobante',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, Navbar, Footer],
  templateUrl: './verificar-comprobante.html',
  styleUrl: './verificar-comprobante.css',
})
export class VerificarComprobante {
  private comprobantesService = inject(ComprobantesService);
  private authService = inject(AuthService);

  // Verificar acceso
  isAuthenticated = this.authService.isAuthenticated;
  isLoadingAuth = this.authService.isLoading;
  currentUser = this.authService.currentUser;
  
  // Computed para verificar si tiene acceso (usa labels de Appwrite Auth)
  hasAccess = computed(() => {
    return this.authService.canVerifyComprobantes();
  });

  // Estado del formulario
  codigoVerificacion = '';
  isLoading = signal<boolean>(false);
  
  // Resultado de verificación
  verificacionRealizada = signal<boolean>(false);
  resultadoVerificacion = signal<VerificacionResult | null>(null);
  
  // Estado para marcar como verificado
  notasVerificacion = '';
  motivoRechazo = '';
  showAcciones = signal<boolean>(false);
  accionEnProceso = signal<boolean>(false);
  accionCompletada = signal<boolean>(false);
  mensajeAccion = signal<string>('');

  // Formatear código mientras se escribe
  formatearCodigo(): void {
    // Remover caracteres no válidos
    let codigo = this.codigoVerificacion.replace(/[^A-Za-z0-9]/g, '').toUpperCase();
    
    // No agregar guiones, mantener código simple de 10 caracteres
    // Limitar a 10 caracteres
    this.codigoVerificacion = codigo.substring(0, 10);
  }

  async verificar(): Promise<void> {
    if (!this.codigoVerificacion || this.codigoVerificacion.length < 10) {
      return;
    }

    this.isLoading.set(true);
    this.verificacionRealizada.set(false);
    this.showAcciones.set(false);
    this.accionCompletada.set(false);

    try {
      const resultado = await this.comprobantesService.verificarComprobante(this.codigoVerificacion);
      this.resultadoVerificacion.set(resultado);
      this.verificacionRealizada.set(true);
      
      // Mostrar acciones si el comprobante es válido y no está verificado/rechazado
      if (resultado.esValido && resultado.comprobante?.estado !== 'verificado') {
        this.showAcciones.set(true);
      }
    } catch (error) {
      console.error('Error en verificación:', error);
      this.resultadoVerificacion.set({
        esValido: false,
        mensaje: 'Error al verificar el comprobante. Intente nuevamente.'
      });
      this.verificacionRealizada.set(true);
    } finally {
      this.isLoading.set(false);
    }
  }

  async confirmarServicio(): Promise<void> {
    const resultado = this.resultadoVerificacion();
    if (!resultado?.comprobante?.$id) return;

    this.accionEnProceso.set(true);
    const usuario = this.authService.currentUser();
    const verificadoPor = usuario?.name || 'Proveedor';

    try {
      const comprobante = await this.comprobantesService.marcarComoVerificado(
        resultado.comprobante.$id,
        verificadoPor,
        this.notasVerificacion
      );

      if (comprobante) {
        this.accionCompletada.set(true);
        this.mensajeAccion.set('✅ Servicio confirmado exitosamente. El comprobante ha sido verificado.');
        this.showAcciones.set(false);
        
        // Actualizar el resultado
        this.resultadoVerificacion.set({
          ...resultado,
          comprobante: comprobante,
          mensaje: 'Comprobante verificado exitosamente.'
        });
      }
    } catch (error) {
      console.error('Error al confirmar:', error);
      this.mensajeAccion.set('❌ Error al confirmar el servicio. Intente nuevamente.');
    } finally {
      this.accionEnProceso.set(false);
    }
  }

  async rechazarComprobante(): Promise<void> {
    const resultado = this.resultadoVerificacion();
    if (!resultado?.comprobante?.$id || !this.motivoRechazo) {
      this.mensajeAccion.set('⚠️ Debe indicar el motivo del rechazo.');
      return;
    }

    this.accionEnProceso.set(true);
    const usuario = this.authService.currentUser();
    const verificadoPor = usuario?.name || 'Proveedor';

    try {
      const comprobante = await this.comprobantesService.rechazarComprobante(
        resultado.comprobante.$id,
        verificadoPor,
        this.motivoRechazo
      );

      if (comprobante) {
        this.accionCompletada.set(true);
        this.mensajeAccion.set('⛔ Comprobante rechazado. Se ha notificado al cliente.');
        this.showAcciones.set(false);
        
        // Actualizar el resultado
        this.resultadoVerificacion.set({
          ...resultado,
          esValido: false,
          comprobante: comprobante,
          mensaje: 'Comprobante rechazado.'
        });
      }
    } catch (error) {
      console.error('Error al rechazar:', error);
      this.mensajeAccion.set('❌ Error al rechazar el comprobante. Intente nuevamente.');
    } finally {
      this.accionEnProceso.set(false);
    }
  }

  limpiarFormulario(): void {
    this.codigoVerificacion = '';
    this.verificacionRealizada.set(false);
    this.resultadoVerificacion.set(null);
    this.showAcciones.set(false);
    this.notasVerificacion = '';
    this.motivoRechazo = '';
    this.accionCompletada.set(false);
    this.mensajeAccion.set('');
  }

  getTipoServicioLabel(tipo: string): string {
    const labels: Record<string, string> = {
      'hospedaje': 'Hospedaje',
      'gastronomia': 'Gastronomía',
      'transporte': 'Transporte',
      'tour': 'Tour',
      'paquete': 'Paquete Completo'
    };
    return labels[tipo] || tipo;
  }

  getEstadoClass(estado: string): string {
    const classes: Record<string, string> = {
      'pendiente': 'estado-pendiente',
      'pagado': 'estado-pagado',
      'verificado': 'estado-verificado',
      'rechazado': 'estado-rechazado',
      'cancelado': 'estado-cancelado'
    };
    return classes[estado] || '';
  }

  getEstadoLabel(estado: string): string {
    const labels: Record<string, string> = {
      'pendiente': 'Pendiente de Pago',
      'pagado': 'Pagado',
      'verificado': 'Verificado ✓',
      'rechazado': 'Rechazado',
      'cancelado': 'Cancelado'
    };
    return labels[estado] || estado;
  }

  formatDate(dateString: string | undefined): string {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('es-PE', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'PEN'
    }).format(amount);
  }
}

import { Component, signal, computed, inject, effect, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router, ActivatedRoute } from '@angular/router';
import { Navbar } from '../../components/navbar/navbar';
import { Footer } from '../../components/footer/footer';
import { ReservasService, Reserva } from '../../services/reservas.service';
import { AuthService } from '../../services/auth.service';
import { ComprobantesService, Comprobante, TipoServicio } from '../../services/comprobantes.service';
import { ComprobantePdfService } from '../../services/comprobante-pdf.service';

type ReservationType = 'package' | 'destination' | 'accommodation' | 'transport' | 'gastronomy';

interface ReservationDetails {
  startDate: string;
  endDate: string;
  adults: number;
  children: number;
  destination?: string;
}

interface PersonalInfo {
  fullName: string;
  email: string;
  phone: string;
  document: string;
  specialRequests?: string;
}

interface ReservationTypeOption {
  id: ReservationType;
  icon: string;
  title: string;
  subtitle: string;
  benefits: string[];
}

@Component({
  selector: 'app-reservas',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, Navbar, Footer],
  templateUrl: './reservas.html',
  styleUrl: './reservas.css',
})
export class Reservas implements OnInit {
  private reservasService = inject(ReservasService);
  private authService = inject(AuthService);
  private comprobantesService = inject(ComprobantesService);
  private comprobantePdfService = inject(ComprobantePdfService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  constructor() {
    // Inicializar fecha mínima como hoy en formato YYYY-MM-DD
    const today = new Date();
    this.minDate = today.toISOString().split('T')[0];
    
    effect(() => {
      const user = this.authService.currentUser();
      // Solo autocompletar si el usuario existe y los campos están vacíos
      if (user) {
        if (!this.personalInfo.fullName) this.personalInfo.fullName = user.name;
        if (!this.personalInfo.email) this.personalInfo.email = user.email;
      }
    });
  }

  ngOnInit(): void {
    // Leer parámetros de la URL para pre-seleccionar tipo y precio
    this.route.queryParams.subscribe(params => {
      if (params['tipo']) {
        const tipo = params['tipo'] as ReservationType;
        if (['package', 'destination', 'accommodation', 'transport'].includes(tipo)) {
          this.selectedType.set(tipo);
        }
      }
      if (params['nombre']) {
        this.servicioSeleccionado.set(params['nombre']);
      }
      if (params['precio']) {
        this.precioBase.set(Number(params['precio']) || 0);
      }
      if (params['id']) {
        this.servicioId.set(params['id']);
      }
    });
  }

  // Signals for state management
  currentStep = signal<number>(1);
  selectedType = signal<ReservationType>('package');
  isSubmitting = signal<boolean>(false);
  reservationComplete = signal<boolean>(false);
  confirmationCode = signal<string>('');
  verificationCode = signal<string>(''); // Código de verificación del comprobante
  comprobanteGenerado = signal<Comprobante | null>(null);
  metodoPago = signal<string>('transferencia');
  comprobanteError = signal<string>(''); // Error al crear comprobante
  reservaParaComprobante = signal<any>(null); // Reserva guardada para reintento
  
  // Trigger para forzar recálculo de computed() cuando cambian los datos del form
  formTrigger = signal<number>(0);
  
  // Datos del servicio seleccionado (desde queryParams)
  servicioSeleccionado = signal<string>('');
  precioBase = signal<number>(0);
  servicioId = signal<string>('');
  
  // Fecha mínima (hoy) para los inputs de fecha
  minDate: string;
  
  // Form Data (Plain objects for easier ngModel binding)
  reservationDetails: ReservationDetails = {
    startDate: '',
    endDate: '',
    adults: 1,
    children: 0
  };

  personalInfo: PersonalInfo = {
    fullName: '',
    email: '',
    phone: '',
    document: '',
    specialRequests: ''
  };

  // Computed values
  totalDays = computed(() => {
    // Leer el trigger para forzar recálculo cuando el formulario cambie
    this.formTrigger();
    const details = this.reservationDetails;
    if (!details.startDate || !details.endDate) return 0;
    const start = new Date(details.startDate);
    const end = new Date(details.endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    // Siempre al menos 1 día cuando hay fechas
    return Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
  });

  // Precio unitario por día y persona
  precioUnitario = computed(() => {
    const type = this.selectedType();
    const precioDesdeUrl = this.precioBase();
    
    // Usar precio de queryParams si existe, sino usar precios por defecto
    return precioDesdeUrl > 0 
      ? precioDesdeUrl 
      : (type === 'package' ? 250 : 
         type === 'destination' ? 80 :
         type === 'accommodation' ? 120 :
         type === 'gastronomy' ? 50 : 60);
  });

  estimatedPrice = computed(() => {
    // Leer el trigger para forzar recálculo cuando el formulario cambie
    this.formTrigger();
    const days = this.totalDays() || 1; // Mínimo 1 día
    const details = this.reservationDetails;
    const precioUnitario = Number(this.precioUnitario());
    const adultos = Number(details.adults) || 0;
    const ninos = Number(details.children) || 0;
    
    // Precio total: (precioUnitario * días * adultos) + (precioUnitario * 0.5 * días * niños)
    const totalAdultos = precioUnitario * days * adultos;
    const totalNinos = precioUnitario * 0.5 * days * ninos;
    
    return totalAdultos + totalNinos;
  });

  totalParticipants = computed(() => {
    // Leer el trigger para forzar recálculo cuando el formulario cambie
    this.formTrigger();
    const details = this.reservationDetails;
    return details.adults + details.children;
  });

  reservationTypes: ReservationTypeOption[] = [
    {
      id: 'package',
      icon: 'fa-gift',
      title: 'Paquete Completo',
      subtitle: 'Tour + Hospedaje + Transporte',
      benefits: ['Mejor precio', 'Todo incluido', 'Sin complicaciones']
    },
    {
      id: 'destination',
      icon: 'fa-map-marked-alt',
      title: 'Solo Destinos',
      subtitle: 'Tours a lugares específicos',
      benefits: ['Flexible', 'Personalizable', 'A tu medida']
    },
    {
      id: 'accommodation',
      icon: 'fa-bed',
      title: 'Solo Hospedaje',
      subtitle: 'Hoteles, hostales, lodges',
      benefits: ['Variedad', 'Todos los rangos', 'Ubicaciones premium']
    },
    {
      id: 'transport',
      icon: 'fa-car',
      title: 'Solo Transporte',
      subtitle: 'Traslados y movilidad',
      benefits: ['Puntual', 'Seguro', 'Cómodo']
    },
    {
      id: 'gastronomy',
      icon: 'fa-utensils',
      title: 'Gastronomía',
      subtitle: 'Experiencias culinarias',
      benefits: ['Sabores locales', 'Platos típicos', 'Experiencia única']
    }
  ];

  destinations = [
    'Laguna de Pacucha',
    'Complejo Arqueológico de Sondor',
    'Piedra de Sayhuite',
    'Pampachiri',
    'Huayhuaca',
    'Inca Huasi',
    'Tour Completo (Todos los destinos)'
  ];

  selectType(type: ReservationType): void {
    this.selectedType.set(type);
  }

  nextStep(): void {
    if (this.isStepValid(this.currentStep())) {
      this.currentStep.update(v => v + 1);
    }
  }

  previousStep(): void {
    if (this.currentStep() > 1) {
      this.currentStep.update(v => v - 1);
    }
  }

  isStepValid(step: number): boolean {
    const details = this.reservationDetails;
    const info = this.personalInfo;

    if (step === 1) {
      // Validar campos básicos primero
      if (!details.startDate || !details.endDate || details.adults <= 0) {
        return false;
      }
      
      // Validar que las fechas no sean pasadas usando comparación de strings YYYY-MM-DD
      const todayStr = this.minDate; // Ya está en formato YYYY-MM-DD
      
      // Comparación simple de strings (funciona porque YYYY-MM-DD ordena correctamente)
      const startDateValid = details.startDate >= todayStr;
      const endDateValid = details.endDate >= details.startDate;
      
      return startDateValid && endDateValid;
    }
    if (step === 2) {
      return !!(
        info.fullName &&
        info.email &&
        info.phone &&
        info.document
      );
    }
    return false;
  }

  async submitReservation(): Promise<void> {
    if (!this.isStepValid(2)) {
      return;
    }

    // Verificar si el usuario está autenticado
    const currentUser = this.authService.currentUser();
    if (!currentUser) {
      alert('Debes iniciar sesión para crear una reserva');
      this.router.navigate(['/login']);
      return;
    }

    this.isSubmitting.set(true);

    try {
      const details = this.reservationDetails;
      const info = this.personalInfo;

      // Calcular precio directamente aquí para asegurar valores correctos
      const adultos = Number(details.adults) || 0;
      const ninos = Number(details.children) || 0;
      const precioUnitario = this.precioUnitario();
      
      // Calcular días
      let dias = 1;
      if (details.startDate && details.endDate) {
        const start = new Date(details.startDate);
        const end = new Date(details.endDate);
        const diffTime = Math.abs(end.getTime() - start.getTime());
        dias = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
      }

      // Precio: adultos pagan 100%, niños pagan 50%
      const totalAdultos = precioUnitario * dias * adultos;
      const totalNinos = precioUnitario * 0.5 * dias * ninos;
      const precioCalculado = totalAdultos + totalNinos;
      
      console.log('💰 Cálculo de precio (en submit):');
      console.log('   Precio unitario:', precioUnitario);
      console.log('   Días:', dias);
      console.log('   Adultos:', adultos);
      console.log('   Niños:', ninos);
      console.log('   Total adultos:', totalAdultos);
      console.log('   Total niños (50%):', totalNinos);
      console.log('   SUBTOTAL:', precioCalculado);

      const reserva = await this.reservasService.createReserva({
        userId: currentUser.$id,
        tipo: this.selectedType(),
        destinoId: details.destination,
        destinoNombre: details.destination || 'Sin especificar',
        fechaInicio: details.startDate,
        fechaFin: details.endDate,
        adultos: Number(details.adults),
        ninos: Number(details.children),
        precioUnitario: this.precioUnitario(),
        precioTotal: precioCalculado,
        estado: 'pendiente',
        nombreCompleto: info.fullName,
        email: info.email,
        telefono: info.phone,
        documento: info.document,
        solicitudesEspeciales: info.specialRequests
      });

      if (reserva) {
        this.confirmationCode.set(reserva.codigoConfirmacion || '');
        
        // Guardar datos para posible reintento
        this.reservaParaComprobante.set({
          reserva,
          userId: currentUser.$id,
          info,
          details,
          tipoServicio: this.mapReservationTypeToTipoServicio(this.selectedType()),
          precioCalculado
        });
        
        // Generar comprobante de pago
        await this.generarComprobante();

        this.reservationComplete.set(true);
        this.currentStep.set(3);
      } else {
        alert('Error al crear la reserva. Por favor intenta nuevamente.');
      }
    } catch (error) {
      console.error('Error submitting reservation:', error);
      alert('Ocurrió un error al procesar tu reserva');
    } finally {
      this.isSubmitting.set(false);
    }
  }

  /**
   * Genera el comprobante de pago (puede ser llamado para reintentar)
   */
  async generarComprobante(): Promise<void> {
    const datos = this.reservaParaComprobante();
    if (!datos) return;

    this.comprobanteError.set('');
    
    try {
      const comprobante = await this.comprobantesService.crearComprobante({
        reservaId: datos.reserva.$id || '',
        userId: datos.userId,
        tipoServicio: datos.tipoServicio,
        proveedorNombre: 'ApuTours',
        clienteNombre: datos.info.fullName,
        clienteEmail: datos.info.email,
        clienteDocumento: datos.info.document,
        clienteTelefono: datos.info.phone,
        descripcionServicio: this.getDescripcionServicio(),
        fechaServicio: datos.details.startDate,
        fechaFinServicio: datos.details.endDate,
        cantidadPersonas: Number(datos.details.adults) + Number(datos.details.children),
        subtotal: datos.precioCalculado, // Precio base (se calcula IGV en el servicio)
        metodoPago: this.metodoPago()
      });

      if (comprobante) {
        this.comprobanteGenerado.set(comprobante);
        this.verificationCode.set(comprobante.codigoVerificacion);
        this.comprobanteError.set('');
        console.log('Comprobante generado:', comprobante);
      } else {
        const errorMsg = this.comprobantesService.error() || 'Error desconocido al crear comprobante';
        this.comprobanteError.set(errorMsg);
        console.warn('No se pudo generar el comprobante:', errorMsg);
      }
    } catch (comprobanteError: any) {
      const errorMsg = comprobanteError?.message || 'Error al conectar con el servidor';
      this.comprobanteError.set(errorMsg);
      console.error('Error al generar comprobante:', comprobanteError);
    }
  }

  /**
   * Reintenta generar el comprobante si falló
   */
  async reintentarComprobante(): Promise<void> {
    this.isSubmitting.set(true);
    await this.generarComprobante();
    this.isSubmitting.set(false);
  }

  private mapReservationTypeToTipoServicio(type: ReservationType): TipoServicio {
    const mapping: Record<ReservationType, TipoServicio> = {
      'package': 'paquete',
      'destination': 'tour',
      'accommodation': 'hospedaje',
      'transport': 'transporte',
      'gastronomy': 'gastronomia'
    };
    return mapping[type];
  }

  private getDescripcionServicio(): string {
    const type = this.selectedType();
    const details = this.reservationDetails;
    
    const tipoLabel = type === 'package' ? 'Paquete Completo' :
                      type === 'destination' ? 'Tour a ' + (details.destination || 'Destino') :
                      type === 'accommodation' ? 'Hospedaje' :
                      type === 'gastronomy' ? 'Gastronomía' : 'Transporte';
    
    return `${tipoLabel} - ${details.adults} adulto(s)${details.children > 0 ? ` y ${details.children} niño(s)` : ''} - Del ${details.startDate} al ${details.endDate}`;
  }

  setMetodoPago(metodo: string): void {
    this.metodoPago.set(metodo);
  }

  async descargarComprobantePdf(): Promise<void> {
    const comprobante = this.comprobanteGenerado();
    if (!comprobante) return;
    await this.comprobantePdfService.descargarComprobante(comprobante);
  }

  resetForm(): void {
    this.currentStep.set(1);
    this.selectedType.set('package');
    this.reservationDetails = {
      startDate: '',
      endDate: '',
      adults: 1,
      children: 0
    };
    this.personalInfo = {
      fullName: '',
      email: '',
      phone: '',
      document: '',
      specialRequests: ''
    };
    this.reservationComplete.set(false);
    this.confirmationCode.set('');
    this.verificationCode.set('');
    this.comprobanteGenerado.set(null);
    this.metodoPago.set('transferencia');
    this.comprobanteError.set('');
    this.reservaParaComprobante.set(null);
    this.formTrigger.set(0);
  }

  /**
   * Llamar cuando cambia cualquier campo del formulario para forzar recálculo
   */
  onFormChange(): void {
    this.formTrigger.update(v => v + 1);
  }
}

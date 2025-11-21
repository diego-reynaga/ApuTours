import { Component, signal, computed, inject, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { Navbar } from '../../components/navbar/navbar';
import { Footer } from '../../components/footer/footer';
import { ReservasService, Reserva } from '../../services/reservas.service';
import { AuthService } from '../../services/auth.service';

type ReservationType = 'package' | 'destination' | 'accommodation' | 'transport';

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
export class Reservas {
  private reservasService = inject(ReservasService);
  private authService = inject(AuthService);
  private router = inject(Router);

  constructor() {
    effect(() => {
      const user = this.authService.currentUser();
      // Solo autocompletar si el usuario existe y los campos están vacíos
      if (user) {
        if (!this.personalInfo.fullName) this.personalInfo.fullName = user.name;
        if (!this.personalInfo.email) this.personalInfo.email = user.email;
      }
    });
  }

  // Signals for state management
  currentStep = signal<number>(1);
  selectedType = signal<ReservationType>('package');
  isSubmitting = signal<boolean>(false);
  reservationComplete = signal<boolean>(false);
  confirmationCode = signal<string>('');
  
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
    const details = this.reservationDetails;
    if (!details.startDate || !details.endDate) return 0;
    
    const start = new Date(details.startDate);
    const end = new Date(details.endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  });

  estimatedPrice = computed(() => {
    const days = this.totalDays();
    const details = this.reservationDetails;
    const type = this.selectedType();
    
    const basePrice = type === 'package' ? 250 : 
                      type === 'destination' ? 80 :
                      type === 'accommodation' ? 120 : 60;
    
    return (basePrice * days * details.adults) + 
           (basePrice * 0.5 * days * details.children);
  });

  totalParticipants = computed(() => {
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
      return !!(
        details.startDate &&
        details.endDate &&
        details.adults > 0
      );
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

      const reserva = await this.reservasService.createReserva({
        userId: currentUser.$id,
        tipo: this.selectedType(),
        destinoId: details.destination,
        destinoNombre: details.destination || 'Sin especificar',
        fechaInicio: details.startDate,
        fechaFin: details.endDate,
        adultos: details.adults,
        ninos: details.children,
        precioTotal: this.estimatedPrice(),
        estado: 'pendiente',
        nombreCompleto: info.fullName,
        email: info.email,
        telefono: info.phone,
        documento: info.document,
        solicitudesEspeciales: info.specialRequests
      });

      if (reserva) {
        this.confirmationCode.set(reserva.codigoConfirmacion || '');
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
  }
}

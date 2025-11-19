import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { Navbar } from '../../components/navbar/navbar';
import { Footer } from '../../components/footer/footer';
import { ReservasService } from '../../services/reservas.service';
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
  imports: [CommonModule, FormsModule, RouterLink, Navbar, Footer],
  templateUrl: './reservas.html',
  styleUrl: './reservas.css',
})
export class Reservas {
  currentStep = 1;
  selectedType: ReservationType = 'package';
  
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

  isSubmitting = false;
  reservationComplete = false;
  confirmationCode = '';

  constructor(
    private reservasService: ReservasService,
    private authService: AuthService,
    private router: Router
  ) {}

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
    this.selectedType = type;
  }

  nextStep(): void {
    if (this.isStepValid(this.currentStep)) {
      this.currentStep++;
    }
  }

  previousStep(): void {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  isStepValid(step: number): boolean {
    if (step === 1) {
      return !!(
        this.reservationDetails.startDate &&
        this.reservationDetails.endDate &&
        this.reservationDetails.adults > 0
      );
    }
    if (step === 2) {
      return !!(
        this.personalInfo.fullName &&
        this.personalInfo.email &&
        this.personalInfo.phone &&
        this.personalInfo.document
      );
    }
    return false;
  }

  calculateTotalDays(): number {
    if (!this.reservationDetails.startDate || !this.reservationDetails.endDate) {
      return 0;
    }
    const start = new Date(this.reservationDetails.startDate);
    const end = new Date(this.reservationDetails.endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  }

  calculateEstimatedPrice(): number {
    const days = this.calculateTotalDays();
    const basePrice = this.selectedType === 'package' ? 250 : 
                      this.selectedType === 'destination' ? 80 :
                      this.selectedType === 'accommodation' ? 120 : 60;
    
    const total = (basePrice * days * this.reservationDetails.adults) + 
                  (basePrice * 0.5 * days * this.reservationDetails.children);
    
    return total;
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

    this.isSubmitting = true;

    try {
      const reserva = await this.reservasService.createReserva({
        userId: currentUser.$id,
        tipo: this.selectedType,
        destinoId: this.reservationDetails.destination,
        destinoNombre: this.reservationDetails.destination || 'Sin especificar',
        fechaInicio: this.reservationDetails.startDate,
        fechaFin: this.reservationDetails.endDate,
        adultos: this.reservationDetails.adults,
        ninos: this.reservationDetails.children,
        precioTotal: this.calculateEstimatedPrice(),
        estado: 'pendiente',
        nombreCompleto: this.personalInfo.fullName,
        email: this.personalInfo.email,
        telefono: this.personalInfo.phone,
        documento: this.personalInfo.document,
        solicitudesEspeciales: this.personalInfo.specialRequests
      });

      if (reserva) {
        this.confirmationCode = reserva.codigoConfirmacion || '';
        this.reservationComplete = true;
        this.currentStep = 3;
      } else {
        alert('Error al crear la reserva. Por favor intenta nuevamente.');
      }
    } catch (error) {
      console.error('Error submitting reservation:', error);
      alert('Ocurrió un error al procesar tu reserva');
    } finally {
      this.isSubmitting = false;
    }
  }

  resetForm(): void {
    this.currentStep = 1;
    this.selectedType = 'package';
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
    this.reservationComplete = false;
    this.confirmationCode = '';
  }

  getTotalParticipants(): number {
    return this.reservationDetails.adults + this.reservationDetails.children;
  }
}

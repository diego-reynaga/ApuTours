import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Navbar } from '../../components/navbar/navbar';
import { Footer } from '../../components/footer/footer';

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

  submitReservation(): void {
    if (!this.isStepValid(2)) {
      return;
    }

    this.isSubmitting = true;

    // Simular envío de reserva
    setTimeout(() => {
      this.confirmationCode = 'APU' + Date.now().toString().slice(-8);
      this.isSubmitting = false;
      this.reservationComplete = true;
      this.currentStep = 3;
    }, 2000);
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

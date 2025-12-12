import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-booking',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './booking.html',
  styleUrl: './booking.css',
})
export class Booking {
  private router = inject(Router);

  // Form data
  formData = {
    serviceType: '',
    checkin: '',
    checkout: '',
    adults: '1',
    children: '0',
    destination: ''
  };

  // Fecha mínima (hoy)
  minDate = new Date().toISOString().split('T')[0];

  // Mapeo de tipos de servicio
  private serviceTypeMap: { [key: string]: string } = {
    'tour': 'package',
    'transport': 'transport',
    'guide': 'destination',
    'accommodation': 'accommodation'
  };

  submitBooking(): void {
    if (!this.formData.serviceType) {
      return;
    }

    // Construir queryParams
    const queryParams: any = {
      tipo: this.serviceTypeMap[this.formData.serviceType] || 'package'
    };

    // Navegar a la página de reservas con los datos
    this.router.navigate(['/reservas'], { queryParams });
  }
}

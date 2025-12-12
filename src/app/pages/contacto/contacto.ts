import { Component, inject, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Navbar } from '../../components/navbar/navbar';
import { Footer } from '../../components/footer/footer';
import { AuthService } from '../../services/auth.service';
import { ContactoService } from '../../services/contacto.service';

interface ContactForm {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

interface ContactInfo {
  icon: string;
  title: string;
  lines: string[];
  link?: string;
}

@Component({
  selector: 'app-contacto',
  imports: [CommonModule, FormsModule, Navbar, Footer],
  templateUrl: './contacto.html',
  styleUrl: './contacto.css',
})
export class Contacto {
  private authService = inject(AuthService);
  private contactoService = inject(ContactoService);

  contactForm: ContactForm = {
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  };

  constructor() {
    effect(() => {
      const user = this.authService.currentUser();
      if (user) {
        if (!this.contactForm.name) this.contactForm.name = user.name;
        if (!this.contactForm.email) this.contactForm.email = user.email;
      }
    });
  }

  isSubmitting = false;
  submitSuccess = false;
  submitError = false;
  errorMessage = '';

  contactInfo: ContactInfo[] = [
    {
      icon: 'fa-map-marker-alt',
      title: 'Ubicación',
      lines: ['Plaza de Armas, Andahuaylas', 'Apurímac, Perú']
    },
    {
      icon: 'fa-phone',
      title: 'Teléfono',
      lines: ['+51 983 123 456', '+51 83 422 123'],
      link: 'tel:+51983123456'
    },
    {
      icon: 'fa-envelope',
      title: 'Email',
      lines: ['info@aputours.com', 'reservas@aputours.com'],
      link: 'mailto:info@aputours.com'
    },
    {
      icon: 'fa-clock',
      title: 'Horario de Atención',
      lines: ['Lunes a Viernes: 8:00 AM - 6:00 PM', 'Sábados: 9:00 AM - 1:00 PM']
    }
  ];

  socialLinks = [
    { icon: 'fa-facebook-f', name: 'Facebook', url: '#' },
    { icon: 'fa-instagram', name: 'Instagram', url: '#' },
    { icon: 'fa-twitter', name: 'Twitter', url: '#' },
    { icon: 'fa-youtube', name: 'YouTube', url: '#' }
  ];

  onSubmit(): void {
    if (!this.isFormValid()) {
      return;
    }

    this.isSubmitting = true;
    this.submitError = false;
    this.errorMessage = '';

    // Enviar mensaje usando el servicio real
    this.contactoService.enviarMensaje({
      nombre: this.contactForm.name,
      email: this.contactForm.email,
      telefono: this.contactForm.phone,
      asunto: this.contactForm.subject,
      mensaje: this.contactForm.message
    }).then(resultado => {
      this.isSubmitting = false;
      
      if (resultado) {
        this.submitSuccess = true;
        
        // Resetear el formulario
        this.contactForm = {
          name: '',
          email: '',
          phone: '',
          subject: '',
          message: ''
        };

        // Ocultar mensaje de éxito después de 5 segundos
        setTimeout(() => {
          this.submitSuccess = false;
        }, 5000);
      } else {
        this.submitError = true;
        this.errorMessage = this.contactoService.error() || 'Error al enviar el mensaje';
        
        setTimeout(() => {
          this.submitError = false;
        }, 5000);
      }
    }).catch(error => {
      this.isSubmitting = false;
      this.submitError = true;
      this.errorMessage = error.message || 'Error al enviar el mensaje';
      
      setTimeout(() => {
        this.submitError = false;
      }, 5000);
    });
  }

  isFormValid(): boolean {
    return !!(
      this.contactForm.name &&
      this.contactForm.email &&
      this.contactForm.subject &&
      this.contactForm.message
    );
  }
}

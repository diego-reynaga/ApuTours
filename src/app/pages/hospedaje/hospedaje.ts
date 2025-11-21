import { Component, OnInit, inject, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Navbar } from '../../components/navbar/navbar';
import { Footer } from '../../components/footer/footer';
import { HospedajeService, Hospedaje as HospedajeModel } from '../../services/hospedaje.service';

type CategoryKey = 'all' | 'hoteles' | 'hostales' | 'casas-rurales' | 'lodges';

@Component({
  selector: 'app-hospedaje',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, Navbar, Footer],
  templateUrl: './hospedaje.html',
  styleUrl: './hospedaje.css',
})
export class Hospedaje implements OnInit {
  private hospedajeService = inject(HospedajeService);

  // Signals del servicio
  hospedajes = this.hospedajeService.hospedajes;
  isLoading = this.hospedajeService.isLoading;
  error = this.hospedajeService.error;

  // Estado local
  protected selectedCategory = signal<CategoryKey>('all');
  protected searchTerm = signal('');

  ngOnInit(): void {
    if (this.hospedajes().length === 0) {
      this.hospedajeService.loadHospedajes();
    }
  }

  protected readonly categories = [
    { key: 'all' as CategoryKey, label: 'Todos', icon: 'fas fa-th-large' },
    { key: 'hoteles' as CategoryKey, label: 'Hoteles', icon: 'fas fa-hotel' },
    { key: 'hostales' as CategoryKey, label: 'Hostales', icon: 'fas fa-bed' },
    { key: 'casas-rurales' as CategoryKey, label: 'Casas Rurales', icon: 'fas fa-home' },
    { key: 'lodges' as CategoryKey, label: 'Lodges', icon: 'fas fa-tree' }
  ];

  protected readonly heroHighlights = [
    { number: '20+', label: 'Opciones verificadas', icon: 'fas fa-check-circle' },
    { number: '95%', label: 'Clientes satisfechos', icon: 'fas fa-smile' },
    { number: '24/7', label: 'Asistencia continua', icon: 'fas fa-headset' }
  ];

  protected readonly travelTips = [
    {
      id: 1,
      icon: 'fas fa-calendar-alt',
      title: 'Reserva con anticipación',
      body: 'En temporada alta (mayo-septiembre) y festividades locales, te recomendamos reservar con 15-30 días de anticipación.'
    },
    {
      id: 2,
      icon: 'fas fa-mountain',
      title: 'Altitud y aclimatación',
      body: 'Andahuaylas está a 2,926 m s.n.m. Si vienes de nivel del mar, considera llegar un día antes para aclimatarte.'
    },
    {
      id: 3,
      icon: 'fas fa-comment-dots',
      title: 'Idioma local',
      body: 'Muchos establecimientos rurales hablan quechua. Una sonrisa y respeto abren puertas en cualquier idioma.'
    }
  ];

  protected filteredAccommodations = computed(() => {
    const all = this.hospedajes();
    const category = this.selectedCategory();
    const term = this.searchTerm().toLowerCase().trim();

    return all.filter(h => {
      const matchesCategory = category === 'all' || h.categoria === category;
      const matchesSearch = !term || 
        h.nombre.toLowerCase().includes(term) || 
        h.descripcion.toLowerCase().includes(term) ||
        h.ubicacion.toLowerCase().includes(term);
      
      return matchesCategory && matchesSearch;
    });
  });

  protected setCategory(key: CategoryKey): void {
    this.selectedCategory.set(key);
  }

  protected clearFilters(): void {
    this.selectedCategory.set('all');
    this.searchTerm.set('');
  }

  protected hasActiveFilters = computed(() => {
    return this.selectedCategory() !== 'all' || !!this.searchTerm();
  });

  protected getAmenities(hospedaje: HospedajeModel): string[] {
    if (!hospedaje.amenidades) return [];
    
    if (typeof hospedaje.amenidades === 'string') {
      try {
        return JSON.parse(hospedaje.amenidades);
      } catch {
        return [hospedaje.amenidades];
      }
    }
    return hospedaje.amenidades;
  }
}

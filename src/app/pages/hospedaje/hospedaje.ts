import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Navbar } from '../../components/navbar/navbar';
import { Footer } from '../../components/footer/footer';

type CategoryKey = 'all' | 'hoteles' | 'hostales' | 'casas-rurales' | 'lodges';

interface Accommodation {
  id: number;
  name: string;
  category: Exclude<CategoryKey, 'all'>;
  description: string;
  amenities: string[];
  pricePerNight: number;
  rating: number;
  reviews: number;
  location: string;
  image: string;
  featured?: boolean;
}

interface HeroHighlight {
  number: string;
  label: string;
  icon: string;
}

interface TravelTip {
  id: number;
  icon: string;
  title: string;
  body: string;
}

@Component({
  selector: 'app-hospedaje',
  imports: [CommonModule, FormsModule, RouterLink, Navbar, Footer],
  templateUrl: './hospedaje.html',
  styleUrls: ['./hospedaje.css'],
})
export class Hospedaje {
  protected readonly categories = [
    { key: 'all' as CategoryKey, label: 'Todos', icon: 'fas fa-list' },
    { key: 'hoteles' as CategoryKey, label: 'Hoteles', icon: 'fas fa-hotel' },
    { key: 'hostales' as CategoryKey, label: 'Hostales', icon: 'fas fa-bed' },
    { key: 'casas-rurales' as CategoryKey, label: 'Casas Rurales', icon: 'fas fa-home' },
    { key: 'lodges' as CategoryKey, label: 'Lodges', icon: 'fas fa-tree' }
  ];

  protected readonly heroHighlights: HeroHighlight[] = [
    { number: '20+', label: 'Opciones verificadas', icon: 'fas fa-check-circle' },
    { number: '95%', label: 'Clientes satisfechos', icon: 'fas fa-smile' },
    { number: '24/7', label: 'Asistencia continua', icon: 'fas fa-headset' }
  ];

  protected readonly accommodations: Accommodation[] = [
    {
      id: 1,
      name: 'Hotel Los Libertadores',
      category: 'hoteles',
      description: 'Hotel boutique de 4 estrellas con vista panorámica al valle del Chumbao y servicios premium.',
      amenities: ['WiFi', 'Estacionamiento', 'Restaurante', 'Spa', 'Bar'],
      pricePerNight: 180,
      rating: 4.8,
      reviews: 142,
      location: 'Jr. Juan Francisco Ramos 610',
      image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80',
      featured: true
    },
    {
      id: 2,
      name: 'Hostal El Encanto Andino',
      category: 'hostales',
      description: 'Hostal familiar con arquitectura tradicional, patios con flores y desayuno casero incluido.',
      amenities: ['WiFi', 'Desayuno', 'Cocina compartida', 'Terraza'],
      pricePerNight: 60,
      rating: 4.6,
      reviews: 89,
      location: 'Av. Perú 340 - Talavera',
      image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&q=80'
    },
    {
      id: 3,
      name: 'Pacucha Glamping Lodge',
      category: 'lodges',
      description: 'Experiencia glamping con domos geodésicos frente a la laguna de Pacucha y cielo estrellado.',
      amenities: ['WiFi', 'Fogatas', 'Kayaks', 'Tours guiados', 'Pet Friendly'],
      pricePerNight: 220,
      rating: 4.9,
      reviews: 67,
      location: 'Comunidad de Pacucha',
      image: 'https://images.unsplash.com/photo-1504684658472-f4f2f1c15ca5?w=800&q=80',
      featured: true
    },
    {
      id: 4,
      name: 'Casa Rural Warmikuna',
      category: 'casas-rurales',
      description: 'Casa de adobe restaurada con huerto orgánico, talleres de textilería y gastronomía local.',
      amenities: ['Cocina equipada', 'Huerta', 'Actividades culturales', 'Estacionamiento'],
      pricePerNight: 90,
      rating: 4.7,
      reviews: 54,
      location: 'Sector Huayhuaca',
      image: 'https://images.unsplash.com/photo-1503174971373-b1f69850bded?w=800&q=80'
    },
    {
      id: 5,
      name: 'Hotel Turístico Apukunaq Tianan',
      category: 'hoteles',
      description: 'Hotel moderno con piscina climatizada, salas de conferencias y restaurante de comida fusión.',
      amenities: ['WiFi', 'Piscina', 'Gimnasio', 'Restaurante', 'Estacionamiento'],
      pricePerNight: 150,
      rating: 4.5,
      reviews: 98,
      location: 'Av. Confraternidad Internacional',
      image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&q=80'
    },
    {
      id: 6,
      name: 'Hostal Sondor',
      category: 'hostales',
      description: 'Hostal económico a pasos de la plaza, con habitaciones limpias y personal amable.',
      amenities: ['WiFi', 'TV cable', 'Agua caliente', 'Seguridad 24/7'],
      pricePerNight: 45,
      rating: 4.3,
      reviews: 76,
      location: 'Jr. Ayacucho 268',
      image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&q=80'
    }
  ];

  protected readonly travelTips: TravelTip[] = [
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

  protected searchTerm = '';
  protected selectedCategory: CategoryKey = 'all';
  protected checkIn = '';
  protected checkOut = '';
  protected guests = 1;

  protected get filteredAccommodations(): Accommodation[] {
    const term = this.searchTerm.trim().toLowerCase();
    return this.accommodations.filter((acc) => {
      const matchesCategory = this.selectedCategory === 'all' || acc.category === this.selectedCategory;
      const matchesSearch = term
        ? [acc.name, acc.description, acc.location].join(' ').toLowerCase().includes(term)
        : true;
      return matchesCategory && matchesSearch;
    });
  }

  protected setCategory(key: CategoryKey): void {
    this.selectedCategory = key;
  }

  protected clearFilters(): void {
    this.selectedCategory = 'all';
    this.searchTerm = '';
  }

  protected hasActiveFilters(): boolean {
    return this.selectedCategory !== 'all' || !!this.searchTerm.trim();
  }

  protected trackById(_: number, item: { id: number }): number {
    return item.id;
  }
}

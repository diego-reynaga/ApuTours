import { Component, OnInit, inject, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Navbar } from '../../components/navbar/navbar';
import { Footer } from '../../components/footer/footer';
import { GastronomiaService, Establecimiento } from '../../services/gastronomia.service';

type CategoryKey = 'all' | 'restaurantes' | 'bares' | 'cafeterias' | 'street-food';
type PriceKey = 'all' | 'económico' | 'moderado' | 'premium';

interface Dish {
  id: number;
  name: string;
  description: string;
  icon: string;
  rating: number;
  tags: string[];
  photo: string;
}

interface ExperienceTip {
  id: number;
  icon: string;
  title: string;
  body: string;
  action?: string;
}

@Component({
  selector: 'app-gastronomia',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, Navbar, Footer],
  templateUrl: './gastronomia.html',
  styleUrl: './gastronomia.css',
})
export class Gastronomia implements OnInit {
  private gastronomiaService = inject(GastronomiaService);
  
  // Signals del servicio
  establecimientos = this.gastronomiaService.establecimientos;
  isLoading = this.gastronomiaService.isLoading;
  error = this.gastronomiaService.error;

  ngOnInit(): void {
    if (this.establecimientos().length === 0) {
      this.gastronomiaService.loadEstablecimientos();
    }
  }

  protected readonly categories = [
    { key: 'all' as CategoryKey, label: 'Todos', icon: 'fas fa-list' },
    { key: 'restaurantes' as CategoryKey, label: 'Restaurantes', icon: 'fas fa-utensils' },
    { key: 'bares' as CategoryKey, label: 'Bares', icon: 'fas fa-cocktail' },
    { key: 'cafeterias' as CategoryKey, label: 'Cafeterías', icon: 'fas fa-mug-hot' },
    { key: 'street-food' as CategoryKey, label: 'Street Food', icon: 'fas fa-hamburger' }
  ];

  protected readonly priceFilters = [
    { key: 'all' as PriceKey, label: 'Todos los precios' },
    { key: 'económico' as PriceKey, label: '$ Económico' },
    { key: 'moderado' as PriceKey, label: '$$ Moderado' },
    { key: 'premium' as PriceKey, label: '$$$ Premium' }
  ];

  protected readonly heroHighlights = [
    { number: '15+', label: 'Restaurantes' },
    { number: '8+', label: 'Bares & Pubs' },
    { number: '20+', label: 'Platos típicos' }
  ];

  protected readonly featuredDishes: Dish[] = [
    {
      id: 1,
      name: 'Pachamanca Andahuaylina',
      description: 'Selección de carnes, papas nativas y habas cocidas lentamente bajo tierra.',
      icon: 'fas fa-drumstick-bite',
      rating: 4.9,
      tags: ['Tradicional', 'Ceremonial'],
      photo: 'https://i0.wp.com/elperuano.pe/fotografia/thumbnail/2023/08/30/000282971M.jpg'
    },
    {
      id: 2,
      name: 'Trucha de Pacucha',
      description: 'Trucha fresca dorada en mantequilla de huacatay y acompañada de mote dorado.',
      icon: 'fas fa-fish',
      rating: 4.7,
      tags: ['Laguna Pacucha', 'Fresco'],
      photo: 'https://www.gob.pe/institucion/produce/informes-publicaciones/5428463-trucha-frita'
    },
    {
      id: 3,
      name: 'Kapchi de habas',
      description: 'Crema tibia de habas tiernas, queso fresco y hierbas aromáticas andinas.',
      icon: 'fas fa-seedling',
      rating: 4.8,
      tags: ['Vegetariano', 'Cremoso'],
      photo: 'https://www.peru.travel/Contenido/General/Imagen/es/82/1.1/kapchi%20de%20habas.jpg'
    }
  ];

  protected readonly experienceTips: ExperienceTip[] = [
    {
      id: 1,
      icon: 'fas fa-seedling',
      title: 'Ruta agro culinaria',
      body: 'Participa en cosechas de quinua y aprende a preparar olluquito con productores locales.'
    },
    {
      id: 2,
      icon: 'fas fa-wine-bottle',
      title: 'Tastings guiados',
      body: 'Degustaciones privadas de licores de ciruela y vinos artesanales en micro bodegas.'
    },
    {
      id: 3,
      icon: 'fas fa-fire',
      title: 'Fogones ancestrales',
      body: 'Vive una pachamanca comunitaria cerca a Pacucha con narraciones sobre la cosmovisión andina.'
    }
  ];

  // Estado local con signals
  protected searchTerm = signal('');
  protected selectedCategory = signal<CategoryKey>('all');
  protected selectedPrice = signal<PriceKey>('all');

  // Establecimientos filtrados computados
  protected filteredEstablishments = computed(() => {
    const allEstablishments = this.establecimientos();
    const term = this.searchTerm().trim().toLowerCase();
    const category = this.selectedCategory();
    const price = this.selectedPrice();

    return allEstablishments.filter((place) => {
      const matchesCategory = category === 'all' || place.categoria === category;
      const matchesPrice = price === 'all' || place.nivelPrecio === price;
      
      const matchesSearch = !term || 
        place.nombre.toLowerCase().includes(term) || 
        place.descripcion.toLowerCase().includes(term) ||
        place.especialidades.toLowerCase().includes(term) ||
        place.ubicacion.toLowerCase().includes(term);

      return matchesCategory && matchesPrice && matchesSearch;
    });
  });

  protected setCategory(key: CategoryKey): void {
    this.selectedCategory.set(key);
  }

  protected setPrice(key: PriceKey): void {
    this.selectedPrice.set(key);
  }

  protected clearFilters(): void {
    this.selectedCategory.set('all');
    this.selectedPrice.set('all');
    this.searchTerm.set('');
  }

  protected hasActiveFilters = computed(() => {
    return this.selectedCategory() !== 'all' || this.selectedPrice() !== 'all' || !!this.searchTerm().trim();
  });
  
  // Helper para características
  protected getFeatureIcon(feature: string): string {
    const lower = feature.toLowerCase();
    if (lower.includes('wifi') || lower.includes('internet')) return 'fas fa-wifi';
    if (lower.includes('música') || lower.includes('music')) return 'fas fa-music';
    if (lower.includes('vino') || lower.includes('maridaje')) return 'fas fa-wine-glass-alt';
    if (lower.includes('veg') || lower.includes('vegetariano')) return 'fas fa-leaf';
    if (lower.includes('cocktail') || lower.includes('tragos')) return 'fas fa-cocktail';
    if (lower.includes('delivery')) return 'fas fa-motorcycle';
    if (lower.includes('tarjeta') || lower.includes('pagos')) return 'fas fa-credit-card';
    return 'fas fa-check';
  }
  
  protected getFeatures(place: Establecimiento): { icon: string; label: string }[] {
    if (!place.caracteristicas) return [];
    
    // Si viene como string JSON
    let features: string[] = [];
    if (typeof place.caracteristicas === 'string') {
      try {
        features = JSON.parse(place.caracteristicas);
      } catch {
        features = [place.caracteristicas];
      }
    } else if (Array.isArray(place.caracteristicas)) {
      features = place.caracteristicas;
    }
    
    return features.map(f => ({
      icon: this.getFeatureIcon(f),
      label: f
    }));
  }
}

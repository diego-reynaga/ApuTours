import { Component, OnInit, inject, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Navbar } from '../../components/navbar/navbar';
import { Footer } from '../../components/footer/footer';
import { DestinosService, Destino } from '../../services/destinos.service';

type CategoryKey = 'all' | 'natural' | 'arqueologico' | 'aventura' | 'cultural' | 'gastronomia';

interface HeroStat {
  label: string;
  value: string;
  helper: string;
  icon: string;
}

interface InsightCard {
  title: string;
  body: string;
  icon: string;
  tag: string;
}

@Component({
  selector: 'app-destinos',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, Navbar, Footer],
  templateUrl: './destinos.html',
  styleUrl: './destinos.css',
})
export class Destinos implements OnInit {
  private destinosService = inject(DestinosService);
  
  // Signals del servicio
  destinos = this.destinosService.destinos;
  isLoading = this.destinosService.isLoading;
  error = this.destinosService.error;

  ngOnInit(): void {
    // Los datos ya se cargan en el constructor del servicio, 
    // pero podemos forzar una recarga si es necesario
    if (this.destinos().length === 0) {
      this.destinosService.loadDestinos();
    }
  }

  protected readonly categories = [
    { key: 'all' as CategoryKey, label: 'Todos', icon: 'fas fa-globe' },
    { key: 'Naturaleza' as CategoryKey, label: 'Naturaleza', icon: 'fas fa-leaf' },
    { key: 'Arqueología' as CategoryKey, label: 'Arqueológico', icon: 'fas fa-landmark' },
    { key: 'Aventura' as CategoryKey, label: 'Aventura', icon: 'fas fa-mountain' },
    { key: 'Cultura' as CategoryKey, label: 'Cultural', icon: 'fas fa-users' },
    { key: 'Gastronomía' as CategoryKey, label: 'Gastronomía', icon: 'fas fa-utensils' }
  ];

  protected readonly heroStats: HeroStat[] = [
    { label: 'Destinos operativos', value: '18', helper: 'en la provincia', icon: 'fas fa-map-marked-alt' },
    { label: 'Clima ideal', value: '12°-23°C', helper: 'todo el año', icon: 'fas fa-temperature-low' },
    { label: 'Altitud media', value: '2,926 m s.n.m.', helper: 'sensación templada', icon: 'fas fa-mountain' }
  ];

  protected readonly insightCards: InsightCard[] = [
    {
      title: 'Consejos de temporada',
      body: 'De mayo a septiembre tendrás cielos despejados y festividades tradicionales como el Señor de Huanca.',
      icon: 'fas fa-cloud-sun',
      tag: 'Clima'
    },
    {
      title: 'Gastronomía cercana',
      body: 'Prueba la trucha en Pacucha o el cuy chactado en Talavera para complementar la experiencia.',
      icon: 'fas fa-utensils',
      tag: 'Sabores'
    },
    {
      title: 'Operadores aliados',
      body: 'Trabajamos con guías certificados y transporte turístico homologado por la DIRCETUR Apurímac.',
      icon: 'fas fa-user-check',
      tag: 'Calidad'
    }
  ];

  protected readonly starIndexes = Array.from({ length: 5 }, (_, index) => index);

  // Estado local con signals
  protected searchTerm = signal('');
  protected selectedCategory = signal<string>('all');
  protected viewMode = signal<'grid' | 'list'>('grid');

  // Destinos filtrados computados
  protected filteredDestinations = computed(() => {
    const allDestinos = this.destinos();
    const search = this.searchTerm().toLowerCase().trim();
    const category = this.selectedCategory();

    return allDestinos.filter((destination) => {
      // Normalizar categorías para comparación insensible a mayúsculas/minúsculas
      const destCategories = (destination.categorias || []).map(c => c.toLowerCase());
      
      const matchesCategory = category === 'all' || 
        destCategories.some(c => c.includes(category.toLowerCase()));
        
      const matchesSearch = !search || 
        destination.nombre.toLowerCase().includes(search) || 
        destination.descripcion.toLowerCase().includes(search);

      return matchesCategory && matchesSearch;
    });
  });

  protected get selectedCategoryLabel(): string {
    const cat = this.categories.find((c) => c.key === this.selectedCategory());
    return cat ? cat.label : 'Todos';
  }

  protected get hasActiveFilters(): boolean {
    return this.selectedCategory() !== 'all' || !!this.searchTerm().trim();
  }

  protected setCategory(key: string): void {
    this.selectedCategory.set(key);
  }

  protected clearFilters(): void {
    this.selectedCategory.set('all');
    this.searchTerm.set('');
  }

  protected setViewMode(mode: 'grid' | 'list'): void {
    this.viewMode.set(mode);
  }

  protected trackById(_: number, destination: Destino): string {
    return destination.$id || '';
  }

  protected getStarIcon(rating: number, index: number): string {
    const position = index + 1;
    if (rating >= position) {
      return 'fas fa-star';
    }
    if (rating >= position - 0.5) {
      return 'fas fa-star-half-alt';
    }
    return 'far fa-star';
  }

  protected getCategoryLabel(key: string): string {
    // Intentar encontrar una etiqueta bonita, si no usar la clave tal cual
    const found = this.categories.find(c => c.key.toLowerCase() === key.toLowerCase());
    return found ? found.label : key;
  }

  protected scrollToCatalog(): void {
    const element = document.getElementById('catalogo');
    element?.scrollIntoView({ behavior: 'smooth' });
  }
  
  // Helper para highlights que no vienen en la DB
  protected getHighlights(destination: Destino): { icon: string; label: string }[] {
    // Generar highlights basados en categorías o datos disponibles
    const highlights = [];
    
    if (destination.duracion) {
      highlights.push({ icon: 'fas fa-clock', label: destination.duracion });
    }
    
    if (destination.distancia) {
      highlights.push({ icon: 'fas fa-map-marker-alt', label: destination.distancia });
    }
    
    // Añadir highlights basados en categorías
    const cats = (destination.categorias || []).map(c => c.toLowerCase());
    if (cats.some(c => c.includes('aventura'))) {
      highlights.push({ icon: 'fas fa-hiking', label: 'Aventura' });
    } else if (cats.some(c => c.includes('historia') || c.includes('arque'))) {
      highlights.push({ icon: 'fas fa-history', label: 'Historia' });
    } else if (cats.some(c => c.includes('naturaleza'))) {
      highlights.push({ icon: 'fas fa-leaf', label: 'Naturaleza' });
    }
    
    return highlights.slice(0, 3);
  }
}

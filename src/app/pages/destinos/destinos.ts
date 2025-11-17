import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Navbar } from '../../components/navbar/navbar';
import { Footer } from '../../components/footer/footer';

type CategoryKey = 'all' | 'natural' | 'arqueologico' | 'aventura' | 'cultural';

interface Destination {
  id: number;
  name: string;
  description: string;
  image: string;
  categories: Exclude<CategoryKey, 'all'>[];
  duration: string;
  distance: string;
  difficulty: string;
  highlights: { icon: string; label: string }[];
  price: number;
  rating: number;
  reviews: number;
}

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
  imports: [CommonModule, FormsModule, Navbar, Footer],
  templateUrl: './destinos.html',
  styleUrl: './destinos.css',
})
export class Destinos {
  protected readonly categories = [
    { key: 'all' as CategoryKey, label: 'Todos', icon: 'fas fa-globe' },
    { key: 'natural' as CategoryKey, label: 'Natural', icon: 'fas fa-leaf' },
    { key: 'arqueologico' as CategoryKey, label: 'Arqueológico', icon: 'fas fa-landmark' },
    { key: 'aventura' as CategoryKey, label: 'Aventura', icon: 'fas fa-mountain' },
    { key: 'cultural' as CategoryKey, label: 'Cultural', icon: 'fas fa-users' }
  ];

  protected readonly destinations: Destination[] = [
    {
      id: 1,
      name: 'Laguna de Pacucha',
      description: 'Espejo de agua cristalina rodeado de montañas majestuosas. Ideal para fotografía, kayak y paseos en bote artesanal.',
      image: 'https://www.huillcaexpedition.com/images/blog/laguna-de-pacucha-historia-turismo-y-belleza-natural-en-apurimac-1737148745.jpg',
      categories: ['natural', 'aventura'],
      duration: '4-6 horas',
      distance: '15 km del centro',
      difficulty: 'Fácil',
      highlights: [
        { icon: 'fas fa-camera', label: 'Fotografía 360°' },
        { icon: 'fas fa-swimmer', label: 'Actividades acuáticas' },
        { icon: 'fas fa-hiking', label: 'Senderos seguros' }
      ],
      price: 25,
      rating: 4.9,
      reviews: 128
    },
    {
      id: 2,
      name: 'Complejo Arqueológico Sayhuite',
      description: 'Sitio preinca con la famosa Piedra de Sayhuite, un mapa hidráulico tallado en roca que representa el cosmos andino.',
      image: 'https://hidraulicainca.com/wp-content/uploads/2013/07/piedra-saywite-3.jpg',
      categories: ['arqueologico', 'cultural'],
      duration: '2-3 horas',
      distance: '47 km del centro',
      difficulty: 'Fácil',
      highlights: [
        { icon: 'fas fa-history', label: 'Relatos chankas' },
        { icon: 'fas fa-university', label: 'Arquitectura ritual' },
        { icon: 'fas fa-graduation-cap', label: 'Guías especializados' }
      ],
      price: 15,
      rating: 4.8,
      reviews: 96
    },
    {
      id: 3,
      name: 'Sondor',
      description: 'Complejo arqueológico chanka con terrazas agrícolas y vistas panorámicas del valle de Andahuaylas.',
      image: 'https://www.pacuchaglamping.com/wp-content/uploads/2022/09/sondorsi-2000x1335.jpg',
      categories: ['arqueologico', 'natural'],
      duration: '3-4 horas',
      distance: '20 km del centro',
      difficulty: 'Moderado',
      highlights: [
        { icon: 'fas fa-archway', label: 'Ingeniería lítica' },
        { icon: 'fas fa-eye', label: 'Miradores naturales' },
        { icon: 'fas fa-users', label: 'Ceremonias ancestrales' }
      ],
      price: 20,
      rating: 4.7,
      reviews: 110
    },
    {
      id: 4,
      name: 'Bosque de Piedra de Pampachiri',
      description: 'Formaciones geológicas únicas conocidas como “orqo q’apariy”, perfectas para caminatas escénicas y observación de cielo nocturno.',
      image: 'https://peru.info/archivos/publicacion/153-imagen-1228867712021.jpg',
      categories: ['natural', 'aventura'],
      duration: '1 día',
      distance: '120 km del centro',
      difficulty: 'Moderado',
      highlights: [
        { icon: 'fas fa-meteor', label: 'Paisaje lunar' },
        { icon: 'fas fa-star', label: 'Astroturismo' },
        { icon: 'fas fa-walking', label: 'Caminatas guiadas' }
      ],
      price: 35,
      rating: 4.6,
      reviews: 75
    },
    {
      id: 5,
      name: 'Mirador de Huayhuaca',
      description: 'Mirador natural con vista de 180° sobre el valle y el río Chumbao. Ideal para atardeceres y fotografía aérea.',
      image: 'https://i0.wp.com/www.diariodechimbote.com/wp-content/uploads/2024/03/portada-chincheros-1.jpg',
      categories: ['natural', 'cultural'],
      duration: '1-2 horas',
      distance: '12 km del centro',
      difficulty: 'Fácil',
      highlights: [
        { icon: 'fas fa-sun', label: 'Sunset spot' },
        { icon: 'fas fa-drone', label: 'Vista aérea' },
        { icon: 'fas fa-coffee', label: 'Café local' }
      ],
      price: 10,
      rating: 4.5,
      reviews: 54
    },
    {
      id: 6,
      name: 'Inca Huasi',
      description: 'Centro administrativo inca con recintos ceremoniales y canales hidráulicos. Ubicado en la ruta hacia Talavera.',
      image: 'https://portal.andina.pe/EDPfotografia2/Thumbnail/2020/06/02/000686927W.jpg',
      categories: ['arqueologico', 'cultural'],
      duration: '3 horas',
      distance: '25 km del centro',
      difficulty: 'Fácil',
      highlights: [
        { icon: 'fas fa-compass', label: 'Rutas guiadas' },
        { icon: 'fas fa-leaf', label: 'Paisaje agrícola' },
        { icon: 'fas fa-book', label: 'Archivo histórico' }
      ],
      price: 18,
      rating: 4.6,
      reviews: 82
    }
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

  protected searchTerm = '';
  protected selectedCategory: CategoryKey = 'all';
  protected viewMode: 'grid' | 'list' = 'grid';

  protected get filteredDestinations(): Destination[] {
    return this.destinations.filter((destination) => {
      const matchesCategory =
        this.selectedCategory === 'all' || destination.categories.includes(this.selectedCategory);
      const matchesSearch = this.searchTerm
        ? (destination.name + destination.description)
            .toLowerCase()
            .includes(this.searchTerm.trim().toLowerCase())
        : true;
      return matchesCategory && matchesSearch;
    });
  }

  protected get selectedCategoryLabel(): string {
    return this.categories.find((category) => category.key === this.selectedCategory)?.label ?? 'Todos';
  }

  protected get hasActiveFilters(): boolean {
    return this.selectedCategory !== 'all' || !!this.searchTerm.trim();
  }

  protected setCategory(key: CategoryKey): void {
    this.selectedCategory = key;
  }

  protected clearFilters(): void {
    this.selectedCategory = 'all';
    this.searchTerm = '';
  }

  protected setViewMode(mode: 'grid' | 'list'): void {
    this.viewMode = mode;
  }

  protected trackById(_: number, destination: Destination): number {
    return destination.id;
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

  protected getCategoryLabel(key: Exclude<CategoryKey, 'all'>): string {
    return this.categories.find((category) => category.key === key)?.label ?? key;
  }

  protected scrollToCatalog(): void {
    const element = document.getElementById('catalogo');
    element?.scrollIntoView({ behavior: 'smooth' });
  }

}

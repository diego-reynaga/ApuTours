import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Navbar } from '../../components/navbar/navbar';
import { Footer } from '../../components/footer/footer';
import { GastronomiaService } from '../../services/gastronomia.service';

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

interface Establishment {
  id: number;
  name: string;
  category: Exclude<CategoryKey, 'all'>;
  priceLevel: Exclude<PriceKey, 'all'>;
  description: string;
  features: { icon: string; label: string }[];
  specialties: string;
  schedule: string;
  location: string;
  rating: number;
  image: string;
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
  imports: [CommonModule, FormsModule, RouterLink, Navbar, Footer],
  templateUrl: './gastronomia.html',
  styleUrl: './gastronomia.css',
})
export class Gastronomia implements OnInit {
  private gastronomiaService?: GastronomiaService;

  constructor() {
    // El servicio se inyectará cuando esté configurado
  }

  ngOnInit(): void {
    // Cargar desde Appwrite si el servicio está configurado
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

  protected readonly establishments: Establishment[] = [
    {
      id: 1,
      name: 'Achiky Wasi',
      category: 'restaurantes',
      priceLevel: 'moderado',
      description: 'Cocina de autor con insumos del valle. Carta degustación de 6 tiempos disponible.',
      features: [
        { icon: 'fas fa-wine-glass-alt', label: 'Maridaje' },
        { icon: 'fas fa-music', label: 'Música en vivo' }
      ],
      specialties: 'Pachamanca contemporánea y postres con mashua.',
      schedule: 'Lun-Dom 12:00 - 23:00',
      location: 'Jr. Guillermo Billinghurst 315',
      rating: 4.9,
      image: 'https://images.unsplash.com/photo-1529042410759-befb1204b468?w=1200&q=80'
    },
    {
      id: 2,
      name: 'Tullpa Café',
      category: 'cafeterias',
      priceLevel: 'económico',
      description: 'Cafés de altura, panes artesanales y brunches con productos del huerto.',
      features: [
        { icon: 'fas fa-wifi', label: 'Wi-Fi' },
        { icon: 'fas fa-leaf', label: 'Veg-friendly' }
      ],
      specialties: 'Café geisha de Kishuará y sándwiches de trucha ahumada.',
      schedule: 'Mar-Dom 08:00 - 21:00',
      location: 'Av. Perú 210 - Talavera',
      rating: 4.7,
      image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=1200&q=80'
    },
    {
      id: 3,
      name: 'Bar Ñusta',
      category: 'bares',
      priceLevel: 'premium',
      description: 'Speakeasy inspirado en las lagunas místicas. Coctelería de autor con destilados ancestrales.',
      features: [
        { icon: 'fas fa-cocktail', label: 'Signature drinks' },
        { icon: 'fas fa-headphones', label: 'DJ sets' }
      ],
      specialties: 'Cóctel "Lágrimas de Ñusta" y tablas de quesos locales.',
      schedule: 'Jue-Sáb 18:00 - 02:00',
      location: 'Pasaje Ayacucho 118',
      rating: 4.8,
      image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200&q=80'
    },
    {
      id: 4,
      name: 'Qapchi Street',
      category: 'street-food',
      priceLevel: 'económico',
      description: 'Colectivo gastronómico con puestos rotativos cada fin de semana.',
      features: [
        { icon: 'fas fa-truck', label: 'Food trucks' },
        { icon: 'fas fa-guitar', label: 'Folklore' }
      ],
      specialties: 'Kapchi bowls, anticuchos y emolientes infusionados.',
      schedule: 'Vie-Dom 17:00 - 00:00',
      location: 'Malecón Chumbao',
      rating: 4.5,
      image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc835?w=1200&q=80'
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

  protected searchTerm = '';
  protected selectedCategory: CategoryKey = 'all';
  protected selectedPrice: PriceKey = 'all';

  protected get filteredEstablishments(): Establishment[] {
    const term = this.searchTerm.trim().toLowerCase();
    return this.establishments.filter((place) => {
      const matchesCategory = this.selectedCategory === 'all' || place.category === this.selectedCategory;
      const matchesPrice = this.selectedPrice === 'all' || place.priceLevel === this.selectedPrice;
      const matchesSearch = term
        ? [place.name, place.description, place.specialties, place.location]
            .join(' ')
            .toLowerCase()
            .includes(term)
        : true;
      return matchesCategory && matchesPrice && matchesSearch;
    });
  }

  protected setCategory(key: CategoryKey): void {
    this.selectedCategory = key;
  }

  protected setPrice(key: PriceKey): void {
    this.selectedPrice = key;
  }

  protected clearFilters(): void {
    this.selectedCategory = 'all';
    this.selectedPrice = 'all';
    this.searchTerm = '';
  }

  protected hasActiveFilters(): boolean {
    return this.selectedCategory !== 'all' || this.selectedPrice !== 'all' || !!this.searchTerm.trim();
  }

}

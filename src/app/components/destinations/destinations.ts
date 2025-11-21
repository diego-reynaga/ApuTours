import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DestinosService } from '../../services/destinos.service';

@Component({
  selector: 'app-destinations',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './destinations.html',
  styleUrl: './destinations.css',
})
export class Destinations {
  private destinosService = inject(DestinosService);
  
  // Obtenemos todos los destinos del servicio
  destinos = this.destinosService.destinos;
  isLoading = this.destinosService.isLoading;

  // Filtramos solo los destacados (o tomamos los primeros 3 si no hay destacados explícitos)
  featuredDestinos = computed(() => {
    const all = this.destinos();
    const featured = all.filter(d => d.destacado);
    return featured.length > 0 ? featured.slice(0, 4) : all.slice(0, 4);
  });

  scrollToContact() {
    const element = document.getElementById('contacto');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }
}

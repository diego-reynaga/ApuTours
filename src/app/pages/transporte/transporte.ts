import { Component, OnInit, inject, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Navbar } from '../../components/navbar/navbar';
import { Footer } from '../../components/footer/footer';
import { TransporteService, Transporte as TransporteModel } from '../../services/transporte.service';

type TransportType = 'all' | 'bus' | 'taxi' | 'privado' | 'compartido';

@Component({
  selector: 'app-transporte',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, Navbar, Footer],
  templateUrl: './transporte.html',
  styleUrl: './transporte.css',
})
export class Transporte implements OnInit {
  private transporteService = inject(TransporteService);
  
  // Signals del servicio
  transportes = this.transporteService.transportes;
  isLoading = this.transporteService.isLoading;
  error = this.transporteService.error;

  // Estado local
  protected selectedType = signal<TransportType>('all');
  protected searchTerm = signal('');

  ngOnInit(): void {
    if (this.transportes().length === 0) {
      this.transporteService.loadTransportes();
    }
  }

  protected readonly transportTypes = [
    { key: 'all' as TransportType, label: 'Todos', icon: 'fas fa-th-large' },
    { key: 'privado' as TransportType, label: 'Privado', icon: 'fas fa-car' },
    { key: 'bus' as TransportType, label: 'Bus Turístico', icon: 'fas fa-bus' },
    { key: 'compartido' as TransportType, label: 'Compartido', icon: 'fas fa-shuttle-van' },
    { key: 'taxi' as TransportType, label: 'Taxi Seguro', icon: 'fas fa-taxi' }
  ];

  protected filteredTransportes = computed(() => {
    const all = this.transportes();
    const type = this.selectedType();
    const term = this.searchTerm().toLowerCase().trim();

    return all.filter(t => {
      const matchesType = type === 'all' || t.tipo === type;
      const matchesSearch = !term || 
        t.nombre.toLowerCase().includes(term) || 
        t.descripcion.toLowerCase().includes(term) ||
        t.origen.toLowerCase().includes(term) ||
        t.destino.toLowerCase().includes(term);
      
      return matchesType && matchesSearch;
    });
  });

  protected setType(type: TransportType): void {
    this.selectedType.set(type);
  }

  protected getFeatures(transporte: TransporteModel): string[] {
    if (!transporte.caracteristicas) return [];
    
    if (typeof transporte.caracteristicas === 'string') {
      try {
        return JSON.parse(transporte.caracteristicas);
      } catch {
        return [transporte.caracteristicas];
      }
    }
    return transporte.caracteristicas;
  }

  protected getIconForType(tipo: string): string {
    switch (tipo) {
      case 'bus': return 'fas fa-bus';
      case 'taxi': return 'fas fa-taxi';
      case 'privado': return 'fas fa-car';
      case 'compartido': return 'fas fa-shuttle-van';
      default: return 'fas fa-car-side';
    }
  }
}

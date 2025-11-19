import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Navbar } from '../../components/navbar/navbar';
import { Footer } from '../../components/footer/footer';
import { TransporteService } from '../../services/transporte.service';

@Component({
  selector: 'app-transporte',
  imports: [Navbar, Footer, CommonModule],
  templateUrl: './transporte.html',
  styleUrl: './transporte.css',
})
export class Transporte implements OnInit {
  get transportes() {
    return this.transporteService.transportes();
  }

  get isLoading() {
    return this.transporteService.isLoading();
  }

  get error() {
    return this.transporteService.error();
  }

  constructor(private transporteService: TransporteService) {}

  ngOnInit(): void {
    // Los transportes se cargan automáticamente en el constructor del servicio
  }
}

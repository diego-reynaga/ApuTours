import { Component, HostListener, computed, Signal } from '@angular/core';
import { RouterLink, Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs/operators';
import { AuthService, User } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, CommonModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  isMenuOpen = false;
  isScrolled = false;
  currentRoute = '/';
  
  // Señales reactivas del servicio de autenticación
  currentUser: Signal<User | null>;
  isAuthenticated: Signal<boolean>;

  constructor(
    private router: Router,
    public authService: AuthService
  ) {
    // Inicializar señales reactivas
    this.currentUser = this.authService.currentUser;
    this.isAuthenticated = this.authService.isAuthenticated;

    // Suscribirse a los eventos de navegación para detectar la ruta actual
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.currentRoute = event.urlAfterRedirects || event.url;
      });
    
    // Establecer la ruta inicial
    this.currentRoute = this.router.url;
  }

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  closeMenu(): void {
    this.isMenuOpen = false;
  }

  @HostListener('window:scroll')
  onScroll(): void {
    this.isScrolled = window.scrollY > 10;
  }

  // Verificar si un link debe mostrarse (ocultar si es la ruta actual)
  shouldShowLink(route: string): boolean {
    return this.currentRoute !== route;
  }

  // Cerrar sesión
  async logout(): Promise<void> {
    try {
      await this.authService.logout();
      this.closeMenu();
      this.router.navigate(['/']);
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  }
}

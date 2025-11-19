import { Component, HostListener, computed, Signal } from '@angular/core';
import { RouterLink, Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs/operators';
import { AuthService, User } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, CommonModule],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.css'],
})
export class Navbar {
  isMenuOpen = false;
  isScrolled = false;
  currentRoute = '/';
  
  // Acceso a las señales reactivas del servicio de autenticación mediante getters
  get currentUser(): Signal<User | null> {
    return this.authService.currentUser;
  }

  get isAuthenticated(): Signal<boolean> {
    return this.authService.isAuthenticated;
  }

  constructor(
    private router: Router,
    public authService: AuthService
  ) {
    // Ya no es necesario inicializar las señales aquí: los getters acceden al servicio

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

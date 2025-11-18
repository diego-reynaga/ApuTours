import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

type LoginMode = 'login' | 'register' | 'forgot-password';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  mode = signal<LoginMode>('login');
  
  // Formulario de login
  loginForm = {
    email: '',
    password: ''
  };

  // Formulario de registro
  registerForm = {
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  };

  // Formulario de recuperación
  forgotPasswordForm = {
    email: ''
  };

  // Estados
  isSubmitting = signal(false);
  errorMessage = signal<string | null>(null);
  successMessage = signal<string | null>(null);
  showPassword = signal(false);

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  /**
   * Cambiar modo entre login, registro y recuperación
   */
  setMode(mode: LoginMode): void {
    this.mode.set(mode);
    this.clearMessages();
  }

  /**
   * Limpiar mensajes
   */
  clearMessages(): void {
    this.errorMessage.set(null);
    this.successMessage.set(null);
  }

  /**
   * Iniciar sesión
   */
  async onLogin(): Promise<void> {
    if (!this.loginForm.email || !this.loginForm.password) {
      this.errorMessage.set('Por favor completa todos los campos');
      return;
    }

    this.isSubmitting.set(true);
    this.clearMessages();

    try {
      await this.authService.login(
        this.loginForm.email,
        this.loginForm.password
      );
      
      this.successMessage.set('¡Sesión iniciada correctamente!');
      
      // Redirigir después de un breve delay
      setTimeout(() => {
        this.router.navigate(['/']);
      }, 1000);
    } catch (error: any) {
      this.errorMessage.set(error.message || 'Error al iniciar sesión');
    } finally {
      this.isSubmitting.set(false);
    }
  }

  /**
   * Registrar nuevo usuario
   */
  async onRegister(): Promise<void> {
    // Validaciones
    if (!this.registerForm.name || !this.registerForm.email || 
        !this.registerForm.password || !this.registerForm.confirmPassword) {
      this.errorMessage.set('Por favor completa todos los campos');
      return;
    }

    if (this.registerForm.password !== this.registerForm.confirmPassword) {
      this.errorMessage.set('Las contraseñas no coinciden');
      return;
    }

    if (this.registerForm.password.length < 8) {
      this.errorMessage.set('La contraseña debe tener al menos 8 caracteres');
      return;
    }

    this.isSubmitting.set(true);
    this.clearMessages();

    try {
      await this.authService.register(
        this.registerForm.email,
        this.registerForm.password,
        this.registerForm.name
      );
      
      this.successMessage.set('¡Registro exitoso! Redirigiendo...');
      
      setTimeout(() => {
        this.router.navigate(['/']);
      }, 1000);
    } catch (error: any) {
      this.errorMessage.set(error.message || 'Error al registrar usuario');
    } finally {
      this.isSubmitting.set(false);
    }
  }

  /**
   * Solicitar recuperación de contraseña
   */
  async onForgotPassword(): Promise<void> {
    if (!this.forgotPasswordForm.email) {
      this.errorMessage.set('Por favor ingresa tu email');
      return;
    }

    this.isSubmitting.set(true);
    this.clearMessages();

    try {
      await this.authService.requestPasswordRecovery(
        this.forgotPasswordForm.email
      );
      
      this.successMessage.set(
        'Se ha enviado un enlace de recuperación a tu email'
      );
      
      // Cambiar al modo login después de 3 segundos
      setTimeout(() => {
        this.setMode('login');
      }, 3000);
    } catch (error: any) {
      this.errorMessage.set(error.message || 'Error al solicitar recuperación');
    } finally {
      this.isSubmitting.set(false);
    }
  }

  /**
   * Login con OAuth (Google)
   */
  loginWithGoogle(): void {
    this.authService.loginWithOAuth('google');
  }

  /**
   * Login con OAuth (Facebook)
   */
  loginWithFacebook(): void {
    this.authService.loginWithOAuth('facebook');
  }

  /**
   * Alternar visibilidad de contraseña
   */
  togglePasswordVisibility(): void {
    this.showPassword.set(!this.showPassword());
  }

  /**
   * Validar email
   */
  isValidEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }
}

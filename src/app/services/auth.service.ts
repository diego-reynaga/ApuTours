import { Injectable, signal } from '@angular/core';
import { Client, Account, ID, Models } from 'appwrite';
import { environment } from '../../environments/environment';

export type UserLabel = 'verificador' | 'admin' | 'premium';

export interface User {
  $id: string;
  name: string;
  email: string;
  labels: string[];
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private client: Client;
  private account: Account;
  
  // Señales reactivas para el estado de autenticación
  currentUser = signal<User | null>(null);
  isAuthenticated = signal<boolean>(false);
  isLoading = signal<boolean>(true);

  constructor() {
    this.client = new Client()
      .setEndpoint(environment.appwriteEndpoint)
      .setProject(environment.appwriteProjectId);
    
    this.account = new Account(this.client);
    
    // Verificar sesión al iniciar
    this.checkSession();
  }

  /**
   * Verificar si hay una sesión activa
   */
  async checkSession(): Promise<void> {
    try {
      this.isLoading.set(true);
      const user = await this.account.get();
      
      this.currentUser.set({
        $id: user.$id,
        name: user.name,
        email: user.email,
        labels: user.labels || []
      });
      this.isAuthenticated.set(true);
    } catch (error) {
      this.currentUser.set(null);
      this.isAuthenticated.set(false);
    } finally {
      this.isLoading.set(false);
    }
  }

  /**
   * Verificar si el usuario tiene un label específico
   */
  hasLabel(label: UserLabel): boolean {
    const user = this.currentUser();
    return user?.labels?.includes(label) || false;
  }

  /**
   * Verificar si el usuario es verificador (tiene label 'verificador')
   */
  isVerificador(): boolean {
    return this.hasLabel('verificador');
  }

  /**
   * Verificar si el usuario es admin
   */
  isAdmin(): boolean {
    return this.hasLabel('admin');
  }

  /**
   * Verificar si el usuario puede verificar comprobantes
   */
  canVerifyComprobantes(): boolean {
    return this.isVerificador() || this.isAdmin();
  }

  /**
   * Registrar un nuevo usuario
   */
  async register(email: string, password: string, name: string): Promise<void> {
    try {
      await this.account.create(ID.unique(), email, password, name);
      await this.login(email, password);
    } catch (error: any) {
      throw new Error(error.message || 'Error al registrar usuario');
    }
  }

  /**
   * Iniciar sesión con email y password
   */
  async login(email: string, password: string): Promise<void> {
    try {
      await this.account.createEmailPasswordSession(email, password);
      await this.checkSession();
    } catch (error: any) {
      throw new Error(error.message || 'Error al iniciar sesión');
    }
  }

  /**
   * Iniciar sesión con OAuth2 (Google, Facebook, etc.)
   */
  loginWithOAuth(provider: string): void {
    try {
      this.account.createOAuth2Session(
        provider as any,
        `${window.location.origin}/`,
        `${window.location.origin}/login?error=oauth`
      );
    } catch (error: any) {
      throw new Error(error.message || 'Error al iniciar sesión con OAuth');
    }
  }

  /**
   * Cerrar sesión
   */
  async logout(): Promise<void> {
    try {
      await this.account.deleteSession('current');
      this.currentUser.set(null);
      this.isAuthenticated.set(false);
    } catch (error: any) {
      throw new Error(error.message || 'Error al cerrar sesión');
    }
  }

  /**
   * Obtener sesión actual
   */
  async getCurrentSession(): Promise<Models.Session | null> {
    try {
      return await this.account.getSession('current');
    } catch (error) {
      return null;
    }
  }

  /**
   * Solicitar recuperación de contraseña
   */
  async requestPasswordRecovery(email: string): Promise<void> {
    try {
      await this.account.createRecovery(
        email,
        `${window.location.origin}/reset-password`
      );
    } catch (error: any) {
      throw new Error(error.message || 'Error al solicitar recuperación');
    }
  }

  /**
   * Confirmar recuperación de contraseña
   */
  async confirmPasswordRecovery(
    userId: string,
    secret: string,
    password: string
  ): Promise<void> {
    try {
      await this.account.updateRecovery(userId, secret, password);
    } catch (error: any) {
      throw new Error(error.message || 'Error al restablecer contraseña');
    }
  }

  /**
   * Actualizar nombre del usuario
   */
  async updateName(name: string): Promise<void> {
    try {
      const user = await this.account.updateName(name);
      this.currentUser.set({
        $id: user.$id,
        name: user.name,
        email: user.email,
        labels: user.labels || []
      });
    } catch (error: any) {
      throw new Error(error.message || 'Error al actualizar nombre');
    }
  }

  /**
   * Actualizar email del usuario
   */
  async updateEmail(email: string, password: string): Promise<void> {
    try {
      const user = await this.account.updateEmail(email, password);
      this.currentUser.set({
        $id: user.$id,
        name: user.name,
        email: user.email,
        labels: user.labels || []
      });
    } catch (error: any) {
      throw new Error(error.message || 'Error al actualizar email');
    }
  }

  /**
   * Actualizar contraseña del usuario
   */
  async updatePassword(newPassword: string, oldPassword: string): Promise<void> {
    try {
      await this.account.updatePassword(newPassword, oldPassword);
    } catch (error: any) {
      throw new Error(error.message || 'Error al actualizar contraseña');
    }
  }
}

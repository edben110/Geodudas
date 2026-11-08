import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { ProgressStore, type Session } from './shared/progress-store';
import { DashboardEstudiante } from './dashboard-estudiante/dashboard-estudiante';
import { LoginComponent } from './login/login';

@Component({
  selector: 'app-root',
  imports: [CommonModule, DashboardEstudiante, LoginComponent],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  private readonly store = inject(ProgressStore);

  readonly hasStarted = signal(false);
  readonly studentName = signal('');
  readonly selectedAvatar = signal<string | null>(null);

  constructor() {
    // Restaura la sesión del localStorage si existe.
    const session = this.store.loadSession();

    if (session) {
      this.studentName.set(session.name);
      this.selectedAvatar.set(session.avatar);
      this.hasStarted.set(true);
    }
  }

  /** Se llama cuando LoginComponent emite (sessionStarted). */
  onSessionStarted(session: Session): void {
    this.studentName.set(session.name);
    this.selectedAvatar.set(session.avatar);
    this.hasStarted.set(true);
  }

  /** Cierra sesión: limpia localStorage y vuelve al login. */
  logout(): void {
    this.store.clearSession();
    this.studentName.set('');
    this.selectedAvatar.set(null);
    this.hasStarted.set(false);
  }
}

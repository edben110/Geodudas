import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  type ValidatorFn,
} from '@angular/forms';
import { IconComponent } from './shared/icon';
import { ProgressStore } from './shared/progress-store';
import { DashboardEstudiante } from './dashboard-estudiante/dashboard-estudiante';

/** Solo letras (con tildes) y espacios entre palabras, mínimo 2 letras. */
const validName: ValidatorFn = (control) => {
  const value = String(control.value ?? '').trim().replace(/\s+/g, ' ');
  return /^\p{L}+(?: \p{L}+)*$/u.test(value) && value.length >= 2
    ? null
    : { name: true };
};

@Component({
  selector: 'app-root',
  imports: [CommonModule, ReactiveFormsModule, IconComponent, DashboardEstudiante],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  private readonly store = inject(ProgressStore);

  readonly avatars = [
    '/images/Avatar1.png',
    '/images/Avatar2.png',
    '/images/Avatar3.png',
  ];

  readonly selectedAvatar = signal<string | null>(null);
  readonly hasStarted = signal(false);
  readonly attemptedStart = signal(false);
  /** Nombre ya normalizado de espacios, el que ve el dashboard. */
  readonly studentName = signal('');

  readonly profileForm = new FormGroup({
    name: new FormControl('', {
      nonNullable: true,
      validators: [validName],
    }),
  });

  constructor() {
    const session = this.store.loadSession();

    if (session && this.avatars.includes(session.avatar)) {
      this.profileForm.controls.name.setValue(session.name);
      this.selectedAvatar.set(session.avatar);
      this.studentName.set(session.name);
      this.hasStarted.set(true);
    }
  }

  selectAvatar(imagePath: string): void {
    this.selectedAvatar.set(imagePath);
  }

  startExploring(): void {
    this.attemptedStart.set(true);

    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      return;
    }

    const avatar = this.selectedAvatar();

    if (!avatar) {
      return;
    }

    const name = this.profileForm.controls.name.value
      .trim()
      .replace(/\s+/g, ' ');

    this.studentName.set(name);
    this.store.saveSession({ name, avatar });
    this.hasStarted.set(true);
  }

  logout(): void {
    this.store.clearSession();
    this.profileForm.reset();
    this.selectedAvatar.set(null);
    this.studentName.set('');
    this.attemptedStart.set(false);
    this.hasStarted.set(false);
  }
}

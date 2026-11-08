import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { DashboardEstudiante } from './dashboard-estudiante/dashboard-estudiante';

@Component({
  selector: 'app-root',
  imports: [CommonModule, ReactiveFormsModule, DashboardEstudiante],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  readonly avatars = [
    '/images/Avatar1.png',
    '/images/Avatar2.png',
    '/images/Avatar3.png',
  ];

  readonly selectedAvatar = signal<string | null>(null);
  readonly hasStarted = signal(false);
  readonly attemptedStart = signal(false);

  readonly profileForm = new FormGroup({
    name: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(2)],
    }),
  });

  selectAvatar(imagePath: string): void {
    this.selectedAvatar.set(imagePath);
  }

  startExploring(): void {
    this.attemptedStart.set(true);

    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      return;
    }

    if (!this.selectedAvatar()) {
      return;
    }

    this.hasStarted.set(true);
  }

  changeAvatar(): void {
    this.hasStarted.set(false);
    this.attemptedStart.set(false);
  }
}
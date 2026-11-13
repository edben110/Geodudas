import { CommonModule } from '@angular/common';
import {
  Component,
  inject,
  output,
  signal,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  type ValidatorFn,
} from '@angular/forms';
import { IconComponent } from '../shared/icon';
import { ProgressStore, type Session } from '../shared/progress-store';

/** Solo letras (con tildes y ñ) y espacios entre palabras, mínimo 2 letras. */
const validName: ValidatorFn = (control) => {
  const value = String(control.value ?? '').trim().replace(/\s+/g, ' ');
  return /^\p{L}+(?: \p{L}+)*$/u.test(value) && value.length >= 2
    ? null
    : { name: true };
};

@Component({
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule, IconComponent],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class LoginComponent {
  private readonly store = inject(ProgressStore);

  /** Emite la sesión validada al componente padre (app.ts). */
  readonly sessionStarted = output<Session>();

  readonly avatars = [
    '/images/Avatar1.png',
    '/images/Avatar2.png',
    '/images/Avatar3.png',
  ];

  readonly selectedAvatar = signal<string | null>(null);
  readonly attemptedStart = signal(false);
  /** true mientras el formulario se está enviando (para deshabilitar el botón). */
  readonly submitting = signal(false);

  readonly profileForm = new FormGroup({
    name: new FormControl('', {
      nonNullable: true,
      validators: [validName],
    }),
  });

  /** Devuelve true si el campo nombre tiene error y ya fue tocado o intentó enviarse. */
  get nameHasError(): boolean {
    const ctrl = this.profileForm.controls.name;
    return ctrl.invalid && (ctrl.touched || this.attemptedStart());
  }

  selectAvatar(path: string): void {
    this.selectedAvatar.set(path);
  }

  startExploring(): void {
    this.attemptedStart.set(true);

    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      return;
    }

    const avatar = this.selectedAvatar();
    if (!avatar) return;

    this.submitting.set(true);

    const name = this.profileForm.controls.name.value
      .trim()
      .replace(/\s+/g, ' ');

    const session: Session = { name, avatar };
    this.store.saveSession(session);
    this.sessionStarted.emit(session);
    this.submitting.set(false);
  }
}

import { CommonModule } from '@angular/common';
import {
  Component,
  computed,
  input,
  output,
  signal,
} from '@angular/core';
import { IconComponent } from '../shared/icon';

/** Una tarea del taskflow del explorador. */
export interface ExplorerTask {
  id: string;
  label: string;
  icon: string;
  /** La sección del dashboard a la que navega al completarse. */
  targetSection: string;
  done: boolean;
}

/** Datos del perfil que este componente puede mostrar. */
export interface HomeStats {
  stars: number;
  level: number;
  streak: number;
  xp: number;
  xpForNextLevel: number;
}

@Component({
  selector: 'app-home',
  imports: [CommonModule, IconComponent],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class HomeComponent {
  /** Nombre del estudiante que viene del dashboard padre. */
  readonly studentName = input('Explorador');
  readonly avatar = input<string | null>(null);
  readonly stats = input<HomeStats>({
    stars: 0,
    level: 1,
    streak: 0,
    xp: 0,
    xpForNextLevel: 500,
  });

  /** Le pide al padre navegar a otra sección (p. ej. 'Misiones'). */
  readonly navigateTo = output<string>();

  // ── Taskflow ─────────────────────────────────────────────────

  /**
   * Lista de tareas diarias del explorador.
   * Las tareas se persisten solo en memoria de la sesión;
   * se reinician al recargar (son sugerencias, no progreso real).
   */
  readonly tasks = signal<ExplorerTask[]>([
    {
      id: 'completa-mision',
      label: 'Completa una misión del mapa',
      icon: 'target-duotone',
      targetSection: 'Misiones',
      done: false,
    },
    {
      id: 'explora-pais',
      label: 'Descubre un nuevo país en el mapa',
      icon: 'globe-hemisphere-east-duotone',
      targetSection: 'Misiones',
      done: false,
    },
    {
      id: 'revisa-logros',
      label: 'Revisa tus logros desbloqueados',
      icon: 'trophy-duotone',
      targetSection: 'Logros',
      done: false,
    },
    {
      id: 'actualiza-perfil',
      label: 'Visita tu perfil de explorador',
      icon: 'user-circle-duotone',
      targetSection: 'Perfil',
      done: false,
    },
    {
      id: 'bandera-reto',
      label: 'Supera el reto de banderas',
      icon: 'flag-banner-duotone',
      targetSection: 'Misiones',
      done: false,
    },
  ]);

  /** Cantidad de tareas completadas. */
  readonly completedCount = computed(
    () => this.tasks().filter((t) => t.done).length,
  );

  /** Porcentaje de progreso de las tareas (0-100). */
  readonly taskProgress = computed(() =>
    Math.round((this.completedCount() / this.tasks().length) * 100),
  );

  /** true cuando todas las tareas están completadas. */
  readonly allDone = computed(() => this.completedCount() === this.tasks().length);

  // ── Métodos ──────────────────────────────────────────────────

  /**
   * Alterna el estado done/undone de una tarea al hacer clic
   * en el checkbox. Usa ngClass en el template para el estilo.
   */
  toggleTask(taskId: string): void {
    this.tasks.update((list) =>
      list.map((t) => (t.id === taskId ? { ...t, done: !t.done } : t)),
    );
  }

  /**
   * Marca una tarea como hecha Y navega a su sección destino.
   * Se llama desde el botón "Ir" de cada tarea.
   */
  goToTask(task: ExplorerTask): void {
    if (!task.done) {
      this.tasks.update((list) =>
        list.map((t) => (t.id === task.id ? { ...t, done: true } : t)),
      );
    }
    this.navigateTo.emit(task.targetSection);
  }

  /** Reinicia todas las tareas a pendientes. */
  resetTasks(): void {
    this.tasks.update((list) => list.map((t) => ({ ...t, done: false })));
  }
}

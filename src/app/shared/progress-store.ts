import { Injectable } from '@angular/core';

export interface Profile {
  stars: number;
  level: number;
  xp: number;
  streak: number;
  /** Último día (AAAA-MM-DD) en que el estudiante completó una actividad. */
  lastActiveDay: string | null;
  correctAnswers: number;
  colombiaCorrect: number;
  /** Progreso por tema (0-100), indexado por el título del tema. */
  topicProgress: Record<string, number>;
}

export interface Session {
  name: string;
  avatar: string;
}

const PROFILE_PREFIX = 'geodudas:progress:';
const SESSION_KEY = 'geodudas:session';

export function emptyProfile(): Profile {
  return {
    stars: 0,
    level: 1,
    xp: 0,
    streak: 0,
    lastActiveDay: null,
    correctAnswers: 0,
    colombiaCorrect: 0,
    topicProgress: {},
  };
}

/** "  Ana  María " -> "ana maría": mismo nombre, mismo perfil. */
export function normalizeName(name: string): string {
  return name.trim().replace(/\s+/g, ' ').toLocaleLowerCase('es');
}

export function dayKey(date = new Date()): string {
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${date.getFullYear()}-${month}-${day}`;
}

/** Racha de días: mismo día no cambia, el día siguiente suma, si no reinicia en 1. */
export function nextStreak(
  streak: number,
  lastActiveDay: string | null,
  today = new Date(),
): number {
  const todayKey = dayKey(today);
  if (lastActiveDay === todayKey) {
    return Math.max(streak, 1);
  }

  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  return lastActiveDay === dayKey(yesterday) ? streak + 1 : 1;
}

/**
 * Perfiles simples por nombre guardados en el navegador. Sin contraseña:
 * quien escribe el mismo nombre en este navegador recupera ese perfil.
 */
@Injectable({ providedIn: 'root' })
export class ProgressStore {
  loadProfile(name: string): Profile {
    const saved = this.read<Partial<Profile>>(PROFILE_PREFIX + normalizeName(name));
    return { ...emptyProfile(), ...saved };
  }

  saveProfile(name: string, profile: Profile): void {
    this.write(PROFILE_PREFIX + normalizeName(name), profile);
  }

  loadSession(): Session | null {
    const session = this.read<Session>(SESSION_KEY);
    return session?.name && session.avatar ? session : null;
  }

  saveSession(session: Session): void {
    this.write(SESSION_KEY, session);
  }

  clearSession(): void {
    try {
      localStorage.removeItem(SESSION_KEY);
    } catch {
      // Sin almacenamiento disponible: la app sigue funcionando sin guardar.
    }
  }

  private read<T>(key: string): T | null {
    try {
      const raw = localStorage.getItem(key);
      return raw ? (JSON.parse(raw) as T) : null;
    } catch {
      return null;
    }
  }

  private write(key: string, value: unknown): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Cuota llena o modo privado: se ignora para no romper la experiencia.
    }
  }
}

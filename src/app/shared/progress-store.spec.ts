import { TestBed } from '@angular/core/testing';
import { vi } from 'vitest';
import {
  ProgressStore,
  emptyProfile,
  nextStreak,
  normalizeName,
} from './progress-store';

describe('ProgressStore', () => {
  let store: ProgressStore;

  beforeEach(() => {
    const memory = new Map<string, string>();
    vi.stubGlobal('localStorage', {
      getItem: (key: string) => memory.get(key) ?? null,
      setItem: (key: string, value: string) => memory.set(key, String(value)),
      removeItem: (key: string) => memory.delete(key),
      clear: () => memory.clear(),
    });
    TestBed.configureTestingModule({});
    store = TestBed.inject(ProgressStore);
  });

  it('un usuario nuevo empieza en nivel 1 y sin estrellas', () => {
    const profile = store.loadProfile('Ana');

    expect(profile).toEqual(emptyProfile());
    expect(profile.level).toBe(1);
    expect(profile.stars).toBe(0);
    expect(profile.streak).toBe(0);
  });

  it('guarda y recupera el progreso de un usuario', () => {
    store.saveProfile('Ana', { ...emptyProfile(), stars: 12, level: 2 });

    expect(store.loadProfile('Ana').stars).toBe(12);
    expect(store.loadProfile('Ana').level).toBe(2);
  });

  it('dos nombres distintos no comparten progreso', () => {
    store.saveProfile('Ana', { ...emptyProfile(), stars: 40 });

    expect(store.loadProfile('Luis').stars).toBe(0);
  });

  it('el mismo nombre con otras mayúsculas o espacios es el mismo perfil', () => {
    store.saveProfile('Ana María', { ...emptyProfile(), stars: 7 });

    expect(normalizeName('  ana   MARÍA ')).toBe('ana maría');
    expect(store.loadProfile('  ana   MARÍA ').stars).toBe(7);
  });

  it('recuerda y olvida la sesión', () => {
    store.saveSession({ name: 'Ana', avatar: '/images/Avatar1.png' });
    expect(store.loadSession()?.name).toBe('Ana');

    store.clearSession();
    expect(store.loadSession()).toBeNull();
  });
});

afterEach(() => vi.unstubAllGlobals());

describe('nextStreak', () => {
  const today = new Date(2026, 10, 8);

  it('empieza en 1 si nunca hubo actividad', () => {
    expect(nextStreak(0, null, today)).toBe(1);
  });

  it('no cambia si ya hubo actividad hoy', () => {
    expect(nextStreak(3, '2026-11-08', today)).toBe(3);
  });

  it('suma si la última actividad fue ayer', () => {
    expect(nextStreak(3, '2026-11-07', today)).toBe(4);
  });

  it('reinicia si pasó más de un día', () => {
    expect(nextStreak(5, '2026-11-01', today)).toBe(1);
  });
});

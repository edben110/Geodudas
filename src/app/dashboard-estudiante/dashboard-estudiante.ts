import { CommonModule } from '@angular/common';
import {
  Component,
  HostListener,
  OnInit,
  computed,
  effect,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { IconComponent } from '../shared/icon';
import {
  ProgressStore,
  dayKey,
  nextStreak,
  type Profile,
} from '../shared/progress-store';
import { WorldMapComponent } from '../map/world-map.component';
import {
  MissionsComponent,
  type ActivityReward,
} from '../missions/missions';

type Topic = {
  title: string;
  subtitle: string;
  icon: string;
  progress: number;
  color: string;
};

type Achievement = {
  icon: string;
  title: string;
  description: string;
  unlocked: boolean;
};

@Component({
  selector: 'app-dashboard-estudiante',
  imports: [CommonModule, IconComponent, WorldMapComponent, MissionsComponent],
  templateUrl: './dashboard-estudiante.html',
  styleUrl: './dashboard-estudiante.css',
})
export class DashboardEstudiante implements OnInit {
  private readonly store = inject(ProgressStore);

  readonly studentName = input('Explorador');
  readonly avatar = input<string | null>(null);
  readonly loggedOut = output<void>();

  readonly activeSection = signal('Inicio');
  readonly selectedTopic = signal<Topic | null>(null);

  readonly stars = signal(0);
  readonly level = signal(1);
  readonly streak = signal(0);
  readonly xp = signal(0);
  private readonly lastActiveDay = signal<string | null>(null);
  private readonly loaded = signal(false);

  /** La barra de navegación se esconde al bajar y reaparece al subir. */
  readonly navHidden = signal(false);
  private lastScrollY = 0;
  readonly xpForNextLevel = 500;

  readonly correctAnswers = signal(0);
  readonly colombiaCorrect = signal(0);

  readonly topics = signal<Topic[]>([
    {
      title: 'Mi comunidad',
      subtitle: 'Las personas y lugares que me rodean',
      icon: 'house-line-duotone',
      progress: 0,
      color: 'green',
    },
    {
      title: 'Mi país',
      subtitle: 'Conoce Colombia y sus regiones',
      icon: 'mountains-duotone',
      progress: 0,
      color: 'blue',
    },
    {
      title: 'El mundo',
      subtitle: 'Continentes, océanos y paisajes',
      icon: 'globe-hemisphere-west-duotone',
      progress: 0,
      color: 'orange',
    },
    {
      title: 'Historia',
      subtitle: 'Aventuras para descubrir el pasado',
      icon: 'castle-turret-duotone',
      progress: 0,
      color: 'purple',
    },
    {
      title: 'Culturas del mundo',
      subtitle: 'Tradiciones, comidas y celebraciones',
      icon: 'mask-happy-duotone',
      progress: 0,
      color: 'pink',
    },
  ]);

  readonly navigation = [
    { name: 'Inicio', icon: 'house-bold' },
    { name: 'Misiones', icon: 'target-bold' },
    { name: 'Logros', icon: 'trophy-bold' },
    { name: 'Perfil', icon: 'user-circle-bold' },
  ];

  readonly achievements = computed<Achievement[]>(() => [
    {
      icon: 'footprints-duotone',
      title: 'Primer paso',
      description: 'Acierta tu primera actividad en el mapa.',
      unlocked: this.correctAnswers() >= 1,
    },
    {
      icon: 'globe-hemisphere-east-duotone',
      title: 'Explorador del mundo',
      description: 'Acierta 10 países de los distintos continentes.',
      unlocked: this.correctAnswers() >= 10,
    },
    {
      icon: 'heart-duotone',
      title: 'Colombia en el corazón',
      description: 'Acierta 5 lugares de Colombia.',
      unlocked: this.colombiaCorrect() >= 5,
    },
    {
      icon: 'star-duotone',
      title: 'Coleccionista de estrellas',
      description: 'Reúne 500 estrellas.',
      unlocked: this.stars() >= 500,
    },
  ]);

  private readonly profile = computed<Profile>(() => ({
    stars: this.stars(),
    level: this.level(),
    xp: this.xp(),
    streak: this.streak(),
    lastActiveDay: this.lastActiveDay(),
    correctAnswers: this.correctAnswers(),
    colombiaCorrect: this.colombiaCorrect(),
    topicProgress: Object.fromEntries(
      this.topics().map((topic) => [topic.title, topic.progress]),
    ),
  }));

  constructor() {
    effect(() => {
      const profile = this.profile();

      if (this.loaded()) {
        this.store.saveProfile(this.studentName(), profile);
      }
    });
  }

  ngOnInit(): void {
    const saved = this.store.loadProfile(this.studentName());
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    const streakAlive =
      saved.lastActiveDay === dayKey(today) ||
      saved.lastActiveDay === dayKey(yesterday);

    this.stars.set(saved.stars);
    this.level.set(saved.level);
    this.xp.set(saved.xp);
    this.streak.set(streakAlive ? saved.streak : 0);
    this.lastActiveDay.set(saved.lastActiveDay);
    this.correctAnswers.set(saved.correctAnswers);
    this.colombiaCorrect.set(saved.colombiaCorrect);
    this.topics.update((topics) =>
      topics.map((topic) => ({
        ...topic,
        progress: saved.topicProgress[topic.title] ?? 0,
      })),
    );
    this.loaded.set(true);
  }

  @HostListener('window:scroll')
  onScroll(): void {
    const y = window.scrollY;
    const delta = y - this.lastScrollY;
    const atTop = y <= 16;

    if (atTop) {
      this.navHidden.set(false);
      this.lastScrollY = y;
    } else if (Math.abs(delta) >= 8) {
      // El ancla solo avanza al superar el umbral: el scroll lento también cuenta.
      this.navHidden.set(delta > 0);
      this.lastScrollY = y;
    }
  }

  logout(): void {
    this.loggedOut.emit();
  }

  selectSection(section: string): void {
    this.navHidden.set(false);
    this.lastScrollY = window.scrollY;
    this.activeSection.set(section);
  }

  openTopic(topic: Topic): void {
    this.selectedTopic.set(topic);
  }

  closeTopic(): void {
    this.selectedTopic.set(null);
  }

  exploreTopic(topic: Topic): void {
    this.selectedTopic.set(null);
    this.activeSection.set('Misiones');
  }

  onActivityCompleted(reward: ActivityReward): void {
    this.streak.set(nextStreak(this.streak(), this.lastActiveDay()));
    this.lastActiveDay.set(dayKey());
    this.correctAnswers.update((count) => count + 1);
    this.stars.update((stars) => stars + reward.stars);

    if (reward.missionId === 'colombia') {
      this.colombiaCorrect.update((count) => count + 1);
    }

    this.addExperience(reward.xp);
    this.topics.update((topics) =>
      topics.map((topic) =>
        topic.title === reward.topic
          ? {
              ...topic,
              progress: Math.min(100, topic.progress + reward.progressDelta),
            }
          : topic,
      ),
    );
  }

  private addExperience(amount: number): void {
    let xp = this.xp() + amount;
    let level = this.level();

    while (xp >= this.xpForNextLevel) {
      xp -= this.xpForNextLevel;
      level += 1;
    }

    this.xp.set(xp);
    this.level.set(level);
  }
}

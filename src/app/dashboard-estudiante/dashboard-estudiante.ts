import { CommonModule } from '@angular/common';
import { Component, computed, input, signal } from '@angular/core';
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
  imports: [CommonModule, WorldMapComponent, MissionsComponent],
  templateUrl: './dashboard-estudiante.html',
  styleUrl: './dashboard-estudiante.css',
})
export class DashboardEstudiante {
  readonly studentName = input('Explorador');
  readonly avatar = input<string | null>(null);

  readonly activeSection = signal('Inicio');
  readonly selectedTopic = signal<Topic | null>(null);

  readonly stars = signal(320);
  readonly level = signal(3);
  readonly streak = signal(5);
  readonly xp = signal(350);
  readonly xpForNextLevel = 500;

  readonly correctAnswers = signal(0);
  readonly colombiaCorrect = signal(0);

  readonly topics = signal<Topic[]>([
    {
      title: 'Mi comunidad',
      subtitle: 'Las personas y lugares que me rodean',
      icon: '🏡',
      progress: 50,
      color: 'green',
    },
    {
      title: 'Mi país',
      subtitle: 'Conoce Colombia y sus regiones',
      icon: '🇨🇴',
      progress: 67,
      color: 'blue',
    },
    {
      title: 'El mundo',
      subtitle: 'Continentes, océanos y paisajes',
      icon: '🌍',
      progress: 33,
      color: 'orange',
    },
    {
      title: 'Historia',
      subtitle: 'Aventuras para descubrir el pasado',
      icon: '🏰',
      progress: 17,
      color: 'purple',
    },
    {
      title: 'Culturas del mundo',
      subtitle: 'Tradiciones, comidas y celebraciones',
      icon: '🎭',
      progress: 50,
      color: 'pink',
    },
  ]);

  readonly navigation = [
    { name: 'Inicio', icon: '🏠' },
    { name: 'Misiones', icon: '📝' },
    { name: 'Logros', icon: '🏆' },
    { name: 'Perfil', icon: '⭐' },
  ];

  readonly achievements = computed<Achievement[]>(() => [
    {
      icon: '🧭',
      title: 'Primer paso',
      description: 'Acierta tu primera actividad en el mapa.',
      unlocked: this.correctAnswers() >= 1,
    },
    {
      icon: '🌍',
      title: 'Explorador del mundo',
      description: 'Acierta 10 países de los distintos continentes.',
      unlocked: this.correctAnswers() >= 10,
    },
    {
      icon: '🇨🇴',
      title: 'Colombia en el corazón',
      description: 'Acierta 5 lugares de Colombia.',
      unlocked: this.colombiaCorrect() >= 5,
    },
    {
      icon: '⭐',
      title: 'Coleccionista de estrellas',
      description: 'Reúne 500 estrellas.',
      unlocked: this.stars() >= 500,
    },
  ]);

  selectSection(section: string): void {
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

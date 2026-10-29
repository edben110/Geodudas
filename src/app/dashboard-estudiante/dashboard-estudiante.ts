import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild, input, signal } from '@angular/core';
import type { Map } from 'maplibre-gl';

type Topic = {
  title: string;
  subtitle: string;
  icon: string;
  progress: number;
  color: string;
};

@Component({
  selector: 'app-dashboard-estudiante',
  imports: [CommonModule],
  templateUrl: './dashboard-estudiante.html',
  styleUrl: './dashboard-estudiante.css',
})
export class DashboardEstudiante implements AfterViewInit, OnDestroy {
  @ViewChild('worldMap') private readonly worldMapElement?: ElementRef<HTMLDivElement>;
  private worldMap?: Map;
  private destroyed = false;

  readonly studentName = input('Explorador');
  readonly avatar = input<string | null>(null);

  readonly activeSection = signal('Inicio');
  readonly selectedTopic = signal<Topic | null>(null);

  readonly stars = 320;
  readonly level = 3;
  readonly streak = 5;
  readonly xp = 350;
  readonly xpForNextLevel = 500;

  readonly topics: Topic[] = [
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
  ];

  readonly navigation = [
    { name: 'Inicio', icon: '🏠' },
    { name: 'Misiones', icon: '📝' },
    { name: 'Logros', icon: '🏆' },
    { name: 'Perfil', icon: '⭐' },
  ];

  async ngAfterViewInit(): Promise<void> {
    if (!this.worldMapElement) {
      return;
    }

    const { createWorldMap } = await import('../map/worldMap');
    if (this.destroyed) {
      return;
    }

    this.worldMap = createWorldMap(this.worldMapElement.nativeElement);
  }

  ngOnDestroy(): void {
    this.destroyed = true;
    this.worldMap?.remove();
  }

  selectSection(section: string): void {
    this.activeSection.set(section);
  }

  openTopic(topic: Topic): void {
    this.selectedTopic.set(topic);
  }

  closeTopic(): void {
    this.selectedTopic.set(null);
  }
}
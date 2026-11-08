import { CommonModule } from '@angular/common';
import { Component, computed, output, signal } from '@angular/core';
import { IconComponent } from '../shared/icon';
import { WorldMapComponent } from '../map/world-map.component';
import type { CountryProperties, MapMode } from '../map/worldMap';
import { countryMatchesTarget } from '../map/worldMap';
import type { ColombiaPlace } from '../map/colombia-places';
import {
  COLOMBIA_MISSION_PLACES,
  CONTINENTS,
  MISSIONS,
  pickRandom,
  shuffle,
  type ActivityQuestion,
  type CountryTarget,
  type MissionDefinition,
  type MissionId,
} from './activity-data';

export interface ActivityReward {
  missionId: MissionId;
  topic: string;
  xp: number;
  stars: number;
  progressDelta: number;
}

type MissionPhase = 'hub' | 'playing' | 'summary';

const XP_PER_CORRECT = 20;
const STARS_PER_CORRECT = 5;
const PROGRESS_PER_CORRECT = 8;
const QUESTIONS_PER_MISSION = 6;

@Component({
  selector: 'app-missions',
  imports: [CommonModule, IconComponent, WorldMapComponent],
  templateUrl: './missions.html',
  styleUrl: './missions.css',
})
export class MissionsComponent {
  readonly activityCompleted = output<ActivityReward>();

  readonly missions = MISSIONS;
  readonly phase = signal<MissionPhase>('hub');
  readonly activeMission = signal<MissionDefinition | null>(null);
  readonly questions = signal<ActivityQuestion[]>([]);
  readonly currentIndex = signal(0);
  readonly currentQuestion = computed(
    () => this.questions()[this.currentIndex()] ?? null,
  );
  readonly correctCount = signal(0);
  readonly answered = signal(false);
  readonly lastAnswerCorrect = signal<boolean | null>(null);
  readonly feedback = signal('');
  readonly flagFailed = signal(false);

  readonly totalQuestions = computed(() => this.questions().length);
  readonly mapMode = computed<MapMode>(() =>
    this.activeMission()?.id === 'colombia' ? 'colombia' : 'activity',
  );
  readonly mapContinent = computed(() =>
    this.activeMission()?.id === 'colombia'
      ? null
      : (this.currentQuestion()?.continent ?? null),
  );
  readonly mapHighlight = computed(() =>
    this.answered() ? (this.currentQuestion()?.country ?? null) : null,
  );
  readonly mapHighlightPlaceId = computed(() =>
    this.answered() ? (this.currentQuestion()?.place?.id ?? null) : null,
  );
  readonly mapShowPlaces = computed(
    () => this.activeMission()?.id === 'colombia',
  );
  readonly mapAriaLabel = computed(() =>
    this.activeMission()?.id === 'colombia'
      ? 'Mapa de Colombia con puntos interactivos'
      : 'Mapa interactivo de países',
  );
  readonly missionProgress = computed(() => {
    if (!this.totalQuestions()) {
      return 0;
    }

    const completed = this.currentIndex() + (this.answered() ? 1 : 0);
    return Math.round((completed / this.totalQuestions()) * 100);
  });
  readonly earnedXp = computed(() => this.correctCount() * XP_PER_CORRECT);
  readonly earnedStars = computed(
    () => this.correctCount() * STARS_PER_CORRECT,
  );
  readonly earnedProgress = computed(
    () => this.correctCount() * PROGRESS_PER_CORRECT,
  );
  readonly summaryMessage = computed(() => {
    const correct = this.correctCount();

    if (correct === this.totalQuestions()) {
      return '¡Perfecto! Dominaste todos los retos de esta misión.';
    }

    if (correct >= this.totalQuestions() / 2) {
      return '¡Muy buen trabajo! Cada intento te acerca más a dominar el mapa.';
    }

    return '¡Buen comienzo! Repite la misión para descubrir más lugares.';
  });

  startMission(mission: MissionDefinition): void {
    this.activeMission.set(mission);
    this.questions.set(this.buildQuestions(mission.id));
    this.currentIndex.set(0);
    this.correctCount.set(0);
    this.answered.set(false);
    this.lastAnswerCorrect.set(null);
    this.feedback.set('');
    this.flagFailed.set(false);
    this.phase.set('playing');
  }

  onCountrySelected(country: CountryProperties): void {
    const question = this.currentQuestion();

    if (!question?.country || this.answered()) {
      return;
    }

    const correct = countryMatchesTarget(country, question.country);
    this.resolveAnswer(
      correct,
      correct
        ? `¡Muy bien! ${question.country.name} está en ${question.continentName}.`
        : `La respuesta correcta era ${question.country.name}, en ${question.continentName}.`,
    );
  }

  onPlaceSelected(place: ColombiaPlace): void {
    const question = this.currentQuestion();

    if (!question?.place || this.answered()) {
      return;
    }

    const correct = place.id === question.place.id;
    this.resolveAnswer(
      correct,
      correct
        ? `¡Muy bien! ${question.place.name} está en ${question.place.department}.`
        : `La respuesta correcta era ${question.place.name}, en ${question.place.department}.`,
    );
  }

  nextQuestion(): void {
    if (this.currentIndex() + 1 >= this.totalQuestions()) {
      this.phase.set('summary');
      return;
    }

    this.currentIndex.update((index) => index + 1);
    this.answered.set(false);
    this.lastAnswerCorrect.set(null);
    this.feedback.set('');
    this.flagFailed.set(false);
  }

  restartMission(): void {
    const mission = this.activeMission();

    if (mission) {
      this.startMission(mission);
    }
  }

  backToHub(): void {
    this.phase.set('hub');
    this.activeMission.set(null);
    this.questions.set([]);
    this.currentIndex.set(0);
    this.correctCount.set(0);
    this.answered.set(false);
    this.lastAnswerCorrect.set(null);
    this.feedback.set('');
    this.flagFailed.set(false);
  }

  flagUrl(country: CountryTarget): string {
    return `https://flagcdn.com/w160/${country.iso2.toLowerCase()}.png`;
  }

  flagEmoji(country: CountryTarget): string {
    return country.iso2
      .toUpperCase()
      .replace(
        /./g,
        (character) => String.fromCodePoint(127397 + character.charCodeAt(0)),
      );
  }

  missionTag(mission: MissionDefinition): string {
    return mission.id === 'colombia' ? '6 lugares de Colombia' : '6 continentes';
  }

  private resolveAnswer(correct: boolean, message: string): void {
    this.answered.set(true);
    this.lastAnswerCorrect.set(correct);
    this.feedback.set(message);

    if (!correct) {
      return;
    }

    this.correctCount.update((count) => count + 1);

    const mission = this.activeMission();
    if (!mission) {
      return;
    }

    this.activityCompleted.emit({
      missionId: mission.id,
      topic: mission.topic,
      xp: XP_PER_CORRECT,
      stars: STARS_PER_CORRECT,
      progressDelta: PROGRESS_PER_CORRECT,
    });
  }

  private buildQuestions(missionId: MissionId): ActivityQuestion[] {
    if (missionId === 'colombia') {
      return shuffle(COLOMBIA_MISSION_PLACES)
        .slice(0, QUESTIONS_PER_MISSION)
        .map((place) => ({
          id: `colombia-${place.id}`,
          continent: 'South America',
          continentName: 'Colombia',
          place,
          prompt: `Toca el punto de ${place.name}.`,
          hint: `Departamento: ${place.department}. ${place.clue}`,
        }));
    }

    return shuffle(CONTINENTS).map((continent) => {
      const country = pickRandom(continent.countries);
      const isFlagMission = missionId === 'banderas';

      return {
        id: `${missionId}-${country.iso2}`,
        continent: continent.id,
        continentName: continent.name,
        country,
        prompt: isFlagMission
          ? '¿A qué país pertenece esta bandera?'
          : `Encuentra ${country.name} en el mapa.`,
        hint: isFlagMission
          ? `Continente: ${continent.name}.`
          : `Está en ${continent.name}. Su capital es ${country.capital}.`,
      };
    });
  }
}

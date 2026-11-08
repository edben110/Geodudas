import { Component, input } from '@angular/core';

@Component({
  selector: 'app-icon',
  template: `
    <span
      class="icon"
      aria-hidden="true"
      [style.mask-image]="url()"
      [style.-webkit-mask-image]="url()"
    ></span>
  `,
  styles: [
    `
      :host {
        display: inline-flex;
        width: 1em;
        height: 1em;
        flex: 0 0 auto;
        vertical-align: -0.125em;
      }

      .icon {
        width: 100%;
        height: 100%;
        background-color: currentColor;
        mask-repeat: no-repeat;
        mask-position: center;
        mask-size: contain;
        -webkit-mask-repeat: no-repeat;
        -webkit-mask-position: center;
        -webkit-mask-size: contain;
      }
    `,
  ],
})
export class IconComponent {
  /** Nombre del archivo en /icons sin extensión, p. ej. "compass-duotone". */
  readonly name = input.required<string>();

  protected url(): string {
    return `url(/icons/${this.name()}.svg)`;
  }
}

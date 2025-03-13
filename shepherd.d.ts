// shepherd.d.ts
declare namespace Shepherd {
    export class Tour {
      constructor(options: TourOptions);
      addStep(options: TourStepOptions): Tour;
      start(): void;
      next(): void;
      cancel(): void;
      isActive(): boolean;
      on(event: string, callback: () => void): void;
      steps: TourStep[];
    }
    export interface TourOptions {
      useModalOverlay?: boolean;
      defaultStepOptions?: {
        classes?: string;
        scrollTo?: boolean;
        cancelIcon?: { enabled?: boolean };
        when?: { show?: () => void };
      };
    }
    export interface TourStepOptions {
      id?: string;
      text?: string;
      attachTo?: { element: string; on: string };
      buttons?: { text: string; action: () => void }[];
      cancelIcon?: { enabled?: boolean };
      when?: { show?: () => void };
    }
    export interface TourStep {
        el: HTMLElement;
    }
  }
  
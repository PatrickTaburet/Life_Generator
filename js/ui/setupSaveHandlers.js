import { appStates } from '../core/appStates.js';
import { saveCanvasImage } from '../utils/utils.js';

export function setupSaveHandlers(p) {
    // Save canva screenshot
    p.keyPressed = () => {
        if (p.key === ' ') saveCanvasImage(p);
    };
  
    document
        .querySelector(`${appStates.isMobile ? '.save-button-mobile' : '.save-button'}`)
        .addEventListener('click', () => saveCanvasImage(p));
}
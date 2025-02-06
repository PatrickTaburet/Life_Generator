import { appStates } from '../core/appStates.js';
import { saveCanvasImage } from '../utils/utils.js';

export function setupEventHandlers(p) {

    // Mouse pressed repulsive impact
    p.mousePressed = () => (appStates.isMousePressed = true);
    p.mouseReleased = () => (appStates.isMousePressed = false);
    p.touchStarted = () => (appStates.isMousePressed = true);
    p.touchEnded = () => (appStates.isMousePressed = false);

    // Save canva screenshot
    p.keyPressed = () => {
        if (p.key === ' ') saveCanvasImage(p);
    };
  
    document
        .querySelector(`${appStates.isMobile ? '.save-button-mobile' : '.save-button'}`)
        .addEventListener('click', () => saveCanvasImage(p));
}
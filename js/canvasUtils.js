import { appStates } from './appStates.js';

export function saveCanvasImage(p) {
    const userConfirmation = confirm("Do you want to save this image?");
    if (userConfirmation) p.saveCanvas('myArtwork', 'png');
}

export function calculateCanvasSize() {
    const width = appStates.isMobile ? (window.innerWidth * 0.9) : (window.innerWidth * 0.6);
    const height = appStates.isMobile ? (window.innerHeight / 1.8) : (window.innerHeight * 0.78);
    return { width, height };
}
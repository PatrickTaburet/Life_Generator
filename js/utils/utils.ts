/*
 * Copyright (c) 2025 Patrick Taburet
 * This file is licensed under the MIT License.
 * See the LICENSE file in the root directory for more details.
 */
import p5 from "p5";
import { appStates } from '../core/appStates.js';

// Canvas
export function saveCanvasImage(p: p5) {
    const userConfirmation = confirm("Do you want to save this image?");
    if (userConfirmation) p.saveCanvas('myArtwork', 'png');
}

export function calculateCanvasSize(): { width: number; height: number } {
    const width = appStates.isMobile ? (window.innerWidth * 0.9) : (window.innerWidth * 0.6);
    const height = appStates.isMobile ? (window.innerHeight / 1.8) : (window.innerHeight * 0.78);
    return { width, height };
}


// Description card position

export function toggleDescriptionCard() {
    const checkbox = document.getElementById('cb1');
    if (!appStates.isMobile && checkbox instanceof HTMLInputElement) {
        checkbox.checked = true;
    }
}

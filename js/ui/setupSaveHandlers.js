/*
 * Copyright (c) 2025 Patrick Taburet
 * This file is licensed under the MIT License.
 * See the LICENSE file in the root directory for more details.
 */

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
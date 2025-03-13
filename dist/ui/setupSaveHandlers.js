/*
 * Copyright (c) 2025 Patrick Taburet
 * This file is licensed under the MIT License.
 * See the LICENSE file in the root directory for more details.
 */
import { appStates } from '../core/appStates.js';
import { saveCanvasImage } from '../utils/utils.js';
export function setupSaveHandlers(p) {
    var _a;
    // Save canva screenshot
    p.keyPressed = () => {
        if (p.key === ' ')
            saveCanvasImage(p);
    };
    (_a = document.querySelector(`${appStates.isMobile ? '.save-button-mobile' : '.save-button'}`)) === null || _a === void 0 ? void 0 : _a.addEventListener('click', () => saveCanvasImage(p));
}

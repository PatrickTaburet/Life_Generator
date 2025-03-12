/*
 * Copyright (c) 2025 Patrick Taburet
 * This file is licensed under the MIT License.
 * See the LICENSE file in the root directory for more details.
 */
var _a;
import * as dat from "dat.gui";
import { getP5Instance } from '../core/p5Instance.js';
import { setupParticles, clearParticles, updateParticles } from '../particles/particlesManager.js';
import { appStates } from '../core/appStates.js';
//////////////  dat.GUI interface settings //////////////
let colorManagerFolder, particlesSettings, globalSettings, drawingFolder, guiMain, guiColorManager, guiContainer;
let colorFolders = {};
export const colors = ["Red", "Cyan", "Blue", "Orange"];
export const props = {
    'backgroundColor': [0, 0, 0],
    'Max distance interaction': (appStates.isMobile ? 50 : 100),
    'Scale': 1,
    'Reset': resetProps,
    'Random': randomizeProps,
    'drawingMode': () => {
        appStates.isBackground = !appStates.isBackground;
        updateButtonColor('#drawing-mode-button', !appStates.isBackground);
    },
    'nexusMode': () => {
        appStates.isNexus = !appStates.isNexus;
        updateButtonColor('#nexus-mode-button', appStates.isNexus);
        updateSliderConstraints();
        updateParticles();
    },
    'backgroundAlpha': 150,
    'particleSize': (appStates.isMobile ? 3 : 4),
    'timeScale': 1,
    'FPS': 0,
    'mouseImpactCoef': 1,
};
export function setupGUI() {
    var _a;
    const p = getP5Instance();
    // --- Main interface ---
    guiMain = new dat.GUI();
    guiMain.domElement.classList.add('gui-main');
    // Global settings
    globalSettings = guiMain.addFolder("Global Settings");
    let globalSettingsElement = globalSettings.domElement;
    globalSettingsElement.classList.add('step4');
    addStyledButton(globalSettings, 'Reset', 'randomButton-element');
    addStyledButton(globalSettings, 'Random', 'resetButton-element');
    globalSettings.add(props, 'Max distance interaction', 0, (appStates.isMobile ? 150 : 200), 1);
    // Zoom effect slider
    globalSettings.add(props, 'Scale', 0.1, 2, 0.1).name("Zoom").onChange(() => {
        clearParticles();
        setupParticles(p);
    });
    // Time scale
    globalSettings.add(props, 'timeScale', 0.1, 2, 0.1).name("Time Scale");
    globalSettings.add(props, 'mouseImpactCoef', 0.1, 4, 0.1).name("Click Impact");
    globalSettings.add(props, 'FPS').name("FPS").listen();
    // Particles settings
    particlesSettings = guiMain.addFolder("Particles Rules");
    let particlesSettingsElement = particlesSettings.domElement;
    particlesSettingsElement.classList.add('step3');
    colors.forEach(color => {
        props[`${color} Particles`] = (appStates.isMobile ? 50 : 100);
        props[`${color} Visible`] = true;
        colorFolders[color] = particlesSettings.addFolder(color);
        colorFolders[color].open();
        colorFolders[color].add(props, `${color} Particles`, 1, (appStates.isMobile ? 150 : 300), 1).name('Particles').onChange(updateParticles);
        // Color title
        const folderTitle = colorFolders[color].__ul.querySelector('.dg .title');
        if (folderTitle)
            folderTitle.style.color = color;
        colors.forEach(otherColor => {
            var _a;
            props[`${color[0]} <--> ${otherColor[0]}`] = 0;
            const slider = colorFolders[color].add(props, `${color[0]} <--> ${otherColor[0]}`, -5, 5, 0.05);
            // Dynamic color letters for label interaction sliders
            const labelElement = (_a = slider.domElement.parentElement) === null || _a === void 0 ? void 0 : _a.querySelector('.property-name');
            if (labelElement) {
                labelElement.innerHTML = `<span style="color:${color.toLowerCase()}">${color[0]}</span> <--> <span style="color:${otherColor.toLowerCase()}">${otherColor[0]}</span>`;
            }
        });
    });
    // --- Drawing interface / Color manager---
    // Color manager 
    guiColorManager = new dat.GUI({ name: "Color Manager" });
    guiColorManager.domElement.classList.add('gui-color');
    colorManagerFolder = guiColorManager.addFolder("Color Manager");
    let colorManagerElement = colorManagerFolder.domElement;
    colorManagerElement.id = 'color-manager';
    // Checkboxes for colors
    colors.forEach(color => {
        colorManagerFolder.add(props, `${color} Visible`).name(`${color} Visible`).onChange(updateParticles);
    });
    // Drawing settings
    drawingFolder = guiColorManager.addFolder("Drawing");
    let drawingFolderElement = drawingFolder.domElement;
    drawingFolderElement.id = 'drawing-folder';
    // Trails effect slider
    drawingFolder.add(props, 'backgroundAlpha', 1, 150, 1).name("Trails");
    // Particles shape
    drawingFolder.add(props, 'particleSize', 1, 20, 0.5).name("Particles Radius");
    drawingFolder.addColor(props, 'backgroundColor').name(`${appStates.isMobile ? 'Background' : 'Background Color'}`).onChange(() => {
        p.background(props.backgroundColor[0], props.backgroundColor[1], props.backgroundColor[2], props['backgroundAlpha']);
    });
    // Nexus mode button
    let nexusButton = guiColorManager.add(props, `nexusMode`).name(`Nexus Mode`).onChange(updateParticles);
    let nexusButtonElement = nexusButton.domElement;
    nexusButtonElement.id = 'nexus-mode-button';
    let nexusButtonClass = (_a = nexusButton.domElement.parentElement) === null || _a === void 0 ? void 0 : _a.parentElement;
    ;
    nexusButtonClass === null || nexusButtonClass === void 0 ? void 0 : nexusButtonClass.classList.add('nexus-mode');
    updateButtonColor('#nexus-mode-button', true, '#21bbe6');
    // Drawing mode button
    addStyledButton(guiColorManager, 'drawingMode', 'drawing-mode-button', 'Drawing Mode');
    // Open folders by default
    colorManagerFolder.open();
    particlesSettings.open();
    globalSettings.open();
    drawingFolder.open();
    if (appStates.isMobile) {
        guiMain.close();
        guiColorManager.close();
    }
    // GUI global container
    const container = document.querySelector(".dg.ac");
    if (!(container instanceof HTMLElement)) {
        throw new Error("GUI global container not found.");
    }
    guiContainer = container;
    return { guiMain, guiColorManager, guiContainer };
}
// Manage buttons style
function addStyledButton(folder, propName, id, buttonText = null, defaultColor = '#21bbe6') {
    let button = buttonText
        ? folder.add(props, propName).name(buttonText)
        : folder.add(props, propName);
    button.domElement.id = id;
    updateButtonColor(`#${id}`, true, defaultColor);
    // return button;
}
function updateButtonColor(buttonId, boolVariable, mainColor = 'red', secondColor = '#21bbe6') {
    const element = document.querySelector(buttonId);
    if (!element) {
        throw new Error(`Element with selector "${buttonId}" not found.`);
    }
    if (!element.parentElement) {
        throw new Error(`Parent element of element with selector "${buttonId}" not found.`);
    }
    const Button = element.parentElement;
    if (Button) {
        const propertyNameElement = Button.querySelector('.property-name');
        if (propertyNameElement instanceof HTMLElement) {
            propertyNameElement.style.color = boolVariable ? mainColor : secondColor;
        }
    }
}
// Manage props values
function resetProps() {
    colors.forEach(color => {
        props[`${color} Particles`] = (appStates.isMobile ? 50 : 100);
        props[`${color} Visible`] = true;
        colors.forEach(otherColor => {
            props[`${color[0]} <--> ${otherColor[0]}`] = 0;
        });
    });
    props['Max distance interaction'] = (appStates.isMobile ? 50 : 100);
    props['Scale'] = 1;
    props['backgroundAlpha'] = 150;
    appStates.isNexus = false;
    updateButtonColor('#nexus-mode-button', appStates.isNexus);
    updateSliderConstraints();
    appStates.isBackground = true;
    updateButtonColor('#drawing-mode-button', !appStates.isBackground);
    updateParticles();
}
function randomizeProps() {
    colors.forEach(color => {
        props[`${color} Particles`] = Math.floor(Math.random() * (appStates.isNexus ? (appStates.isMobile ? 80 : 150) : (appStates.isMobile ? 150 : 300)));
        colors.forEach(otherColor => {
            props[`${color[0]} <--> ${otherColor[0]}`] = (Math.random() * 10) - 5;
        });
    });
    props['Max distance interaction'] = Math.floor(Math.random() * (appStates.isNexus ? (appStates.isMobile ? 100 : 150) : (appStates.isMobile ? 150 : 200)));
    updateParticles();
}
// NexusMode : constrain the particles number and max distance sliders to prevent excessive resource usage and ensure smoother performance
function updateSliderConstraints() {
    colors.forEach(color => {
        const colorParticleController = guiMain.__folders["Particles Rules"].__folders[color].__controllers[0];
        if (appStates.isNexus && props[`${color} Particles`] >= 150) {
            props[`${color} Particles`] = (appStates.isMobile ? 80 : 150);
        }
        if (colorParticleController) {
            colorParticleController.max(appStates.isNexus ? (appStates.isMobile ? 80 : 150) : (appStates.isMobile ? 150 : 300));
            colorParticleController.updateDisplay();
        }
    });
    const maxDistanceController = guiMain.__folders["Global Settings"].__controllers.find(ctrl => ctrl.property === 'Max distance interaction');
    if (maxDistanceController) {
        if (appStates.isNexus && props['Max distance interaction'] >= 100) {
            props['Max distance interaction'] = (appStates.isMobile ? 50 : 100);
        }
        maxDistanceController.max(appStates.isNexus ? (appStates.isMobile ? 100 : 150) : 200);
        maxDistanceController.updateDisplay();
    }
    const scaleController = guiMain.__folders["Global Settings"].__controllers.find(ctrl => ctrl.property === 'Scale');
    if (scaleController) {
        if (appStates.isNexus && props['Scale'] >= 1.5) {
            props['Scale'] = (appStates.isMobile ? 1.5 : props['Scale']);
        }
        scaleController.max(appStates.isNexus && appStates.isMobile ? 1.5 : 2);
        maxDistanceController === null || maxDistanceController === void 0 ? void 0 : maxDistanceController.updateDisplay();
    }
}
// "How to use" tutorial : open all GUI folders when tutorial start
!appStates.isMobile && ((_a = document.querySelector('#how-to-use')) === null || _a === void 0 ? void 0 : _a.addEventListener("click", openGuiFolers));
export function openGuiFolers() {
    guiMain.open();
    guiColorManager.open();
    colorManagerFolder.open();
    particlesSettings.open();
    globalSettings.open();
    drawingFolder.open();
    colors.forEach(color => {
        colorFolders[color].open();
    });
    const checkbox = document.getElementById('cb1');
    if (checkbox instanceof HTMLInputElement)
        checkbox.checked = appStates.isMobile ? false : true;
}

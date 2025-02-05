// import * as dat from 'dat.gui';
import { getP5Instance } from './p5Instance.js';
import { getParticles, setupParticles, clearParticles } from './particlesManager.js';
console.log("guisettings");

//////////////  dat.GUI interface settings //////////////

let colorManagerFolder, particlesSettings, globalSettings, drawingFolder;
export let isBackground = true;
export let isNexus = false;
export let isMobile =  window.innerWidth < 767;
let colorFolders = {};
let checkbox = document.getElementById('cb1');


export const colors = ["Red", "Cyan", "Blue", "Orange"];

export const props = {
    'backgroundColor': [0, 0, 0],
    'Max distance interaction': (isMobile ? 50 : 100),
    'Scale': 1,
    'Reset': resetProps,
    'Random': randomizeProps,
    'drawingMode': () => {
        isBackground = !isBackground;
        updateButtonColor('#drawing-mode-button', !isBackground);
    },
    'nexusMode': () => {            
        isNexus = !isNexus;
        updateButtonColor('#nexus-mode-button', isNexus);
        updateSliderConstraints(); 
        updateParticles();
    },
    'backgroundAlpha' : 150,
    'particleSize' : (isMobile ? 3 : 4),
    'timeScale': 1,
    'FPS': 0,
    'mouseImpactCoef' : 1,
};

function updateButtonColor(buttonId, boolVariable, mainColor = 'red', secondColor = '#21bbe6' ) {
    const Button = document.querySelector(buttonId).parentElement;
    if (Button) {
        Button.querySelector('.property-name').style.color = boolVariable ? mainColor : secondColor;
    }
}

export function setupGUI(){
    const p = getP5Instance();
    // --- Main interface ---
    
    const guiMain = new dat.GUI();
    guiMain.domElement.classList.add('gui-main');
    
    // Global settings

    globalSettings = guiMain.addFolder("Global Settings");
    let globalSettingsElement = globalSettings.domElement;
    globalSettingsElement.classList.add('step4');

    let resetButton = globalSettings.add(props, 'Reset');
    let resetButtonElement = resetButton.domElement;
    resetButtonElement.id = 'resetButton-element';
    updateButtonColor('#resetButton-element', true, '#21bbe6');

    let randomButton = globalSettings.add(props, 'Random');
    let randomButtonElement = randomButton.domElement;
    randomButtonElement.id = 'randomButton-element';
    updateButtonColor('#randomButton-element', true, '#21bbe6');

    globalSettings.add(props, 'Max distance interaction', 0, (isMobile ? 150 : 200), 1);
 
    // Zoom effect slider
    globalSettings.add(props, 'Scale', 0.1, 2, 0.1).name("Zoom").onChange(() => {
        clearParticles();
        setupParticles();
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
        props[`${color} Particles`] = (isMobile ? 50 : 100);
        props[`${color} Visible`] = true; 
        colorFolders[color]  = particlesSettings.addFolder(color);
        colorFolders[color].open();
        colorFolders[color].add(props, `${color} Particles`, 1, (isMobile ? 150 : 300), 1).name('Particles').onChange(updateParticles);
        
        // Color title
        const folderTitle = colorFolders[color].__ul.querySelector('.dg .title');
        if (folderTitle) folderTitle.style.color = color;

        colors.forEach(otherColor => {
            props[`${color[0]} <--> ${otherColor[0]}`] = 0;

            const slider = colorFolders[color].add(props, `${color[0]} <--> ${otherColor[0]}`, -5, 5, 0.05);

            // Dynamic color letters for label interaction sliders
            const labelElement = slider.domElement.parentElement.querySelector('.property-name');

             if (labelElement) {
                labelElement.innerHTML = `<span style="color:${color.toLowerCase()}">${color[0]}</span> <--> <span style="color:${otherColor.toLowerCase()}">${otherColor[0]}</span>`;
            }

        })
    });

    // --- Drawing interface ---

    // Color manager 
    const guiColorManager = new dat.GUI({ name: "Color Manager" });

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
    drawingFolder.addColor(props, 'backgroundColor').name(`${isMobile ? 'Background' : 'Background Color'}`).onChange(() => {
        p.background(props.backgroundColor[0], props.backgroundColor[1], props.backgroundColor[2], props['backgroundAlpha']);
    });
    // Nexus mode button
    let nexusButton = guiColorManager.add(props, `nexusMode`).name(`Nexus Mode`).onChange(updateParticles);
    let nexusButtonElement = nexusButton.domElement;
    nexusButtonElement.id = 'nexus-mode-button';
    let nexusButtonClass = nexusButton.domElement.parentElement.parentElement;;
    nexusButtonClass.classList.add('nexus-mode');
    updateButtonColor('#nexus-mode-button', true, '#21bbe6');

    // Drawing mode button
    let drawingButton = guiColorManager.add(props, 'drawingMode').name("Drawing Mode");
    let drawingButtonElement = drawingButton.domElement;
    drawingButtonElement.id = 'drawing-mode-button';
    updateButtonColor('#drawing-mode-button', true, '#21bbe6');

    // Open folders by default

    colorManagerFolder.open();
    particlesSettings.open();
    globalSettings.open();
    drawingFolder.open();
    // if (window.innerWidth < 480) {
    //     guiMain.close();
    //     guiColorManager.close();
    // }
    if(isMobile) {
        guiMain.close();
        guiColorManager.close();
    }     

    return { guiMain, guiColorManager };
}



function resetProps() {
    colors.forEach(color => {
        props[`${color} Particles`] = (isMobile ? 50 : 100);
        props[`${color} Visible`] = true;
        colors.forEach(otherColor => {
            props[`${color[0]} <--> ${otherColor[0]}`] = 0;
        })
    });
    props['Max distance interaction'] = (isMobile ? 50 : 100);
    props['Scale'] = 1;
    props['backgroundAlpha'] = 150;
    isNexus = false;
    updateButtonColor('#nexus-mode-button', isNexus);
    updateSliderConstraints(); 
    isBackground = true;
    updateButtonColor('#drawing-mode-button', !isBackground);
    updateParticles();
}

function randomizeProps(){
    colors.forEach(color => {
        props[`${color} Particles`] = Math.floor(Math.random() * (isNexus ? (isMobile ? 80 : 150) : (isMobile ? 150 : 300) ));
        colors.forEach(otherColor => {
            props[`${color[0]} <--> ${otherColor[0]}`] = (Math.random() * 10) - 5;
        })
    });
    props['Max distance interaction'] = Math.floor(Math.random() * (isNexus ?  (isMobile ? 100 : 150) : (isMobile ? 150 : 200)));
    updateParticles();
}

export function updateParticles() {
    const p = getP5Instance();
    clearParticles(); 
    p.background(0);
    setupParticles();
    guiMain.updateDisplay();
    guiColorManager.updateDisplay();
}


// Constrain the particles number and max distance sliders when NexusMode is active to prevent excessive resource usage and ensure smoother performance
function updateSliderConstraints() {
    colors.forEach(color => {
        const colorParticleController = guiMain.__folders["Particles Rules"].__folders[color].__controllers[0];
        if (isNexus && props[`${color} Particles`] >= 150) {
            props[`${color} Particles`] = (isMobile ? 80 : 150);            
        } 
        if (colorParticleController) {
            colorParticleController.max(isNexus ? (isMobile ? 80 : 150) : (isMobile ? 150 : 300));
            colorParticleController.updateDisplay();
        }
    });
    const maxDistanceController = guiMain.__folders["Global Settings"].__controllers.find(ctrl => ctrl.property === 'Max distance interaction');
    if (maxDistanceController) {
        if (isNexus && props['Max distance interaction'] >= 100) {
            props['Max distance interaction'] = (isMobile ? 50 : 100);
        } 
        maxDistanceController.max(isNexus ? (isMobile ? 100 : 150) : 200);
        maxDistanceController.updateDisplay();
    }
    const scaleController = guiMain.__folders["Global Settings"].__controllers.find(ctrl => ctrl.property === 'Scale');
    if (scaleController) {
        if (isNexus && props['Scale'] >= 1.5) {
            props['Scale'] = (isMobile ? 1.5 : props['Scale']);
        } 
        scaleController.max(isNexus && isMobile ? 1.5 : 2);
        maxDistanceController.updateDisplay();
    }
}
// How to use tutorial : open all GUI folders when tutorial start

!isMobile && document.querySelector('#how-to-use').addEventListener("click", openGuiFolers);

export function openGuiFolers(){    
    guiMain.open();
    guiColorManager.open();
    colorManagerFolder.open();
    particlesSettings.open();
    globalSettings.open();
    drawingFolder.open();
    colors.forEach(color => {
        colorFolders[color].open();
    });
    checkbox.checked =  isMobile ? false : true;
}

    // Description card position

    export function handleViewportChange() {
        // RESIZE
        if (window.innerWidth > 767) {
        checkbox.checked = true;
        }
    }

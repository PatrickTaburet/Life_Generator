
let particles = [];
let guiMain, guiColorManager, backgroundAlpha, colorManagerFolder, particlesSettings, globalSettings, colorSettings, guiContainer; 
let isBackground = true;
let isNexus = false;
let isMousePressed = false;
let colorFolders = {};
let canvaSize = {};
let isMobile =  window.innerWidth < 767;
let checkbox;
//////////////  dat.GUI interface settings //////////////

const colors = ["Red", "Cyan", "Blue", "Orange"]

const props = {
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

function updateParticles() {
    particles = [];
    background(0);
    setupParticles();
    guiMain.updateDisplay();
    guiColorManager.updateDisplay();
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
// Resize windows 

function windowResized() {
    canvaSize = {width : (isMobile ? (window.innerWidth * 0.9) : (window.innerWidth * 0.6)), height : (isMobile ?(window.innerHeight / 1.8) : (window.innerHeight * 0.78))};    
    const canvas = createCanvas(canvaSize.width, canvaSize.height);
    canvas.parent("sketchContainer");
    handleViewportChange();
    updateParticles()
}

////////////// p5 SETUP //////////////

function setup() {
    canvaSize = {width : (isMobile ? (window.innerWidth * 0.9) : (window.innerWidth * 0.6)), height : (isMobile ? (window.innerHeight / 1.8) : (window.innerHeight * 0.78))};    
    const canvas = createCanvas(canvaSize.width, canvaSize.height);
    // const canvas = createCanvas(1000, 720);
    canvas.parent("sketchContainer");
    checkbox = document.getElementById('cb1');
    handleViewportChange();


    // Initialize dat.GUI

    // --- Main interface ---
    
    guiMain = new dat.GUI();
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
        particles = [];
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
    drawingFolder.add(props, 'backgroundAlpha', 1, 150, 1).name("Trails").onChange((value) => {
        backgroundAlpha = value;
    });
    // Particles shape
    drawingFolder.add(props, 'particleSize', 1, 20, 0.5).name("Particles Radius");
    drawingFolder.addColor(props, 'backgroundColor').name(`${isMobile ? 'Background' : 'Background Color'}`).onChange(() => {
        background(props.backgroundColor[0], props.backgroundColor[1], props.backgroundColor[2], props['backgroundAlpha']);
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

    // gui global container
    guiContainer = document.querySelector(".dg.ac");

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
    window.guiMain = guiMain;
    window.guiColorManager = guiColorManager;
    setupParticles();
}

////////////// p5 DRAW //////////////

function draw() {

    //Manage z-index of the gui menus if open or closed
    guiContainer.style.zIndex = (guiColorManager.closed && guiMain.closed) ? 1 : 3;
    (window.isTourActive && isMobile ) && openGuiFolers();
    if (frameCount % 2 === 0) {
        props['FPS'] = Math.round(frameRate());
    }
    if (isMousePressed) applyRepulsion();



    // Drawing mode 
    isBackground &&  background(props.backgroundColor[0], props.backgroundColor[1], props.backgroundColor[2], props['backgroundAlpha']);

    // Apply rules for interactions
    colors.forEach(color1 => {
        if (!props[`${color1} Visible`]) return; 
        colors.forEach(color2 => {
            if (!props[`${color2} Visible`]) return;
            applyRules(
                particles.filter(p => p.color === color1),
                particles.filter(p => p.color === color2),
                props[`${color1[0]} <--> ${color2[0]}`]
            );

            isNexus && (
                particles.filter(p => p.color === color1).forEach(a => {
                    particles.filter(p => p.color === color2).forEach(b => {
                        const dx = a.x - b.x;
                        const dy = a.y - b.y;
                        const d = sqrt(dx * dx + dy * dy);
                        if (d > 0 && d < props['Max distance interaction']) {
                            stroke(color1);
                            line(a.x, a.y, b.x, b.y);
                        }
                    });
                })
            )

        });
    });
    particles.forEach(p => p.drawParticle());
}

function setupParticles() {
    colors.forEach(color => {
        if (props[`${color} Visible`]) {
            createParticles(props[`${color} Particles`], color);
        }
    });
}

function createParticles(number, color) {
    const scaledNumber = Math.floor(number * props['Scale']); 
    for (let i = 0; i < scaledNumber; i++) {
        particles.push(new Particle( random(width), random(height), color));
    }
}

function applyRules(particles1, particles2, g) {
    for (let a of particles1) {
        let fx = 0;
        let fy = 0;

        for (let b of particles2) {
            const dx = a.x - b.x;
            const dy = a.y - b.y;
            const d = sqrt(dx * dx + dy * dy);

            if (d > 0 && d < props['Max distance interaction']) {
                const F = g / d;
                fx += F * dx;
                fy += F * dy;
            }
        }
        a.update(fx, fy);
    }
}

class Particle {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.vx =  0;
        this.vy = 0;
        this.color = color;
    }
    
    update(fx, fy) {
        // Update velocity and position
        this.vx = (this.vx + fx) * 0.5 * props['timeScale'];
        this.vy = (this.vy + fy) * 0.5 * props['timeScale'];
        this.x += this.vx;
        this.y += this.vy;

        // Keep particles within the canvas
        if (this.x <= 0) {
            this.x = 0;
            this.vx *= -1;
        }
        if (this.x >= width) {
            this.x = width;
            this.vx *= -1;
        }
        if (this.y <= 0) {
            this.y = 0;
            this.vy *= -1;
        }
        if (this.y >= height) {
            this.y = height;
            this.vy *= -1;
        }
    }
    drawParticle() {
        fill(this.color);
        noStroke();
        const particleSize = props['particleSize'] / props['Scale']; 
        ellipse(this.x, this.y, particleSize, particleSize);
    }

    // Halo effect : pretty but too resource-intensive.

    // drawParticle() {
    //     noStroke();
        
    //     const particleSize = props['particleSize'] / props['Scale'];
        
    //     // Draw multiple cercles to make the "halo" effect
    //     for (let i = 7; i > 0; i--) {
    //         fill(red(this.color), green(this.color), blue(this.color), i * (props["particleSize"] *0.1)); // Opacity gradient
    //         ellipse(this.x, this.y, particleSize + i * 7, particleSize + i * 7);
    //     }
        
    //     // Particule principale
    //     fill(this.color);
    //     ellipse(this.x, this.y, particleSize, particleSize);
    // }
}

// Mouse pressed repulsive impact

function mousePressed() {
    isMousePressed = true;
}
function mouseReleased() {
    isMousePressed = false;
}
function touchStarted() {
    isMousePressed = true;
}
function touchEnded() {
    isMousePressed = false;
}
function applyRepulsion() {
    let f = props["mouseImpactCoef"];
    const repulsionStrength = 3.5 * f; 
    const repulsionRadius = 100 * f; 

    particles.forEach(p => {
        const dx = p.x - mouseX;
        const dy = p.y - mouseY;
        const distance = sqrt(dx * dx + dy * dy);

        if (distance < repulsionRadius && distance > 0) {
            const force = repulsionStrength / (distance * 0.5); 
            p.vx += force * dx;
            p.vy += force * dy;
        }
    });
}


// Save canva screenshot

document.querySelector(`${isMobile ? '.save-button-mobile' : '.save-button'}`).addEventListener('click', saveCanvasImage);

function keyPressed() {
    if (key === ' ') {
        saveCanvasImage();
    }
}
function saveCanvasImage() {
    const userConfirmation = confirm("Do you want to save this image?");
    if (userConfirmation) saveCanvas('myArtwork', 'png');
}

// How to use tutorial : open all GUI folders when tutorial start

!isMobile && document.querySelector('#how-to-use').addEventListener("click", openGuiFolers);

function openGuiFolers(){
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

function handleViewportChange() {
    // RESIZE
    if (window.innerWidth > 767) {
      checkbox.checked = true;
    }
}

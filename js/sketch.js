
let particles = [];
let guiMain, guiColorManager, backgroundAlpha, colorManagerFolder, particlesSettings, globalSettings, colorSettings; 
let isBackground = true;
let isNexus = false;
let isMousePressed = false;
let colorFolders = {};

//////////////  dat.GUI interface settings //////////////

const colors = ["White", "Blue", "Green", "Red"]

const props = {
    'backgroundColor': [0, 0, 0],
    'Max distance interaction': 100,
    'Scale': 1,
    'Reset': resetProps,
    'Random': randomizeProps,
    'drawingMode': () => {
        isBackground = !isBackground;
        updateButton('#drawing-mode-button', !isBackground);
    },
    'nexusMode': () => {            
        isNexus = !isNexus;
        updateButton('#nexus-mode-button', isNexus);
        updateSliderConstraints(); 
        updateParticles();
    },
    'backgroundAlpha' : 150,
    'particleSize' : 4,
    'timeScale': 1,
    'FPS': 0,
    'mouseImpactCoef' : 1,
};

colors.forEach(color => {
    props[`${color} Particles`] = 100;
    props[`${color} Visible`] = true; 
    colors.forEach(otherColor => {
        props[`${color[0]} <--> ${otherColor[0]}`] = 0;
    })
});

function updateButton(buttonId, boolVariable, mainColor = 'red', secondColor = 'white' ) {
    const drawingModeButton = document.querySelector(buttonId).parentElement;
    if (drawingModeButton) {
        drawingModeButton.querySelector('.property-name').style.color = boolVariable ? mainColor : secondColor;
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
        props[`${color} Particles`] = 100;
        props[`${color} Visible`] = true;
        colors.forEach(otherColor => {
            props[`${color[0]} <--> ${otherColor[0]}`] = 0;
        })
    });
    props['Max distance interaction'] = 100;
    props['Scale'] = 1;
    props['backgroundAlpha'] = 150;
    isNexus = false;
    updateButton('#nexus-mode-button', isNexus);
    updateSliderConstraints(); 
    isBackground = true;
    updateButton('#drawing-mode-button', !isBackground);
    updateParticles();
}

function randomizeProps(){
    colors.forEach(color => {
        props[`${color} Particles`] = Math.floor(Math.random() * (isNexus ? 150 : 300));
        colors.forEach(otherColor => {
            props[`${color[0]} <--> ${otherColor[0]}`] = (Math.random() * 10) - 5;
        })
    });
    props['Max distance interaction'] = Math.floor(Math.random() * (isNexus ? 130 : 200));
    updateParticles();
}

function updateSliderConstraints() {
    colors.forEach(color => {
        const colorParticleController = guiMain.__folders["Particles Rules"].__folders[color].__controllers[0];
        if (isNexus && props[`${color} Particles`] > 150) {
            props[`${color} Particles`] = 150;
        } 
        if (colorParticleController) {
            colorParticleController.max(isNexus ? 150 : 300);
            colorParticleController.updateDisplay();
        }
    });
    const maxDistanceController = guiMain.__folders["Global Settings"].__controllers.find(ctrl => ctrl.property === 'Max distance interaction');
    if (maxDistanceController) {
        if (isNexus && props['Max distance interaction'] > 100) {
            props['Max distance interaction'] = 100;
        } 
        maxDistanceController.max(isNexus ? 130 : 200);
        maxDistanceController.updateDisplay();
    }
}


////////////// p5 SETUP //////////////

function setup() {
    const canvas = createCanvas(1280, 720);
    canvas.parent("sketchContainer");

    // Initialize dat.GUI

    // --- Main interface ---
    
    guiMain = new dat.GUI();

    
    // Global settings

    globalSettings = guiMain.addFolder("Global Settings");
    let globalSettingsElement = globalSettings.domElement;
    globalSettingsElement.classList.add('step4');
    globalSettings.add(props, 'Reset');
    globalSettings.add(props, 'Random');

    globalSettings.add(props, 'Max distance interaction', 0, 200, 1);
 
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
        colorFolders[color]  = particlesSettings.addFolder(color);
        colorFolders[color].open();
        colorFolders[color].add(props, `${color} Particles`, 1, 300, 1).onChange(updateParticles);
        
        // Color title
        const folderTitle = colorFolders[color].__ul.querySelector('.dg .title');
        if (folderTitle) folderTitle.style.color = color;
        colors.forEach(otherColor => {
            colorFolders[color].add(props, `${color[0]} <--> ${otherColor[0]}`, -5, 5, 0.05);
        })
    });


    // --- Drawing interface ---

    // Color manager 
    guiColorManager = new dat.GUI({ name: "Color Manager" });
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
    drawingFolder.addColor(props, 'backgroundColor').name("Background Color").onChange(() => {
        background(props.backgroundColor[0], props.backgroundColor[1], props.backgroundColor[2], props['backgroundAlpha']);
    });
    // Nexus mode button
    let nexusButton = guiColorManager.add(props, `nexusMode`).name(`Nexus Mode`).onChange(updateParticles);
    let nexusButtonElement = nexusButton.domElement;
    nexusButtonElement.id = 'nexus-mode-button';
    let nexusButtonClass = nexusButton.domElement.parentElement.parentElement;;
    nexusButtonClass.classList.add('nexus-mode');

    // Drawing mode button
    let drawingButton = guiColorManager.add(props, 'drawingMode').name("Drawing Mode");
    let drawingButtonElement = drawingButton.domElement;
    drawingButtonElement.id = 'drawing-mode-button';

    // Open folders by default
    colorManagerFolder.open();
    particlesSettings.open();
    globalSettings.open();
    drawingFolder.open();

    setupParticles();
}

////////////// p5 DRAW //////////////

function draw() {
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
        if (this.x <= 0 || this.x >= width) this.vx *= -1;
        if (this.y <= 0 || this.y >= height) this.vy *= -1;
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

document.querySelector('.save-button').addEventListener('click', saveCanvasImage);

function keyPressed() {
    if (key === ' ' && !window.isTourActive) {
        saveCanvasImage();
    }
}
function saveCanvasImage() {
    const userConfirmation = confirm("Do you want to save this image?");
    if (userConfirmation) saveCanvas('myArtwork', 'png');
}

// How to use tutorial : open all GUI folders when tutorial start

document.getElementById("how-to-use").addEventListener("click", () => {
    guiMain.open();
    guiColorManager.open();
    colorManagerFolder.open();
    particlesSettings.open();
    globalSettings.open();
    drawingFolder.open();
    colors.forEach(color => {
        colorFolders[color].open();
    });

});
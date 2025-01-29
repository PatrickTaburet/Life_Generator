    let particles = [];
    let guiMain, guiColorManager, colorListFolder, backgroundAlpha; 
    let isBackground = true;
    let isNexus = false;
    
    // dat.GUI interface settings 

    const colors = ["White", "Blue", "Green", "Red"]

    const props = {
        'Max distance interaction': 100,
        'Scale': 1,
        'Reset': resetProps,
        'Random': randomizeProps,
        'drawingMode': () => {
            isBackground = !isBackground;
            updateButton('#drawing-mode-button', !isBackground);
        },
        'nexusMode': () => {
            console.log('nexus change');
            
            isNexus = !isNexus;
            updateButton('#nexus-mode-button', isNexus);
            updateSliderConstraints(); 
            updateParticles();
        },
        'backgroundAlpha' : 150,
    };
   
    colors.forEach(color => {
        props[`${color} Particles`] = 50;
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
            props[`${color} Particles`] = 50;
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
            const colorParticleController = guiMain.__folders["Particles Settings"].__folders[color].__controllers[0];
            if (isNexus && props[`${color} Particles`] > 150) {
                props[`${color} Particles`] = 150;
            } 
            if (colorParticleController) {
                colorParticleController.max(isNexus ? 150 : 300);
                colorParticleController.updateDisplay();
                console.log("3");
            }
        });
        console.log("5");
        const maxDistanceController = guiMain.__folders["Global Settings"].__controllers.find(ctrl => ctrl.property === 'Max distance interaction');
        if (maxDistanceController) {
            if (isNexus && props['Max distance interaction'] > 100) {
                props['Max distance interaction'] = 100;
            } 
            maxDistanceController.max(isNexus ? 130 : 200);
            maxDistanceController.updateDisplay();
            console.log("6");
        }
    }

    
    // ---- p5 SETUP ----

    function setup() {
        const canvas = createCanvas(700, 700);
        canvas.parent("sketchContainer");

        // Initialize dat.GUI

        // --- Main interface ---
        guiMain = new dat.GUI();
        let particlesSettings = guiMain.addFolder("Particles Settings");
        let globalSettings = guiMain.addFolder("Global Settings");

        colors.forEach(color => {
            let colorSettings = particlesSettings.addFolder(color);
            colorSettings.open();
            colorSettings.add(props, `${color} Particles`, 1, 300, 1).onChange(updateParticles);
            
            // Color title
            const folderTitle = colorSettings.__ul.querySelector('.dg .title');
            if (folderTitle) folderTitle.style.color = color;
            colors.forEach(otherColor => {
                colorSettings.add(props, `${color[0]} <--> ${otherColor[0]}`, -5, 5, 0.05);
            })
        });

        // Global settings

        globalSettings.add(props, 'Max distance interaction', 0, 200, 1);
        // Trails effect slider
        globalSettings.add(props, 'backgroundAlpha', 1, 150, 1).name("Trails").onChange((value) => {
            backgroundAlpha = value;
        });
        // Zoom effect slider
        globalSettings.add(props, 'Scale', 0.1, 2, 0.1).name("Zoom").onChange(() => {
            particles = [];
            setupParticles();
        });
        globalSettings.add(props, 'Reset');
        globalSettings.add(props, 'Random');

        // Nexus mode button
        let nexusButton = guiMain.add(props, `nexusMode`).name(`Nexus Mode`).onChange(updateParticles);
        let nexusButtonElement = nexusButton.domElement;
        nexusButtonElement.id = 'nexus-mode-button';

        // Drawing mode button
        let drawingButton = guiMain.add(props, 'drawingMode').name("Drawing Mode");
        let drawingButtonElement = drawingButton.domElement;
        drawingButtonElement.id = 'drawing-mode-button';

        // --- Color manager interface ---

        guiColorManager = new dat.GUI({ name: "Color Manager" });
        let colorManagerFolder = guiColorManager.addFolder("Color Manager");

        // Checkboxes for colors
        colors.forEach(color => {
            colorManagerFolder.add(props, `${color} Visible`).name(`${color} Visible`).onChange(updateParticles);
        });
       

        // Open folders by default
        colorManagerFolder.open();
        particlesSettings.open();
        globalSettings.open();

        setupParticles();
    }

    function draw() {
        // Drawing mode 
        isBackground && background(0, backgroundAlpha);
        
        // Glow effect ?
        // particles.forEach(p => {
        //     const glowSize = 10 / props['Scale'];
        //     drawingContext.shadowBlur = glowSize;
        //     drawingContext.shadowColor = p.color;
        // });
    
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
    function capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
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
            this.vx = (this.vx + fx) * 0.5;
            this.vy = (this.vy + fy) * 0.5;
            this.x += this.vx;
            this.y += this.vy;

            // Keep particles within the canvas
            if (this.x <= 0 || this.x >= width) this.vx *= -1;
            if (this.y <= 0 || this.y >= height) this.vy *= -1;
        }
        drawParticle() {
            fill(this.color);
            noStroke();
            const particleSize = 3 / props['Scale']; 
            ellipse(this.x, this.y, particleSize, particleSize);
        }
    }

    // Save canva screenshot

    document.querySelector('.save-button').addEventListener('click', saveCanvasImage);

    function keyPressed() {
        if (key === ' ') saveCanvasImage();
    }
    function saveCanvasImage() {
        const userConfirmation = confirm("Do you want to save this image?");
        if (userConfirmation) saveCanvas('myCanvas', 'png');
    }



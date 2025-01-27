    let particles = [];
    let guiMain, guiColorManager, colorListFolder; 
    let isBackground = true;
    const colors = ["Yellow", "Blue", "Green", "Red"]

    const props = {
        'Max distance interaction': 100,
        'Scale': 1,
        'Reset': resetProps,
        'Random': randomizeProps,
        'Background': () => isBackground = !isBackground,
    };

    const colorManager = {
        'New Color': '#ffffff', 
        'Add Color': addColor,
    };

    colors.forEach(color => {
        props[`${color} Particles`] = 50;
        props[`${color} Visible`] = true; 
        colors.forEach(otherColor => {
            props[`${color[0]}/${otherColor[0]} interaction`] = 0;
        })
    });

    function addColor() {
        // !! Convertir la couleur hexadécimale en nom  !!
        const newColor = colorManager['New Color'];
        const colorName = capitalize(newColor.replace('#', 'Color ')); 
    
        if (!colors.includes(colorName)) {
        colors.push(colorName);
    
        // Add new properties for this color
        props[`${colorName} Particles`] = 50;
        props[`${colorName} Visible`] = true;
    
        // Add interactions with other colors
        colors.forEach(existingColor => {
            props[`${colorName[0]}/${existingColor[0]} interaction`] = 0;
            props[`${existingColor[0]}/${colorName[0]} interaction`] = 0;
        });
    
        // Update GUI
        updateParticleSettingsGUI(colorName);
        updateColorManagerGUI(colorName);
    
        updateParticles();
        }
    }
    function updateParticleSettingsGUI(color) {
        // Add the new color to the main GUI
        const particlesFolder = guiMain.__folders['Particles Settings'];
        const colorFolder = particlesFolder.addFolder(color);

        colorFolder.add(props, `${color} Particles`, 0, 300, 1).onChange(updateParticles);
        colors.forEach(otherColor => {
            colorFolder.add(props, `${color[0]}/${otherColor[0]} interaction`, -5, 5, 0.05);
        });
        colorFolder.add({ Delete: () => deleteColor(color) }, 'Delete');
        colorFolder.open();
    }
    function deleteColor(color) {
        // Remove the color from the colors array
        const index = colors.indexOf(color);
        if (index > -1) colors.splice(index, 1);

        // Remove associated properties
        delete props[`${color} Particles`];
        delete props[`${color} Visible`];
        colors.forEach(otherColor => {
            delete props[`${color[0]}/${otherColor[0]} interaction`];
            delete props[`${otherColor[0]}/${color[0]} interaction`];
        });

        // Remove particles of this color
        particles = particles.filter(p => p.color !== color);

        // Remove the corresponding folder in the GUI
        const particlesFolder = guiMain.__folders['Particles Settings'];
        if (particlesFolder.__folders[color]) {
            particlesFolder.removeFolder(particlesFolder.__folders[color]);
        }

        // Remove the checkbox in the color manager
        const controllers = colorListFolder.__controllers;
        controllers.forEach((controller, index) => {
            if (controller.property === `${color} Visible`) {
                colorListFolder.__controllers[index].remove();
            }
        });
        
        // Remove interaction sliders with this color in other folders
        colors.forEach(otherColor => {
            const otherFolder = particlesFolder.__folders[otherColor];
            if (otherFolder) {
                const otherControllers = otherFolder.__controllers;
                otherControllers.forEach((controller, index) => {
                    const prop = controller.property;
                    if (prop === `${otherColor[0]}/${color[0]} interaction` || prop === `${color[0]}/${otherColor[0]} interaction`) {
                        otherControllers[index].remove();
                    }
                });
            }
        });
        updateParticles();
    }
    function updateColorManagerGUI(color) {
        // Add the new color in the color manager window
        colorListFolder.add(props, `${color} Visible`).name(`${color} Visible`).onChange(updateParticles);
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
                props[`${color[0]}/${otherColor[0]} interaction`] = 0;
            })
        });
        props['Max distance interaction'] = 100;
        props['Scale'] = 1;
        updateParticles();
    }

    function randomizeProps(){
        colors.forEach(color => {
            props[`${color} Particles`] = Math.floor(Math.random() * 300);
            colors.forEach(otherColor => {
                props[`${color[0]}/${otherColor[0]} interaction`] = (Math.random() * 10) - 5;
            })
        });
        props['Max distance interaction'] = Math.floor(Math.random() * 200);
        updateParticles();
    }

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
            colorSettings.add(props, `${color} Particles`, 0, 300, 1).onChange(updateParticles);
            colors.forEach(otherColor => {
                colorSettings.add(props, `${color[0]}/${otherColor[0]} interaction`, -5, 5, 0.05);
            })
            colorSettings.add({ Delete: () => deleteColor(color) }, 'Delete');
        });

        // Global settings
        globalSettings.add(props, 'Max distance interaction', 0, 200, 1);
        globalSettings.add(props, 'Scale', 0.1, 2, 0.1).onChange(() => {
            particles = [];
            setupParticles();
        });
        globalSettings.add(props, 'Reset');
        globalSettings.add(props, 'Random');
        globalSettings.add(props, 'Background');

        // --- Color manager interface ---
        guiColorManager = new dat.GUI({ name: "Color Manager" });
        let colorManagerFolder = guiColorManager.addFolder("Color Manager");
        colorListFolder = guiColorManager.addFolder("Color List");
        colorManagerFolder.addColor(colorManager, 'New Color').name('Color Picker');
        colorManagerFolder.add(colorManager, 'Add Color').name('Add Color');

        // Checkboxes for colors
        colors.forEach(color => {
            colorListFolder.add(props, `${color} Visible`).name(`${color} Visible`).onChange(updateParticles);
            
        });


        // Open folders by default
        colorManagerFolder.open();
        particlesSettings.open();
        globalSettings.open();
        colorListFolder.open();
        
        setupParticles();
    }

    function draw() {
        // Drawing mode 
        isBackground && background(0);

        // Apply rules for interactions
        colors.forEach(color1 => {
            if (!props[`${color1} Visible`]) return; 
            colors.forEach(color2 => {
                if (!props[`${color2} Visible`]) return;
                applyRules(
                    particles.filter(p => p.color === color1),
                    particles.filter(p => p.color === color2),
                    props[`${color1[0]}/${color2[0]} interaction`]
                );
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

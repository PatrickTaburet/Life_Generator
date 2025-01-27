let particles = [];
let gui; 
let isBackground = true;
const colors = ["Yellow", "Blue", "Green", "Red"]

const props = {
    'Max distance interaction': 100,
    'Scale': 1,
    'Reset': resetProps,
    'Random': randomizeProps,
    'Background': () => isBackground = !isBackground
};

colors.forEach(color => {
    props[`${color} Particles`] = 50;
    colors.forEach(otherColor => {
        props[`${color[0]}/${otherColor[0]} interaction`] = 0;
    })
});

function updateParticles() {
    particles = [];
    background(0);
    setupParticles();
    gui.updateDisplay(); 
}

function resetProps() {
    colors.forEach(color => {
        props[`${color} Particles`] = 50;
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
    gui = new dat.GUI();
    let particlesSettings = gui.addFolder("Particles Settings");
    let globalSettings = gui.addFolder("Global Settings");

    colors.forEach(color => {
        let colorSettings = particlesSettings.addFolder(color);
        colorSettings.open();
        colorSettings.add(props, `${color} Particles`, 0, 300, 1).onChange(updateParticles);
        colors.forEach(otherColor => {
            colorSettings.add(props, `${color[0]}/${otherColor[0]} interaction`, -5, 5, 0.05);
        })
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

    // Open folders by default
    particlesSettings.open();
    globalSettings.open();
    
    setupParticles();
}

function draw() {
    // Drawing mode 
    isBackground && background(0);

    // Apply rules for interactions
    colors.forEach(color1 => {
        colors.forEach(color2 => {
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
        createParticles(props[`${color} Particles`], color);

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

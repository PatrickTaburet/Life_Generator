let particles = [];
let gui; 
let isBackground = true;
let props = {
    'Yellow Particles': 50,
    'Red Particles': 50,
    'Green Particles': 50,
    'Blue Particles': 50,
    'Y/Y interaction': 0,
    'Y/R interaction': 0,
    'Y/G interaction': 0,
    'Y/B interaction': 0,
    'R/R interaction': 0,
    'R/Y interaction': 0,
    'R/G interaction': 0,
    'R/B interaction': 0,
    'G/G interaction': 0,
    'G/Y interaction': 0,
    'G/R interaction': 0,
    'G/B interaction': 0,
    'B/B interaction': 0,
    'B/Y interaction': 0,
    'B/R interaction': 0,
    'B/G interaction': 0,
    'Max distance interaction': 100,
    'Scale': 1,
    'Reset': function () {
        // Reset to initial props values
        props['Yellow Particles'] = 50;
        props['Red Particles'] = 50;
        props['Green Particles'] = 50;
        props['Blue Particles'] = 50;
        props['Y/Y interaction'] = 0;
        props['Y/R interaction'] = 0;
        props['Y/G interaction'] = 0;
        props['Y/B interaction'] = 0;
        props['R/R interaction'] = 0;
        props['R/Y interaction'] = 0;
        props['R/G interaction'] = 0;
        props['R/B interaction'] = 0;
        props['G/G interaction'] = 0;
        props['G/Y interaction'] = 0;
        props['G/R interaction'] = 0;
        props['G/B interaction'] = 0;
        props['B/B interaction'] = 0;
        props['B/Y interaction'] = 0;
        props['B/R interaction'] = 0;
        props['B/G interaction'] = 0;
        props['Max distance interaction'] = 100;
        props['Scale'] = 1;

        particles = [];
        background(0);
        setupParticles();
        // Update sliders display
        gui.updateDisplay();
    },
    'Random': function () {
        props['Yellow Particles'] = Math.floor(Math.random() * 300);
        props['Red Particles'] = Math.floor(Math.random() * 300);
        props['Green Particles'] = Math.floor(Math.random() * 300);
        props['Blue Particles'] = Math.floor(Math.random() * 300);
        props['Y/Y interaction'] = (Math.random() * 10) - 5;
        props['Y/R interaction'] = (Math.random() * 10) - 5;
        props['Y/G interaction'] = (Math.random() * 10) - 5;
        props['Y/B interaction'] = (Math.random() * 10) - 5;
        props['R/R interaction'] = (Math.random() * 10) - 5;
        props['R/Y interaction'] = (Math.random() * 10) - 5;
        props['R/G interaction'] = (Math.random() * 10) - 5;
        props['R/B interaction'] = (Math.random() * 10) - 5;
        props['G/G interaction'] = (Math.random() * 10) - 5;
        props['G/Y interaction'] = (Math.random() * 10) - 5;
        props['G/R interaction'] = (Math.random() * 10) - 5;
        props['G/B interaction'] = (Math.random() * 10) - 5;
        props['B/B interaction'] = (Math.random() * 10) - 5;
        props['B/Y interaction'] = (Math.random() * 10) - 5;
        props['B/R interaction'] = (Math.random() * 10) - 5;
        props['B/G interaction'] = (Math.random() * 10) - 5;
        props['Max distance interaction'] = Math.floor(Math.random() * 200);

        particles = [];
        background(0);
        setupParticles();
        // Update sliders display
        gui.updateDisplay();
    },
    'Background': function () {
        isBackground = !isBackground;
    }
};

function setupParticles() {
    
    createParticles(props['Yellow Particles'], 'yellow');
    createParticles(props['Red Particles'], 'red');
    createParticles(props['Green Particles'], 'green');
    createParticles(props['Blue Particles'], 'blue');
}

function createParticles(number, color) {
    const scaledNumber = Math.floor(number * props['Scale']); 
    for (let i = 0; i < scaledNumber; i++) {
        particles.push({
            x: random(width),
            y: random(height),
            vx: 0,
            vy: 0,
            color: color
        });
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

        // Update velocity and position
        a.vx = (a.vx + fx) * 0.5;
        a.vy = (a.vy + fy) * 0.5;
        a.x += a.vx;
        a.y += a.vy;

        // Keep particles within the canvas
        if (a.x <= 0 || a.x >= width) a.vx *= -1;
        if (a.y <= 0 || a.y >= height) a.vy *= -1;
    }
}

function drawParticles() {
    for (let p of particles) {
        fill(p.color);
        noStroke();
        const particleSize = 5 / props['Scale']; 
        ellipse(p.x, p.y, particleSize, particleSize);
    }
}

function setup() {
    const canvas = createCanvas(700, 700);
    canvas.parent("sketchContainer");
    // Initialize dat.GUI
    gui = new dat.GUI();
    let particlesSettings = gui.addFolder("Particles Settings");
    let yellowSettings = particlesSettings.addFolder("Yellow");
    let redSettings = particlesSettings.addFolder("Red");
    let greenSettings = particlesSettings.addFolder("Green");
    let blueSettings = particlesSettings.addFolder("Blue");
    let globalSettings = gui.addFolder("Global Settings");

    // Yellow particle settings
    yellowSettings.add(props, 'Yellow Particles', 0, 300, 1).onChange(() => {
        particles = [];
        setupParticles();
    });
    yellowSettings.add(props, 'Y/Y interaction', -5, 5, 0.05);
    yellowSettings.add(props, 'Y/R interaction', -5, 5, 0.05);
    yellowSettings.add(props, 'Y/G interaction', -5, 5, 0.05);
    yellowSettings.add(props, 'Y/B interaction', -5, 5, 0.05);

    // Red particle settings
    redSettings.add(props, 'Red Particles', 0, 300, 1).onChange(() => {
        particles = [];
        setupParticles();
    });
    redSettings.add(props, 'R/R interaction', -5, 5, 0.05);
    redSettings.add(props, 'R/Y interaction', -5, 5, 0.05);
    redSettings.add(props, 'R/G interaction', -5, 5, 0.05);
    redSettings.add(props, 'R/B interaction', -5, 5, 0.05);

    // Green particle settings
    greenSettings.add(props, 'Green Particles', 0, 300, 1).onChange(() => {
        particles = [];
        setupParticles();
    });
    greenSettings.add(props, 'G/G interaction', -5, 5, 0.05);
    greenSettings.add(props, 'G/Y interaction', -5, 5, 0.05);
    greenSettings.add(props, 'G/R interaction', -5, 5, 0.05);
    greenSettings.add(props, 'G/B interaction', -5, 5, 0.05);

    // Blue particle settings
    blueSettings.add(props, 'Blue Particles', 0, 300, 1).onChange(() => {
        particles = [];
        setupParticles();
    });
    
    blueSettings.add(props, 'B/B interaction', -5, 5, 0.05);
    blueSettings.add(props, 'B/Y interaction', -5, 5, 0.05);
    blueSettings.add(props, 'B/R interaction', -5, 5, 0.05);
    blueSettings.add(props, 'B/G interaction', -5, 5, 0.05);

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
    yellowSettings.open();
    redSettings.open();
    greenSettings.open();
    globalSettings.open();

    setupParticles();
}

function draw() {
    isBackground && background(0);

    // Apply rules for interactions
    applyRules(particles.filter(p => p.color === 'yellow'), particles.filter(p => p.color === 'yellow'), props['Y/Y interaction']);
    applyRules(particles.filter(p => p.color === 'yellow'), particles.filter(p => p.color === 'red'), props['Y/R interaction']);
    applyRules(particles.filter(p => p.color === 'yellow'), particles.filter(p => p.color === 'green'), props['Y/G interaction']);
    applyRules(particles.filter(p => p.color === 'yellow'), particles.filter(p => p.color === 'blue'), props['Y/B interaction']);
    applyRules(particles.filter(p => p.color === 'red'), particles.filter(p => p.color === 'red'), props['R/R interaction']);
    applyRules(particles.filter(p => p.color === 'red'), particles.filter(p => p.color === 'yellow'), props['R/Y interaction']);
    applyRules(particles.filter(p => p.color === 'red'), particles.filter(p => p.color === 'green'), props['R/G interaction']);
    applyRules(particles.filter(p => p.color === 'red'), particles.filter(p => p.color === 'blue'), props['R/B interaction']);
    applyRules(particles.filter(p => p.color === 'green'), particles.filter(p => p.color === 'green'), props['G/G interaction']);
    applyRules(particles.filter(p => p.color === 'green'), particles.filter(p => p.color === 'yellow'), props['G/Y interaction']);
    applyRules(particles.filter(p => p.color === 'green'), particles.filter(p => p.color === 'red'), props['G/R interaction']);
    applyRules(particles.filter(p => p.color === 'green'), particles.filter(p => p.color === 'red'), props['G/R interaction']);
    applyRules(particles.filter(p => p.color === 'blue'), particles.filter(p => p.color === 'blue'), props['B/B interaction']);
    applyRules(particles.filter(p => p.color === 'blue'), particles.filter(p => p.color === 'yellow'), props['B/Y interaction']);
    applyRules(particles.filter(p => p.color === 'blue'), particles.filter(p => p.color === 'red'), props['B/R interaction']);
    applyRules(particles.filter(p => p.color === 'blue'), particles.filter(p => p.color === 'green'), props['B/G interaction']);

    // Draw particles
    drawParticles();
}

let particles = [];
let gui; // Ajout d'une référence globale à dat.GUI
let props = {
    'Yellow Particles': 50,
    'Red Particles': 50,
    'Green Particles': 50,
    'Y/Y interaction': 0,
    'Y/R interaction': 0,
    'Y/G interaction': 0,
    'R/R interaction': 0,
    'R/Y interaction': 0,
    'R/G interaction': 0,
    'G/G interaction': 0,
    'G/Y interaction': 0,
    'G/R interaction': 0,
    'Max distance interaction': 100,
    'Reset': function () {
        // Réinitialiser les propriétés aux valeurs initiales
        props['Yellow Particles'] = 50;
        props['Red Particles'] = 50;
        props['Green Particles'] = 50;
        props['Y/Y interaction'] = 0;
        props['Y/R interaction'] = 0;
        props['Y/G interaction'] = 0;
        props['R/R interaction'] = 0;
        props['R/Y interaction'] = 0;
        props['R/G interaction'] = 0;
        props['G/G interaction'] = 0;
        props['G/Y interaction'] = 0;
        props['G/R interaction'] = 0;
        props['Max distance interaction'] = 100;

        particles = [];
        setupParticles();

        // Mettre à jour l'affichage des sliders
        gui.updateDisplay();
    },
    'Random': function () {
        props['Yellow Particles'] = Math.floor(Math.random() * 300);
        props['Red Particles'] = Math.floor(Math.random() * 300);
        props['Green Particles'] = Math.floor(Math.random() * 300);
        props['Y/Y interaction'] = (Math.random() * 10) - 5;
        props['Y/R interaction'] = (Math.random() * 10) - 5;
        props['Y/G interaction'] = (Math.random() * 10) - 5;
        props['R/R interaction'] = (Math.random() * 10) - 5;
        props['R/Y interaction'] = (Math.random() * 10) - 5;
        props['R/G interaction'] = (Math.random() * 10) - 5;
        props['G/G interaction'] = (Math.random() * 10) - 5;
        props['G/Y interaction'] = (Math.random() * 10) - 5;
        props['G/R interaction'] = (Math.random() * 10) - 5;
        props['Max distance interaction'] = Math.floor(Math.random() * 200);

        particles = [];
        setupParticles();

        // Mettre à jour l'affichage des sliders
        gui.updateDisplay();
    }
};

function setupParticles() {
    createParticles(props['Yellow Particles'], 'yellow');
    createParticles(props['Red Particles'], 'red');
    createParticles(props['Green Particles'], 'green');
}

function createParticles(number, color) {
    for (let i = 0; i < number; i++) {
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
        ellipse(p.x, p.y, 5, 5);
    }
}

function setup() {
    createCanvas(500, 500);

    // Initialize dat.GUI
    gui = new dat.GUI();
    let particlesSettings = gui.addFolder("Particles Settings");
    let yellowSettings = particlesSettings.addFolder("Yellow");
    let redSettings = particlesSettings.addFolder("Red");
    let greenSettings = particlesSettings.addFolder("Green");
    let globalSettings = gui.addFolder("Global Settings");

    // Yellow particle settings
    yellowSettings.add(props, 'Yellow Particles', 0, 300, 1).onChange(() => {
        particles = [];
        setupParticles();
    });
    yellowSettings.add(props, 'Y/Y interaction', -5, 5, 0.05);
    yellowSettings.add(props, 'Y/R interaction', -5, 5, 0.05);
    yellowSettings.add(props, 'Y/G interaction', -5, 5, 0.05);

    // Red particle settings
    redSettings.add(props, 'Red Particles', 0, 300, 1).onChange(() => {
        particles = [];
        setupParticles();
    });
    redSettings.add(props, 'R/R interaction', -5, 5, 0.05);
    redSettings.add(props, 'R/Y interaction', -5, 5, 0.05);
    redSettings.add(props, 'R/G interaction', -5, 5, 0.05);

    // Green particle settings
    greenSettings.add(props, 'Green Particles', 0, 300, 1).onChange(() => {
        particles = [];
        setupParticles();
    });
    greenSettings.add(props, 'G/G interaction', -5, 5, 0.05);
    greenSettings.add(props, 'G/Y interaction', -5, 5, 0.05);
    greenSettings.add(props, 'G/R interaction', -5, 5, 0.05);

    // Global settings
    globalSettings.add(props, 'Max distance interaction', 0, 200, 1);
    globalSettings.add(props, 'Reset');
    globalSettings.add(props, 'Random');

    setupParticles();
}

function draw() {
    background(0);

    // Apply rules for interactions
    applyRules(particles.filter(p => p.color === 'yellow'), particles.filter(p => p.color === 'yellow'), props['Y/Y interaction']);
    applyRules(particles.filter(p => p.color === 'yellow'), particles.filter(p => p.color === 'red'), props['Y/R interaction']);
    applyRules(particles.filter(p => p.color === 'yellow'), particles.filter(p => p.color === 'green'), props['Y/G interaction']);
    applyRules(particles.filter(p => p.color === 'red'), particles.filter(p => p.color === 'red'), props['R/R interaction']);
    applyRules(particles.filter(p => p.color === 'red'), particles.filter(p => p.color === 'yellow'), props['R/Y interaction']);
    applyRules(particles.filter(p => p.color === 'red'), particles.filter(p => p.color === 'green'), props['R/G interaction']);
    applyRules(particles.filter(p => p.color === 'green'), particles.filter(p => p.color === 'green'), props['G/G interaction']);
    applyRules(particles.filter(p => p.color === 'green'), particles.filter(p => p.color === 'yellow'), props['G/Y interaction']);
    applyRules(particles.filter(p => p.color === 'green'), particles.filter(p => p.color === 'red'), props['G/R interaction']);

    // Draw particles
    drawParticles();
}

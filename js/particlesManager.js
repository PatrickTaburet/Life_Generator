import {Particle} from './Particles.js'; 
import { colors, props } from './guiSettings.js';
import { getP5Instance } from './p5Instance.js';

let particles = [];


export function setupParticles() {
    const p = getP5Instance();
    colors.forEach(color => {
        if (props[`${color} Visible`]) {
            createParticles(props[`${color} Particles`], color, p);
        }
    });
}


function createParticles(number, color, p) {
    if (!p) {
        console.error('p5 instance is not set!');
        return;
    }
    const scaledNumber = Math.floor(number * props['Scale']); 
    for (let i = 0; i < scaledNumber; i++) {        
        particles.push(new Particle( p.random(p.width), p.random(p.height), color, p));
    }
}

export function getParticles() {
  return particles;
}

export function clearParticles() {
  particles = [];
}

export function applyRules(particles1, particles2, g) {
    const p = getP5Instance();
    for (let a of particles1) {
        let fx = 0;
        let fy = 0;

        for (let b of particles2) {
            const dx = a.x - b.x;
            const dy = a.y - b.y;
            const d = p.sqrt(dx * dx + dy * dy);

            if (d > 0 && d < props['Max distance interaction']) {
                const F = g / d;
                fx += F * dx;
                fy += F * dy;
            }
        }
        a.update(fx, fy);
    }
}

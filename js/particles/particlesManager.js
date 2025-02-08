/*
 * Copyright (c) 2025 Patrick Taburet
 * This file is licensed under the MIT License.
 * See the LICENSE file in the root directory for more details.
 */

import {Particle} from './Particles.js'; 
import { colors, props } from '../ui/guiSettings.js';
import { getP5Instance } from '../core/p5Instance.js';

let particles = [];

export function setupParticles(p) {
    colors.forEach(color => {
        if (props[`${color} Visible`]) {
            createParticles(props[`${color} Particles`], color, p);
        }
    });
}

function createParticles(number, color, p) {
    const scaledNumber = Math.floor(number * props['Scale']); 
    for (let i = 0; i < scaledNumber; i++) {        
        particles.push(new Particle( p.random(p.width), p.random(p.height), color, p));
    }
}

export function updateParticles() {
    const p = getP5Instance();
    clearParticles(); 
    p.background(0);
    setupParticles(p);
    guiMain.updateDisplay();
    guiColorManager.updateDisplay();
}

export function getParticles() {
  return particles;
}

export function clearParticles() {
  particles = [];
}

export function applyRules(particles1, particles2, g, p) {
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

// Mouse click repulsion

export function applyRepulsion(p) {
    let f = props["mouseImpactCoef"];
    const repulsionStrength = 3.5 * f; 
    const repulsionRadius = 100 * f; 

    particles.forEach(particle => {
        const dx = particle.x - p.mouseX;
        const dy = particle.y - p.mouseY;
        const distance = p.sqrt(dx * dx + dy * dy);

        if (distance < repulsionRadius && distance > 0) {
            const force = repulsionStrength / (distance * 0.5); 
            particle.vx += force * dx;
            particle.vy += force * dy;
        }
    });
}
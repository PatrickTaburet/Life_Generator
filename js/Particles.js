import { props } from './guiSettings.js';

export class Particle {
    constructor(x, y, color, p) {
        this.x = x;
        this.y = y;
        this.vx =  0;
        this.vy = 0;
        this.color = color;
        this.p = p;
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
        if (this.x >= this.p.width) {
            this.x = this.p.width;
            this.vx *= -1;
        }
        if (this.y <= 0) {
            this.y = 0;
            this.vy *= -1;
        }
        if (this.y >= this.p.height) {
            this.y = this.p.height;
            this.vy *= -1;
        }
    }
    drawParticle() {
        this.p.fill(this.color);
        this.p.noStroke();
        const particleSize = props['particleSize'] / props['Scale']; 
        this.p.ellipse(this.x, this.y, particleSize, particleSize);
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
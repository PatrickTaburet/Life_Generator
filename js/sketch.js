import { setP5Instance } from './p5Instance.js';
import { shepherdSettings } from './shepherd.js';
import { setupGUI, colors, props, openGuiFolers, toggleDescriptionCard } from './guiSettings.js';
import { getParticles, setupParticles, applyRules, updateParticles } from './particlesManager.js';
import { appStates } from './appStates.js';
import { setupEventHandlers } from './eventHandlers.js';
import { calculateCanvasSize } from './canvasUtils.js'


////////////// p5 SETUP //////////////

let sketch = (p) => {
    setP5Instance(p);
    let particles;
    let guiContainer, guiMain, guiColorManager;

    // Resize windows 
    p.windowResized = () => {
        const canvaSize = calculateCanvasSize() 
        const canvas = p.createCanvas(canvaSize.width, canvaSize.height);
        canvas.parent("sketchContainer");
        toggleDescriptionCard();
        updateParticles();
    }

    p.setup = () =>{
        const canvaSize = calculateCanvasSize() 
        const canvas = p.createCanvas(canvaSize.width, canvaSize.height);
        canvas.parent("sketchContainer");

        toggleDescriptionCard();
        particles = getParticles();
        
        // Initialize dat.GUI
        const guiSettings = setupGUI();
        guiMain = guiSettings.guiMain;
        guiColorManager = guiSettings.guiColorManager;
        guiContainer = guiSettings.guiContainer;
        
        // Initialize shepheard tutorial
        shepherdSettings(guiMain, guiColorManager);

        window.guiMain = guiMain;
        window.guiColorManager = guiColorManager;
        setupParticles(p);
        setupEventHandlers(p);
    }

    ////////////// p5 DRAW //////////////

    p.draw = () => {
        particles = getParticles();

        //Manage z-index of the gui menus if open or closed
        guiContainer.style.zIndex = (guiColorManager.closed && guiMain.closed) ? 1 : 3;
        (appStates.isTourActive && appStates.isMobile ) && openGuiFolers();
        if (p.frameCount % 2 === 0) {
            props['FPS'] = Math.round(p.frameRate());
        }
        if (appStates.isMousePressed) applyRepulsion();

        // Drawing mode 
        appStates.isBackground &&  p.background(props.backgroundColor[0], props.backgroundColor[1], props.backgroundColor[2], props['backgroundAlpha']);

        // Apply rules for interactions
        colors.forEach(color1 => {
            if (!props[`${color1} Visible`]) return; 
            colors.forEach(color2 => {
                if (!props[`${color2} Visible`]) return;
                applyRules(
                    particles.filter(particle => particle.color === color1),
                    particles.filter(particle => particle.color === color2),
                    props[`${color1[0]} <--> ${color2[0]}`]
                );

                appStates.isNexus && (
                    particles.filter(particle => particle.color === color1).forEach(a => {
                        particles.filter(particle => particle.color === color2).forEach(b => {
                            const dx = a.x - b.x;
                            const dy = a.y - b.y;
                            const d = p.sqrt(dx * dx + dy * dy);
                            if (d > 0 && d < props['Max distance interaction']) {
                                p.stroke(color1);
                                p.line(a.x, a.y, b.x, b.y);
                            }
                        });
                    })
                )
            });
        });
        particles.forEach(particle => particle.drawParticle());
    }

    function applyRepulsion() {
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
}
new p5(sketch, 'sketchContainer');  
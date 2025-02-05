import { setP5Instance } from './p5Instance.js';
import {shepherdSettings} from './shepherd.js';
import { setupGUI, colors, props, updateParticles, openGuiFolers, handleViewportChange} from './guiSettings.js';
import { getParticles, setupParticles, applyRules } from './particlesManager.js';
import {appStates} from './appStates.js';


////////////// p5 SETUP //////////////

let sketch = (p) => {
    console.log("sketch, create instance");
    setP5Instance(p);
    let particles;
    let guiContainer, guiMain, guiColorManager;

    let canvaSize = {};

    // Resize windows 

    p.windowResized = () => {
        canvaSize = {width : (appStates.isMobile ? (window.innerWidth * 0.9) : (window.innerWidth * 0.6)), height : (appStates.isMobile ?(window.innerHeight / 1.8) : (window.innerHeight * 0.78))};    
        const canvas = p.createCanvas(canvaSize.width, canvaSize.height);
        canvas.parent("sketchContainer");
        handleViewportChange();
        updateParticles()
    }

    p.setup = () =>{
        
        canvaSize = {width : (appStates.isMobile ? (window.innerWidth * 0.9) : (window.innerWidth * 0.6)), height : (appStates.isMobile ? (window.innerHeight / 1.8) : (window.innerHeight * 0.78))};    
        const canvas = p.createCanvas(canvaSize.width, canvaSize.height);
        // const canvas = createCanvas(1000, 720);
        canvas.parent("sketchContainer");
        handleViewportChange();
        particles = getParticles();
        
        // Initialize dat.GUI
        const guiSettings = setupGUI();
        guiMain = guiSettings.guiMain;
        guiColorManager = guiSettings.guiColorManager;

        // Initialize shepheard tutorial
        shepherdSettings(guiMain, guiColorManager);

        // gui global container
        guiContainer = document.querySelector(".dg.ac");

        window.guiMain = guiMain;
        window.guiColorManager = guiColorManager;
        setupParticles();
    }

    ////////////// p5 DRAW //////////////

    p.draw = () => {
        // console.log(particles);
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

    // Mouse pressed repulsive impact

    p.mousePressed = () => {
        appStates.isMousePressed = true;
    }
    p.mouseReleased = () => {
        appStates.isMousePressed = false;
    }
    p.touchStarted = () => {
        appStates.isMousePressed = true;
    }
    p.touchEnded = () => {
        appStates.isMousePressed = false;
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

    // Save canva screenshot

    document.querySelector(`${appStates.isMobile ? '.save-button-mobile' : '.save-button'}`).addEventListener('click', saveCanvasImage);

    p.keyPressed = () => {
        if (p.key === ' ') {
            saveCanvasImage();
        }
    }
    function saveCanvasImage() {
        const userConfirmation = confirm("Do you want to save this image?");
        if (userConfirmation) p.saveCanvas('myArtwork', 'png');
    }

}
new p5(sketch, 'sketchContainer');  
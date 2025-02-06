import { setP5Instance } from './p5Instance.js';
import { shepherdSettings } from '../ui/shepherd.js';
import { setupGUI, colors, props, openGuiFolers } from '../ui/guiSettings.js';
import { getParticles, setupParticles, applyRules, updateParticles, applyRepulsion } from '../particles/particlesManager.js';
import { appStates } from './appStates.js';
import { setupEventHandlers } from '../ui/eventHandlers.js';
import { calculateCanvasSize, toggleDescriptionCard } from '../utils/utils.js'

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
        setupCanvas(p);
        setupGUIElements();
        shepherdSettings(guiMain, guiColorManager);
        setupParticles(p);
        setupEventHandlers(p);
        removeLoadingScreen();
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
        if (appStates.isMousePressed) applyRepulsion(p);

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
                    props[`${color1[0]} <--> ${color2[0]}`],
                    p
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

    function setupCanvas(p) {
        const canvaSize = calculateCanvasSize();
        const canvas = p.createCanvas(canvaSize.width, canvaSize.height);
        canvas.parent("sketchContainer");
        toggleDescriptionCard();
        particles = getParticles();
    }
    
    // Initialize dat.GUI
    function setupGUIElements() {
        const guiSettings = setupGUI();
        guiMain = guiSettings.guiMain;
        guiColorManager = guiSettings.guiColorManager;
        guiContainer = guiSettings.guiContainer;
        window.guiMain = guiMain;
        window.guiColorManager = guiColorManager;
    }
    
    function removeLoadingScreen(){
        document.getElementById("loading-screen").style.display = "none";
        const mainElement = document.querySelector("main");
        mainElement.style.visibility = "visible"; 
    }
}

new p5(sketch, 'sketchContainer');  
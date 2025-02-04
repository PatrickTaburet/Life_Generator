
document.addEventListener("DOMContentLoaded", () => {
    window.isTourActive = false;

    let isMobile = window.innerWidth < 767;
    let checkbox = document.getElementById('cb1');
    
    const tour = new Shepherd.Tour({
        useModalOverlay: true,
        defaultStepOptions: {
            classes: 'shepherd-theme-arrows',
            scrollTo: true,
            cancelIcon: {
                enabled: true
            },
            when: {
                show: function() {
                    const footer = this.el.querySelector('.shepherd-footer');
                    if (footer) {
                        const pagination = createPagination(this);
                        footer.insertAdjacentHTML('afterbegin', pagination);
                    }
                }
            }
        }
    });

    // Pagination

    function createPagination(step) {
        const totalSteps = tour.steps.length;
        const currentStep = tour.steps.indexOf(step) + 1;
        return `<div class="shepherd-pagination">${currentStep} / ${totalSteps}</div>`;
    }

    // Keyboard navigation

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            tour.cancel();
        } else if (event.key === ' ' || event.key === 'Enter') {
            if (tour.isActive()) {
                event.preventDefault();  
                event.stopPropagation();
                tour.next();
            }
        }
    });

    // Steps

    tour.addStep({
        id: 'step-one',
        text: "<span class='warning'>This is your canvas – your laboratory !</span> <br> <br> Here, you can observe the particles moving, evolving, and interacting with each other. <br> Click anywhere on the canvas to interact with the particles !",
        attachTo: { element: '.p5Canvas', on: 'top' },
        buttons: [
            {
                text: 'Next',
                action: tour.next
            }
        ],
        when: {
            show: function() {
                if (checkbox && isMobile) {
                    checkbox.checked = false;
                }
                const footer = this.el.querySelector('.shepherd-footer');
                if (footer) {
                    const pagination = createPagination(this);
                    footer.insertAdjacentHTML('afterbegin', pagination);
                }
            }
        }
    });

    tour.addStep({
        id: 'step-two',
        text: "Click this button to <span class='warning'>save</span> and <span class='warning'>download</span> your canvas to your computer once you're satisfied with the result ! <br> You can also press <span class='warning'>Spacebar</span> to quickly save your image.",
        attachTo: { element: `${isMobile ? '.step2-mobile' : '.step2' }`  , on: 'bottom' },
        buttons: [
            {
                text: 'Next',
                action: tour.next
            }
        ],
     
    });
    tour.addStep({
        id: 'step-three',
        text: "<span class='warning'>This is your main control panel.</span> <br> <br>For each color's particles, you can increase their quantity and adjust how they interact with other colors (attraction or repulsion).",
        attachTo: { element: '.step3', on: `${isMobile ? 'bottom' : 'left'  }`},
        buttons: [
            {
                text: 'Next',
                action: tour.next
            }
        ],
        when: {
            show: function() {
                window.isTourActive = true;
                if (checkbox && isMobile) {
                    checkbox.checked = false;
                }
                const footer = this.el.querySelector('.shepherd-footer');
                if (footer) {
                    const pagination = createPagination(this);
                    footer.insertAdjacentHTML('afterbegin', pagination);
                }   
            }
        }
    });
    tour.addStep({
        id: 'step-four',
        text: "<span class='warning'>In the global settings, you can: </span> <br><br> • Use the <span class='warning'>Reset</span> button to return to the default settings. <br><br> • The <span class='warning'>Random</span> button, a fun way to discover unexpected results, lets you experiment with random settings !  <br><br> • Adjust the <span class='warning'>Maximum Distance</span> at which particles interact with each other. <br><br> • <span class='warning'>Zoom </span> in or out to explore new patterns or closely observe interactions. <br><br> • Control the simulation speed using the <span class='warning'>Time Scale</span> slider to slow down or accelerate particle movement. <br><br> • Adjust the <span class='warning'>Click Impact</span> to modify how strongly particles are repelled when clicking.",
        attachTo: { element: '.step4', on: 'top' },
        buttons: [
            {
                text: 'Next',
                action: tour.next
            }
        ]
    });
    tour.addStep({
        id: 'step-five',
        text: "The Nexus and Drawing Mode buttons offer a more artistic way to observe particle interactions. <br><br> <span class='warning'>Be careful, though — these modes may require significant computing power if many particles are present on the screen, so use them sparingly. You can check the <span class='warning'>FPS</span> in <span class='warning'>Global Settings</span> to monitor performance and adjust settings accordingly.</span> <br><br> • <span class='warning'>Nexus Mode</span> visually represents the interactions between particles by creating a link between any two particles experiencing a force, resulting in stunning effects ! <br><br> • <span class='warning'> Drawing Mode </span> leaves a trail of all previous particle positions on the screen, turning these traces into a true masterpiece. <br><br> Transform your laboratory into a unique, evolving piece of art !",
        attachTo: { element: '.nexus-mode', on: `${isMobile ? 'bottom' : 'left'}`},
        buttons: [
            {
                text: 'Next',
                action: tour.next
            }
        ]
    });
    tour.addStep({
        id: 'step-six',
        text:"The <span class='warning'>Color Manager</span> allows you to mask one or more particle colors on the screen. <br> Experiment with the checkboxes, and you'll see the difference — it can be quite surprising !",
        attachTo: { element: '#color-manager',  on: `${isMobile ? 'bottom' : 'left'}`},
        buttons: [
            {
                text: 'Next',
                action: tour.next
            }
        ]
    });
    tour.addStep({
        id: 'step-seven',
        text: "<span class='warning'>The Drawing settings let you customize the visual style of the simulation.</span> <br><br> • Add a persistent <span class='warning'>Trail effect</span> for a dynamic visual experience.<br><br> • Set the <span class='warning'>Particle Radius</span> to modify their size and appearance. <br><br> • Select a <span class='warning'>Background Color</span> to set the mood and contrast for your visualization. <br><br> Fine-tune these options to create your own mesmerizing digital artwork !",
        attachTo: { element: '#drawing-folder',  on: `${isMobile ? 'bottom' : 'left'}`},
        buttons: [
            {
                text: 'Next',
                action: tour.next
            }
        ]
    });
    tour.addStep({
        id: 'step-height',
        text:"That's it ! Now you know all about the Life Simulator.<br> Let's experiment and watch these molecules come to life ! :)",
        cancelIcon: {
            enabled: false
        },
        buttons: [
            {
                text: 'Exit',
                action: () => {
                    if (window.guiMain && window.guiColorManager && isMobile) {                        
                        window.guiMain.close();
                        window.guiColorManager.close();
                    }
                    tour.cancel();
                }
            },
        ]
    });

    document.getElementById("how-to-use").addEventListener("click", () => {
        tour.start();
    });
    tour.on('complete', () => {
        window.isTourActive = false;
    });
    
    tour.on('cancel', () => {
        window.isTourActive = false;
    });
});

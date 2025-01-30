
document.addEventListener("DOMContentLoaded", () => {
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
                    const pagination = createPagination(this);
                    footer.insertAdjacentHTML('afterbegin', pagination);
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

    // Steps

    tour.addStep({
        id: 'step-one',
        text: "This is your canvas – your laboratory! <br> Here, you can observe the particles moving, evolving, and interacting with each other. <br> Click anywhere on the canvas to interact with the particles!",
        attachTo: { element: '.p5Canvas', on: 'top' },
        buttons: [
            {
                text: 'Next',
                action: tour.next
            }
        ]
    });

    tour.addStep({
        id: 'step-two',
        text: "Click this button to save and download your canvas to your computer once you're satisfied with the result!",
        attachTo: { element: '.step2', on: 'bottom' },
        buttons: [
            {
                text: 'Next',
                action: tour.next
            }
        ]
    });
    tour.addStep({
        id: 'step-three',
        text: "This is your main control panel. For each color's particles, you can increase their quantity and adjust how they interact with other colors (attraction or repulsion).",
        attachTo: { element: '.step3', on: 'left' },
        buttons: [
            {
                text: 'Next',
                action: tour.next
            }
        ]
    });
    tour.addStep({
        id: 'step-four',
        text: "In the global settings, you can: <br><br> • Adjust the maximum distance at which particles interact with each other. <br> • Add a persistent trail effect for a dynamic visual experience. <br> • Zoom in or out to explore new patterns or closely observe interactions. <br> • Use the 'Reset' button to return to the default settings. <br> • The 'Random' button, a fun way to discover unexpected results, lets you experiment with random settings!",
        attachTo: { element: '.step4', on: 'left' },
        buttons: [
            {
                text: 'Next',
                action: tour.next
            }
        ]
    });
    tour.addStep({
        id: 'step-five',
        text: "The Nexus and Drawing Mode buttons offer a more artistic way to observe particle interactions. <br> Be careful, though—these modes may require significant computing power if many particles are present on the screen, so use them sparingly. <br><br> •  Nexus Mode visually represents the interactions between particles by creating a link between any two particles experiencing a force, resulting in stunning effects! <br> • Drawing Mode leaves a trail of all previous particle positions on the screen, turning these traces into a true masterpiece. <br><br> Transform your laboratory into a unique, evolving piece of art!",
        attachTo: { element: '#nexus-mode-button', on: 'left' },
        buttons: [
            {
                text: 'Next',
                action: tour.next
            }
        ]
    });
    tour.addStep({
        id: 'step-six',
        text:"Finally, this panel allows you to mask one or more particle colors on the screen. Experiment with the checkboxes, and you'll see the difference—it can be quite surprising!",
        attachTo: { element: '#color-manager', on: 'left' },
        buttons: [
            {
                text: 'Next',
                action: tour.next
            }
        ]
    });
    tour.addStep({
        id: 'step-seven',
        text:"That's it! Now you know all about the Life Simulator. Let's experiment and watch these molecules come to life! :)",
        cancelIcon: {
            enabled: false
        },
        buttons: [
            {
                text: 'Exit',
                action: tour.cancel
            },
        ]
    });

    document.getElementById("how-to-use").addEventListener("click", () => {
        tour.start();
    });
});

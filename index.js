m = document.querySelector("#life").getContext('2d');

function draw(x,y,c,s){
    m.fillStyle = c;
    m.fillRect(x, y, s, s);
}

let particles = [];
function particle(x,y,c){
    return {"x":x, "y": y, 'vx':0, 'vy':0, "color":c };
}   

function random(){
    return Math.random()*400+50;
}

function create(number, color){
    group=[];
    for(let i=0; i < number; i++){
        group.push(particle(random(), random(), color));
        particles.push(group[i]);
    }
    return group;
}
function rule (particles1, particles2, g){
    for (let i=0; i<particles1.length; i++) { 
        fx=0;
        fy=0;
        for(let j=0; j < particles2.length; j++){
        // pythagore pour calculer la distance entre 2 points
            a = particles1[i];
            b = particles2[j];
            dx = a.x - b.x;
            dy = a.y - b.y;
            d = Math.sqrt(dx*dx + dy * dy);

        // force d'attraction [ F1 = F2 = G*(m1m2/r2)] comme m=1, F=G*1/d2
            if (d > 0 && d < distanceInterract) {
                F = g *1/d;
                fx += (F*dx);
                fy += (F*dy);
            }
        }
        a.vx = (a.vx + fx)*0.5;
        a.vy = (a.vy + fy)*0.5;
        a.x += a.vx;
        a.y += a.vy;
        if ((a.x <= 0) || (a.x >= 500)){a.vx *= -1 };
        if ((a.y <= 0) || (a.y >= 500)){a.vy *= -1 };
    }
}

    let Yparticles = superSlider("Yparticles","Yparticles", 100, 'YparticlesValue');
    let Rparticles = superSlider("Rparticles","Rparticles", 100, 'RparticlesValue');
    let Gparticles = superSlider("Gparticles","Gparticles", 100, 'GparticlesValue');
    
    let RRInterract = superSlider("RRInterract","RRInterract", 0, 'RRInterractValue');
    let RYInterract = superSlider("RYInterract","RYInterract", 0, 'RYInterractValue');
    let RGInterract = superSlider("RGInterract","RGInterract", 0, 'RGInterractValue');
    
    let YYInterract = superSlider("YYInterract","YYInterract", 0, 'YYInterractValue');
    let YRInterract = superSlider("YRInterract","YRInterract", 0, 'YRInterractValue');
    let YGInterract = superSlider("YGInterract","YGInterract", 0, 'YGInterractValue');
    
    let GGInterract = superSlider("GGInterract","GGInterract", 0, 'GGInterractValue');
    let GYInterract = superSlider("GYInterract","GYInterract", 0, 'GYInterractValue');
    let GRInterract = superSlider("GRInterract","GRInterract", 0, 'GRInterractValue');
    
    let distanceInterract = superSlider("distanceInterract","distanceInterract", 80, 'distanceInterractValue');
    
    let yellow = create(Yparticles, "yellow");
    let red = create(Rparticles,"red");
    let green = create(Gparticles, "green");
    
    console.log(GRInterract)
    
    function update(){
        rule(red, red, RRInterract);
        rule(yellow, yellow, YYInterract);
        rule(red, yellow, RYInterract);
        rule(yellow, red, YRInterract);
        rule(green, green, GGInterract);
        rule(green, yellow, GYInterract)
        rule(green, red, GRInterract)
        rule(red, green, RGInterract)
        rule(yellow, green, YGInterract);
        
        m.clearRect(0,0,500,500);
        draw(0,0,"black", 500);
        for(i=0; i<particles.length; i++){
            draw(particles[i].x, particles[i].y, particles[i].color ,5);
        }
        requestAnimationFrame(update);
    }
    update();
    
    // range slider : to controll settings with a slider (interractions, global settings, number of perticles)
    
    function superSlider(idSlider, idItem, sourceNumber, screen ){
        let slider = document.getElementById(idSlider);
        let sliderScreen = document.getElementById(screen)
        slider.value = (localStorage.getItem(idItem)) ?  localStorage.getItem(idItem) : sourceNumber;
        sliderScreen.value =  (localStorage.getItem(idItem)) ?  localStorage.getItem(idItem) : sourceNumber;
    
        let currentValue =  slider.value;
        slider.addEventListener("mouseup",  e => {
            let previousValue = slider.value;
            localStorage.setItem(idItem, previousValue);
            sliderScreen.value =  localStorage.getItem(idItem);
            location.reload();
            });
        return (currentValue);
    }

        // to visualize the actual value of the sliders

        function updateTextInput(val, screen) {
            document.getElementById(screen).value=val; 
        }
        updateTextInput(Yparticles, 'YparticlesValue');
        updateTextInput(Rparticles, 'RparticlesValue');
        updateTextInput(Gparticles, 'GparticlesValue');
        
        updateTextInput(RRInterract, 'RRInterractValue');
        updateTextInput(RYInterract, 'RYInterractValue');
        updateTextInput(RGInterract, 'RGInterractValue');
        
        updateTextInput(YYInterract, 'YYInterractValue');
        updateTextInput(YRInterract, 'YRInterractValue');
        updateTextInput(YGInterract, 'YGInterractValue');
        
        updateTextInput(GGInterract, 'GGInterractValue');
        updateTextInput(GYInterract, 'GYInterractValue');
        updateTextInput(GRInterract, 'GRInterractValue');
        
        updateTextInput(distanceInterract, 'distanceInterractValue');
        
        // reset & random buttons
        
        let resetButton = document.getElementById("resetButton");
        resetButton.addEventListener("click", e => {
            localStorage.clear();
            location.reload();
        })
        
        let randButton = document.getElementById("randButton");
        randButton.addEventListener("click", e => {
            localStorage.setItem("Yparticles", Math.floor(Math.random() * 300));
            localStorage.setItem("Rparticles", Math.floor(Math.random() * 300));
            localStorage.setItem("Gparticles", Math.floor(Math.random() * 300));
            localStorage.setItem("RRInterract", (Math.random() * 10)-5);
            localStorage.setItem("RYInterract", (Math.random() * 10)-5);
            localStorage.setItem("RGInterract", (Math.random() * 10)-5);
            localStorage.setItem("YYInterract", (Math.random() * 10)-5);
            localStorage.setItem("YRInterract", (Math.random() * 10)-5);
            localStorage.setItem("YGInterract", (Math.random() * 10)-5);
            localStorage.setItem("GGInterract", (Math.random() * 10)-5);
            localStorage.setItem("GYInterract", (Math.random() * 10)-5);
            localStorage.setItem("GRInterract", (Math.random() * 10)-5);
            location.reload();
        })
        
        // --> add all differents variables paricles in an array to make loop foreach
        
                

// GUI interface : 

let particlesProps = {
  'Particles' : 50,
  'Y/Y interaction' : 0,
  'Y/R interaction' : 0,
  'Y/G interaction' : 0,
  'R/R interaction' : 0,
  'R/Y interaction' : 0,
  'R/G interaction' : 0,
  'G/G interaction' : 0,
  'G/Y interaction' : 0,
  'G/R interaction' : 0,
  'Max distance interaction' : 100,
  'Reset': function() { 
    console.log('Reset button clicked');
  },
  'Random': function() { 
    console.log('Random button clicked');
  }
};

let props = particlesProps;
let gui = new dat.GUI();

// Folders
let particlesSettings = gui.addFolder("Particles Settings");
let yellowSettings = particlesSettings.addFolder("Yellow");
let redSettings = particlesSettings.addFolder("Red");
let greenSettings = particlesSettings.addFolder("Green");
// Props by folders
let yellowParticles = yellowSettings.add(props, 'Particles', 0, 300, 1);
let Y_Y_Interract = yellowSettings.add(props, 'Y/Y interaction', -5, 5, 0.05);
let Y_R_Interract = yellowSettings.add(props, 'Y/R interaction', -5, 5, 0.05);
let Y_G_Interract = yellowSettings.add(props, 'Y/G interaction', -5, 5, 0.05);

let redParticles = redSettings.add(props, 'Particles', 0, 300, 1);
let R_R_Interract = redSettings.add(props, 'R/R interaction', -5, 5, 0.05);
let R_Y_Interract = redSettings.add(props, 'R/Y interaction', -5, 5, 0.05);
let R_G_Interract = redSettings.add(props, 'R/G interaction', -5, 5, 0.05);

let greenParticles = greenSettings.add(props, 'Particles', 0, 300, 1);
let G_G_Interract = greenSettings.add(props, 'G/G interaction', -5, 5, 0.05);
let G_Y_Interract = greenSettings.add(props, 'G/Y interaction', -5, 5, 0.05);
let G_R_Interract = greenSettings.add(props, 'G/R interaction', -5, 5, 0.05);

// Global props 

let maxDistanceInterract = particlesSettings.add(props, 'Max distance interaction', 0, 200, 0.05);
let ResetButton = gui.add(props, 'Reset');
let randomButton = gui.add(props, 'Random');


// let lineNumber = moveFolder.add(props, 'Number of lines', 0, 100, 1);
// gui.addColor(props, "Color"); -> Color picker pannel


// Y_Y_Interract.onChange(reset);
// Y_R_Interract.onChange(reset);
// Y_G_Interract.onChange(reset);
// R_R_Interract.onChange(reset);
// R_Y_Interract.onChange(reset);
// R_G_Interract.onChange(reset);
// G_G_Interract.onChange(reset);
// G_Y_Interract.onChange(reset);
G_R_Interract.onChange(reset);

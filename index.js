m = document.querySelector("#life").getContext('2d');
// localStorage.clear();
function draw(x,y,c,s){
    m.fillStyle = c;
    m.fillRect(x, y, s, s);
}

particles =[];
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
            if (d > 0 && d < 80) {
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
yellow = create(superSlider("yellowPatricles","yellowPatricles", 100), "yellow");
red = create(superSlider("redPatricles","redPatricles", 100),"red");
// green = create(200, "green");


function update(){
    rule(red, red, -0.1);
    rule(red, yellow, -0.01);
    rule(yellow, red, 0.01);
    // rule(green, green, -0.7)
    // rule(green, red, -0.5)
    // rule(red, green, -0.1)
    // rule(yellow, green, 0.1)
    
    m.clearRect(0,0,500,500);
    draw(0,0,"black", 500);
    
    for(i=0; i<particles.length; i++){
        draw(particles[i].x, particles[i].y, particles[i].color ,5);
    }
    requestAnimationFrame(update);
}
update();
// console.log("--------" + superSlider("particleSlider","particleSlider", 100));
// console.log(localStorage["particleSlider"]);


// range slider : to controll settings with a slider (curve, zoom, number of perticles)

function superSlider(idSlider, idItem, sourceNumber){
    let slider = document.getElementById(idSlider);
    slider.value = (localStorage.getItem(idItem)) ?  localStorage.getItem(idItem) : sourceNumber;
    let previousValue = (localStorage.getItem(idItem)) ?  localStorage.getItem(idItem) : slider.value;
    slider.addEventListener("mouseup",  e => {
        let currentValue = slider.value;
        localStorage.setItem(idItem, currentValue);
        location.reload();
        });
    // console.log(localStorage);
    // console.log(previousValue);
    // console.log(slider.value);
    return (previousValue);
}

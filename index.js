m = document.querySelector("#life").getContext('2d');

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
            if (d > 0) {
                F = g *1/d;
                fx += (F*dx);
                fy += (F*dy);
            }
        }
        a.vx = (a.vx + fx);
        a.vy = (a.vy + fy);
        a.x += a.vx;
        a.y += a.vy;
    }
}
yellow = create(5, "yellow");
red = create(5,"red");


function update(){
    rule(yellow, red, -0.2);
    rule(red, yellow, -0.2);
    m.clearRect(0,0,500,500);
    draw(0,0,"black", 500);
    
    for(i=0; i<particles.length; i++){
        draw(particles[i].x, particles[i].y, particles[i].color ,5);
    }
    requestAnimationFrame(update);
}
update();
console.log(yellow.length);
console.log(particles.length);
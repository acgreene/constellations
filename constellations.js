const canvas = document.getElementById("canvas1");

//returns a two-dimensional drawing context on the canvas
const ctx = canvas.getContext('2d'); 

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particlesArray;

//get mouse position
let mouse = {
    x: null,
    y: null,

    //radius property determines the radius around the mouse in 
    //which the particles will react, will scale depending on 
    //canvas size. 
    radius: (canvas.height/80) * (canvas.width/80)
}

//anytime the mouse is moved in the web page window, store the 
//x and y positions in the mouse object. 
window.addEventListener('mousemove',
    function(event) {
        mouse.x = event.x;
        mouse.y = event.y;
    }
);


class Particle {

    //initialize an instance of a particle object
    constructor(x, y, directionX, directionY, size, color) {
        this.x = x;
        this.y = y;
        this.directionX = directionX;
        this.directionY = directionY;
        this.size = size;
        this.color = color;
        this.leader = false;
    }

    draw() {
        //starts a new path within the 2D drawing context by emptying
        //the list of sub-paths.
        ctx.beginPath();

        //adds a circular arc to the current sub-path.
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);

        ctx.fillStyle = '#ECFDFD';

        //fills the ctx path with fillStyle
        ctx.fill();
    }

    update() {
        //check if the particle is still within the canvas, if not
        //force it to be back in bounds. 
        if (this.x > canvas.width || this.x < 0) {
            this.directionX = -this.directionX;
        }
        if(this.y > canvas.height || this.y < 0){
            this.directionY = -this.directionY;
        }

        //create variables to find the distance between the particle
        //and the current mouse position. 
        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let distance = Math.sqrt(dx*dx + dy*dy);

        //check if the distance between the mouse and the particle
        //is less than their combined radii. if it is less then this
        //means that the particle should react to the mouse.
        if (distance < mouse.radius + this.size) {
            
            //nested if statements below are only done for colliding 
            //particles. they decide which direction the particle should move
            //if it collides with the mouse. We use the canvas.width to make
            //sure that it isn't pushed off screen. 

            let react = 1.2;

            if (mouse.x < this.x && this.x < canvas.width - this.size * 10) {
                this.x += react;
            }
            if (mouse.x > this.x && this.x > this.size * 10) {
                this.x -= react;
            }
            if (mouse.y < this.y && this.y < canvas.height - this.size * 10) {
                this.y += react;
            }
            if (mouse.y > this.y && this.y > this.size * 10) {
                this.y -= react;
            }
        }

        //move the particles that are not colliding with the mouse.
        this.x += this.directionX;
        this.y += this.directionY;

        //draw particle
        this.draw();
    }
}

//create all of the particles on screen
function init() {
    particlesArray = [];

    //let the number of particles existing be dependent on the canvas dimensions. 
    let numberOfParticles = (canvas.height * canvas.width) / 9000;

    //create the individual particles, randomly assign their properties, and push
    //them into the particles array.
    
    for (let i = 0; i < numberOfParticles; i++) {

        //VARIABLE ME FOR CLASS
        // let size = (Math.random() * 0.1) + 0.8;
        let size = 0;


        let x = (Math.random() * ((innerWidth - size * 2) - (size * 2)) + size * 2);
        let y = (Math.random() * ((innerHeight - size * 2) - (size * 2)) + size * 2);
        
        //VARIABLE ME (multipliers here dictate the velocity around the canvas)
        let directionX = (Math.random() * 0.25);
        let directionY = (Math.random() * 0.7);
        let color = '#ECFDFD';

        particlesArray.push(new Particle(x, y, directionX, directionY, size, color));
    }
}

function chooseLeaders() {

}

//add particle on click
window.addEventListener('click', 
    function() {
        let size = (Math.random() * 0.1) + 0.8;
        let x = mouse.x;
        let y = mouse.y;
        
        //VARIABLE ME (multipliers here dictate the velocity around the canvas)
        let directionX = (Math.random() * 0.25);
        let directionY = (Math.random() * 0.7);
        let color = '#ECFDFD';

        particlesArray.push(new Particle(x, y, directionX, directionY, size, color));
    }
);


//check if particles are close enough to draw a line between them.
function connect() {
    
    let opacityValue = 1;

    for (let a = 0; a < particlesArray.length; a++) {
        for (let b = a + 1; b < particlesArray.length; b++) {
            let dx = particlesArray[a].x - particlesArray[b].x;
            let dy = particlesArray[a].y - particlesArray[b].y;
            let distance = (dx*dx + dy*dy);

            if (distance < (((canvas.width) * (canvas.height)) / 40)) {
                opacityValue = 1 - (distance/10000);

                if ((particlesArray[a].x < (canvas.width/2)) && (particlesArray[a].y < (canvas.height/2))) {
                    ctx.strokeStyle = 'rgba(86,153,33,' + opacityValue + ')';
                }
                else {
                    ctx.strokeStyle = 'rgba(236,253,253,' + opacityValue + ')';
                }
                

                ctx.lineWidth = 1 + (1/(1 + distance));
                ctx.beginPath();
                ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                ctx.stroke();
            }
        }
    }
}

//animation loop
function animate() {
    
    //requestAnimationFrame will repeatedly execute the callback function (in
    //this case, animate) per frame and pass it a timestamp. 
    requestAnimationFrame(animate);

    //erases the pixels in a rectangular area, required at the start of each 
    //frame in an animation. 
    ctx.clearRect(0,0,innerWidth, innerHeight);

    for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
    }

    //call connect so that the function will run for every frame of the animation. 
    connect();
}

//resize event
window.addEventListener('resize', 
    function() {
        canvas.width = innerWidth;
        canvas.height = innerHeight;
        mouse.radius = ((canvas.height/80) * (canvas.height/80));

        
        // init();
    }
);

//mouse out event
window.addEventListener('mouseout', 
    function() {
        mouse.x = undefined;
        mouse.y = undefined;
    }
);

init();
animate();
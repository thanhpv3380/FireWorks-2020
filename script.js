const WIDTH = 1520;
const HEIGHT = 728;
const PARTICLE_SIZE = 6;
const PARTICLE_CHANGE_SIZE_SPEED = 0.05;
const PARTICLE_CHANGE_SPEED = 0.3;
const ACCELERATION = 0.12;
const DOT_CHANGE_SIZE_SPEED = 0.05;
const DOT_CHANGE_ALPHA_SPEED = 0.05;
const PARTICLE_MIN_SPEED = 10;
const NUMBER_PARTICLE_PER_BULLET = 25;
class particle {
    constructor(bullet, deg) { // deg: goc bay cua hat
        this.bullet = bullet;
        this.deg = deg;
        this.color = this.bullet.color;
        this.ctx = bullet.ctx;
        this.x = this.bullet.x;
        this.y = this.bullet.y;
        this.size = PARTICLE_SIZE;

        this.speed = PARTICLE_MIN_SPEED + Math.random() * 2;
        this.speedX = 0;
        this.speedY = 0;
        this.fallSpeed = 0;

        this.dots = [
            //{ x: 10, y: 10, alpha: 1, size: 10},


        ];
    }
    update() {
        this.speed -= PARTICLE_CHANGE_SPEED;
        if (this.speed < 0) {
            this.speed = 0;
        }
        // increase fall speed
        this.fallSpeed += ACCELERATION;

        this.speedX = Math.cos(this.deg) * this.speed;
        this.speedY = Math.sin(this.deg) * this.speed + this.fallSpeed;
        // calculate position
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.size > PARTICLE_CHANGE_SIZE_SPEED) {
            this.size -= PARTICLE_CHANGE_SIZE_SPEED;
        }
        
        if (this.size > 0) {
            this.dots.push({
                x: this.x,
                y: this.y,
                alpha: 1, 
                size: this.size
            });
        }
        this.dots.forEach( dot => {
            dot.size -= DOT_CHANGE_SIZE_SPEED;
            dot.alpha -= DOT_CHANGE_ALPHA_SPEED;      
        });
        this.dots = this.dots.filter( dot => {
            return dot.size > 0;
        });
        if (this.dots.length == 0){
            this.remove();
        }
    }
    remove(){
        this.bullet.particles.splice(this.bullet.particles.indexOf(this), 1);
    }
    draw() {
        this.dots.forEach( dot => {
            this.ctx.fillStyle = 'rgba('+ this.color + ', ' + dot.alpha + ')';
            this.ctx.beginPath();
            this.ctx.arc(dot.x, dot.y, dot.size, 0, 2 * Math.PI);
            this.ctx.fill();
        })
    }
}
class bullet {
    constructor(fireworks, x, y) {
        this.fireworks = fireworks;
        this.ctx = fireworks.ctx;
        this.x = x;
        this.y = y;
        this.color = Math.floor(Math.random() * 255) + ', ' +
            Math.floor(Math.random() * 255) + ', ' +
            Math.floor(Math.random() * 255);
        this.particles = [];
        // create one particle
        let bulletDeg = 2 * Math.PI / NUMBER_PARTICLE_PER_BULLET;
        for (let i = 0; i <= NUMBER_PARTICLE_PER_BULLET; i++) {
            let newPaticle = new particle(this, i * bulletDeg);
            this.particles.push(newPaticle);
        }

    }
    update() {
        if (this.particles.length == 0){
            this.remove();
        } 
        this.particles.forEach(particle => particle.update());

    }
    remove(){
        this.fireworks.bullets.splice(this.fireworks.bullets.indexOf(this), 1);
    }
    draw() {
        this.particles.forEach(particle => particle.draw());
    }
}
class fireworks {
    constructor() {
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.canvas.width = WIDTH;
        this.canvas.height = HEIGHT;
       

        document.body.appendChild(this.canvas);

        this.bullets = [];
        // create new bullet
        let numberBullet = Math.floor(Math.random() * 10);
        for (let i = 0; i <= numberBullet; i++){
           
        }
        setInterval(() => {
            let x = Math.random() * WIDTH;
            let y = Math.random() * (HEIGHT - 400) ;
            let newBullet = new bullet(this, x, y);
            this.bullets.push(newBullet);
        }, 1500);
        this.loop();
       

    }

    loop() {
        this.bullets.forEach(bullet => {
            bullet.update()
        })
        this.draw();
        console.log('loop');
        setTimeout(() => this.loop(), 20);
    }
    clearScreen() {
        this.ctx.fillStyle = '#000000';
        this.ctx.fillRect(0, 0, WIDTH, HEIGHT);
        

    }
    draw() {
        this.clearScreen();
        this.bullets.forEach(bullet => {
            bullet.draw()
        });
        // fill text
        this.ctx.fillStyle = '#FF0000';
        this.ctx.font = "150px Luckiest Guy";
        this.ctx.fillText("HENRY THÀNH", WIDTH / 2 - 480, HEIGHT / 2);
    }
}
var f = new fireworks();
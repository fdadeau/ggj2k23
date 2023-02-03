
const SPEED = 0.001;
const FRAME_DELAY = 100;


/**
 * Build an enemy of the specified type.
 * @param {string} type Enemy type
 * @param {number} x initial X position
 * @param {number} y initial Y position
 * @param {number} dx initial direction on X axis
 * @param {number} dy initial direction on Y axis
 * @returns A newly-built enemy of the specified type.
 */
export function buildEnemy(type,x,y,dx,dy) {
    switch (type) {
        case "dino":
            return new Dino(x,y,dx,dy);
        // ... TODO ... make more enemies
    }
}


/**
 * Classes describing enemies.
 */

class Enemy {

    constructor(x, y, dirX, dirY) {
        this.x = x;
        this.y = y;
        this.dirX = dirX;
        this.dirY = dirY;
        this.speed = 0;
        this.angle = Math.acos(dirX / Math.sqrt(dirX*dirX+dirY*dirY)) * 180 / Math.PI;
        if (this.dirY < 0) {
            this.angle *= -1;
        }
        if (this.angle < 0) {
            this.angle += 360;
        }
    }

    /** Common behavior */
    update(dt) { 
        this.x += this.dirX * dt * this.speed;
        this.y += this.dirY * dt * this.speed;
        this.behavior(dt);
    }

    behavior() { }

    collides(x, y) {
        return false;
        return x < this.x - 0.1 || x > this.x + 0.1 || y < this.y - 0.1 || y > this.y - 0.1; 
    }

}


/** CUTE DINOSAUR */

const WALK = [4,5,6,7,8,9,10,11,12,13];
const IDLE = [0];

const DINO_SPRITESHEET = new Image();
DINO_SPRITESHEET.src = "../data/dino-spritesheet.png";
const DINO_HEIGHT = 5664/24 | 0;
const DINO_WIDTH = 240;

class Dino extends Enemy {

    constructor(x, y, dirX, dirY) {
        super(x, y, dirX, dirY);
        this.setAnimation(IDLE);
        this.factor = 2;
        this.height = DINO_HEIGHT;
        this.width = DINO_WIDTH;
        this.vMove = 20;
    }

    setAnimation(anim) {
        this.animation = anim;
        this.frameDelay = FRAME_DELAY;
        this.frame = 0;
    }

    walk() {
        this.speed = SPEED;
        this.setAnimation(WALK);
    }

    stop() {
        this.speed = 0;
        this.setAnimation(IDLE);
    }

    update(dt) {
        super.update(dt);
        this.frameDelay -= dt;
        if (this.frameDelay <= 0) {
            this.frameDelay = FRAME_DELAY;
            this.frame = (this.frame + 1) % this.animation.length;
        }
    }

    render(ctx, minX, maxX, sizeX, sizeY, x, y, angle) {
        let sourceX = minX / sizeX * DINO_WIDTH | 0;
        let width = (maxX - minX) / sizeX * DINO_WIDTH | 0;
        
        let dec = 2;
        if (this.speed == 0) {
            if (angle >= 45 && angle < 135) {
                dec = 0;
            }
            else if (angle >= 135 && angle < 225) {
                dec = 3;
            }
            else if (angle >= 225 && angle < 315) {
                dec = 1;
            }
        }
        else {
            dec = angle > 90 && angle < 270 ? 10 : 0; 
        }
        ctx.fillText(`Dino:   dirX=${this.dirX.toFixed(2)}, dirY=${this.dirY.toFixed(2)}, angle=${this.angle.toFixed(2)}, angleComputed=${angle}`, 10, 30);
        ctx.drawImage(DINO_SPRITESHEET, sourceX, ((this.animation[this.frame]+dec) * DINO_HEIGHT), width, DINO_HEIGHT, x, y, maxX - minX, sizeY);
    }


}

const SPEED = 0.001;
const FRAME_DELAY = 100;

/** CUTE DINOSAUR */

const WALK = [4,5,6,7,8,9,10,11,12,13];
const IDLE = [0];

const DINO_SPRITESHEET = new Image();
DINO_SPRITESHEET.src = "../data/dino-spritesheet.png";
const DINO_HEIGHT = 5664/24 | 0;
const DINO_WIDTH = 240;

/** ANGRY TREE */

const TREE_WALK = [0,4,8];
const TREE_IDLE = [0];
const TREE_PUNCH = [12,12,13,14,15];

const TREE_SPRITESHEET = new Image();
TREE_SPRITESHEET.src = "../data/tree-spritesheet.png";
const TREE_HEIGHT = 13600/17 | 0;
const TREE_WIDTH = 800;

const TREE_ATTACK_DAMAGE = 20;
const TREE_HP = 100;
const TREE_ATTACK_DELAY = 500;

const TREE_HURT = [16,16,16,16,16];

/** DEADLY TURNIP */
const TURNIP_WALK = [0,4,8];
const TURNIP_IDLE = [0];
const TURNIP_BITE = [12,12,13,13];

const TURNIP_SPRITESHEET = new Image();
TURNIP_SPRITESHEET.src = "../data/turnip-spritesheet.png";
const TURNIP_HEIGHT = 5852/14 | 0;
const TURNIP_WIDTH = 419;

const TURNIP_HURT = [14,14,14,14,14];
const TURNIP_ATTACK_DAMAGE = 20;
const TURNIP_HP = 100;
const TURNIP_ATTACK_DELAY = 500;


/** DANDELION LA MENACE  */
const DANDELION_WALK = [0,2,4,6];
const DANDELION_IDLE = [0];
const DANDELION_YEET = [8,9,10,11];

const DANDELION_SPRITESHEET = new Image();
DANDELION_SPRITESHEET.src = "../data/dandelion-spritesheet.png";
const DANDELION_HEIGHT = 6000/12 | 0;
const DANDELION_WIDTH = 500;

const DANDELION_HURT = [0];
const DANDELION_ATTACK_DAMAGE = 20;
const DANDELION_HP = 100;
const DANDELION_ATTACK_DELAY = 500;

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
            return new Dino(x,y,dx,dy,WALK,IDLE);
        case "tree":
            return new Tree(x,y,dx,dy,TREE_WALK,TREE_IDLE,TREE_HURT);
        case "turnip":
            return new Turnip(x,y,dx,dy,TURNIP_WALK,TURNIP_IDLE,TURNIP_HURT);
        case "dandelion":
            return new Dandelion(x,y,dx,dy,DANDELION_WALK,DANDELION_IDLE,DANDELION_HURT);
        // ... TODO ... make more enemies
    }
}


/**
 * Classes describing enemies.
 */

class Enemy {
    constructor(x, y, dirX, dirY, walkAnim, idleAnim, hurtAnim, hp, attackDamage) {
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
        this.walkA = walkAnim;
        this.idleA = idleAnim;
        this.hurtA = hurtAnim;
        this.health = hp;

        this.attackDamage = attackDamage;
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
        // return x < this.x - 0.1 || x > this.x + 0.1 || y < this.y - 0.1 || y > this.y - 0.1; 
    }

    setAnimation(anim) {
        this.animation = anim;
        this.frameDelay = FRAME_DELAY;
        this.frame = 0;
    }

    walk() {
        this.speed = SPEED;
        this.setAnimation(this.walkA);
    }

    stop() {
        this.speed = 0;
        this.setAnimation(this.idleA);
    }

    hit(amount){
        this.animationBeforeHit = this.animation;
        this.stop();
        this.health -= amount;
        this.setAnimation(this.hurtA);
        if(this.health <= 0){
            this.stop();
        }
    }
}

class Dino extends Enemy {

    constructor(x, y, dirX, dirY, walkA, idleA, hurtA) {
        super(x, y, dirX, dirY, walkA, idleA, hurtA, 9999, 0);
        this.setAnimation(IDLE);
        this.factor = 2;
        this.height = DINO_HEIGHT;
        this.width = DINO_WIDTH;
        this.vMove = 20;
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
        let sourceX = minX / sizeX * this.width | 0;
        let width = (maxX - minX) / sizeX * this.width | 0;
        
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
        ctx.fillStyle = '#fff';
        ctx.fillText(`Dino:   dirX=${this.dirX.toFixed(2)}, dirY=${this.dirY.toFixed(2)}, angle=${this.angle.toFixed(2)}, angleComputed=${angle} health=${this.health}`, 10, 30);

        ctx.drawImage(DINO_SPRITESHEET, sourceX, ((this.animation[this.frame]+dec) * this.height), width, this.height, x, y, maxX - minX, sizeY);
    }

}

class Tree extends Enemy {

    constructor(x, y, dirX, dirY, walkAnim, idleTree, hurtA) {
        super(x, y, dirX, dirY, walkAnim, idleTree, hurtA, TREE_HP,TREE_ATTACK_DAMAGE);
        this.setAnimation(TREE_IDLE);
        this.factor = 0.5;
        this.height = TREE_HEIGHT;
        this.width = TREE_WIDTH;
        this.vMove = 20;
    }

    punch(){
        this.setAnimation(TREE_PUNCH);
    }

    update(dt) {
        super.update(dt);
        this.frameDelay -= dt;
        if (this.frameDelay <= 0) {
            this.frameDelay = FRAME_DELAY;
            this.frame = (this.frame + 1) % this.animation.length;
            if(this.animation == TREE_HURT && this.frame == this.animation.length -1){
                if(this.animationBeforeHit == TREE_WALK){
                    this.walk();
                }else{
                    this.stop();
                }
            }
        }
    }

    render(ctx, minX, maxX, sizeX, sizeY, x, y, angle) {
        if(this.health <= 0){
            return;
        }
        
        let sourceX = minX / sizeX * this.width | 0;
        let width = (maxX - minX) / sizeX * this.width | 0;
        let dec = 3;
        
        if(this.animation != TREE_HURT){
            if (angle >= 45 && angle < 135) {
                dec = 1;
            }
            else if (angle >= 135 && angle < 225) {
                dec = 2;
            }
            else if (angle >= 225 && angle < 315) {
                dec = 0;
            } 
        }else{
            dec = 0;
        }
        
        ctx.fillText(`Tree:   dirX=${this.dirX.toFixed(2)}, dirY=${this.dirY.toFixed(2)}, angle=${this.angle.toFixed(2)}, angleComputed=${angle} health=${this.health}`, 10, 30);
        ctx.drawImage(TREE_SPRITESHEET, sourceX, ((this.animation[this.frame]+dec) * this.height), width, this.height, x, y, maxX - minX, sizeY);
    
    }
}



class Turnip extends Enemy {

    constructor(x, y, dirX, dirY, walkAnim, idleAnim, hurtAnim) {
        super(x, y, dirX, dirY, walkAnim, idleAnim, hurtAnim, TURNIP_HP,TURNIP_ATTACK_DAMAGE);
        this.setAnimation(TURNIP_IDLE);
        this.factor = 0.5;
        this.height = TURNIP_HEIGHT;
        this.width = TURNIP_WIDTH;
        this.vMove = 20;
    }

    bite(){
        this.setAnimation(TURNIP_BITE);
    }

    update(dt) {
        super.update(dt);
        this.frameDelay -= dt;
        if (this.frameDelay <= 0) {
            this.frameDelay = FRAME_DELAY;
            this.frame = (this.frame + 1) % this.animation.length;
            if(this.animation == TURNIP_HURT && this.frame == this.animation.length -1){
                if(this.animationBeforeHit == TURNIP_WALK){
                    this.walk();
                }else{
                    this.stop();
                }
            }
        }
    }

    render(ctx, minX, maxX, sizeX, sizeY, x, y, angle) {
        if(this.health <= 0){
            return;
        }

        let sourceX = minX / sizeX * this.width | 0;
        let width = (maxX - minX) / sizeX * this.width | 0;
        let dec = 3;
        
        if(this.animation != TURNIP_HURT){
            if (angle >= 45 && angle < 135) {
                dec = 2;
            }
            else if (angle >= 135 && angle < 225) {
                dec = 1;
            }
            else if (angle >= 225 && angle < 315) {
                dec = 0;
            }
        }else{
            dec = 0;
        }
        
        ctx.fillText(`Turnip:   dirX=${this.dirX.toFixed(2)}, dirY=${this.dirY.toFixed(2)}, angle=${this.angle.toFixed(2)}, angleComputed=${angle} health=${this.health}`, 10, 30);
        ctx.drawImage(TURNIP_SPRITESHEET, sourceX, ((this.animation[this.frame]+dec) * this.height), width, this.height, x, y, maxX - minX, sizeY);
    
    }
}


class Dandelion extends Enemy {

    constructor(x, y, dirX, dirY, walkAnim, idleAnim, hurtAnim) {
        super(x, y, dirX, dirY, walkAnim, idleAnim, hurtAnim, DANDELION_HP,DANDELION_ATTACK_DAMAGE);
        this.setAnimation(DANDELION_IDLE);
        this.factor = 0.5;
        this.height = DANDELION_HEIGHT;
        this.width = DANDELION_WIDTH;
        this.vMove = 20;
    }

    yeet(){
        this.setAnimation(DANDELION_YEET);
    }

    update(dt) {
        super.update(dt);
        this.frameDelay -= dt;
        if (this.frameDelay <= 0) {
            this.frameDelay = FRAME_DELAY;
            this.frame = (this.frame + 1) % this.animation.length;
            if(this.animation == DANDELION_HURT && this.frame == this.animation.length -1){
                if(this.animationBeforeHit == DANDELION_WALK){
                    this.walk();
                }else{
                    this.stop();
                }
            }
        }
    }

    render(ctx, minX, maxX, sizeX, sizeY, x, y, angle) {
        if(this.health <= 0){
            return;
        }

        let sourceX = minX / sizeX * this.width | 0;
        let width = (maxX - minX) / sizeX * this.width | 0;

        let dec = 0;
        
        if (angle >= 45 && angle < 135) {
            dec = 1;
        }
        else if (angle >= 135 && angle < 225) {
            dec = 0;
        }
        else if (angle >= 225 && angle < 315) {
            dec = 0;
        }
       
        
        ctx.fillText(`Dandelion:   dirX=${this.dirX.toFixed(2)}, dirY=${this.dirY.toFixed(2)}, angle=${this.angle.toFixed(2)}, angleComputed=${angle} health=${this.health}`, 10, 30);
        ctx.drawImage(DANDELION_SPRITESHEET, sourceX, ((this.animation[this.frame]+dec) * this.height), width, this.height, x, y, maxX - minX, sizeY);
    
    }
}
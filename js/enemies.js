
const SPEED = 0.001;
const FRAME_DELAY = 100;

/** ANGRY TREE */

const TREE_WALK = [0,4,8];
const TREE_IDLE = [0];
const TREE_PUNCH = [12,12,13,14,15];
const TREE_HURT = [16,16,16,16,16];
const TREE_DED = [17];
const TREE_BURNT = [18];

const TREE_SPRITESHEET = new Image();
TREE_SPRITESHEET.src = "../data/tree-spritesheet.png";
const TREE_HEIGHT = 15200/19 | 0;
const TREE_WIDTH = 800;

const TREE_ATTACK_DAMAGE = 20;
const TREE_HP = 100;
const TREE_ATTACK_DELAY = 500;
const TREE_POINTS_DROP = 50;
const TREE_RANGE = 1;

/** DEADLY TURNIP */
const TURNIP_WALK = [0,4,8];
const TURNIP_IDLE = [0];
const TURNIP_BITE = [12,12,13,13];
const TURNIP_HURT = [14,14,14,14,14];
const TURNIP_DED = [15];
const TURNIP_BURNT = [16];

const TURNIP_SPRITESHEET = new Image();
TURNIP_SPRITESHEET.src = "../data/turnip-spritesheet.png";
const TURNIP_HEIGHT = 7106/17 | 0;
const TURNIP_WIDTH = 419;


const TURNIP_ATTACK_DAMAGE = 20;
const TURNIP_HP = 100;
const TURNIP_ATTACK_DELAY = 500;
const TURNIP_POINTS_DROP = 100;
const TURNIP_RANGE = 1;


/** DANDELION LA MENACE  */
const DANDELION_WALK = [0,2,4,6];
const DANDELION_IDLE = [0];
const DANDELION_YEET = [8,9,10,11];
const DANDELION_DED = [12];
const DANDELION_BURNT = [13];

const DANDELION_SPRITESHEET = new Image();
DANDELION_SPRITESHEET.src = "../data/dandelion-spritesheet.png";
const DANDELION_HEIGHT = 7000/14 | 0;
const DANDELION_WIDTH = 500;

const DANDELION_ATTACK_DAMAGE = 20;
const DANDELION_HP = 100;
const DANDELION_ATTACK_DELAY = 500;
const DANDELION_POINTS_DROP = 200;
const DANDELION_RANGE = 1;

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
        case "tree":
            return new Tree(x,y,dx,dy,TREE_POINTS_DROP);
        case "turnip":
            return new Turnip(x,y,dx,dy,TURNIP_POINTS_DROP);
        case "dandelion":
            return new Dandelion(x,y,dx,dy, DANDELION_POINTS_DROP);
        // ... TODO ... make more enemies
    }
}


/**
 * Classes describing enemies.
 */

class Enemy {
    constructor(x, y, dirX, dirY, walkAnim, idleAnim, hurtAnim, attakAnim, dieAnim, burnAnim, hp, attackDamage, range) {
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
        this.dieA = dieAnim;
        this.burnA = burnAnim;
        this.attackA = attakAnim;
        this.health = hp;

        this.attackDamage = attackDamage;
        this.range = range;
    }

    /** Common behavior */
    update(dt, player) { 
        this.x += this.dirX * dt * this.speed;
        this.y += this.dirY * dt * this.speed;
        this.behavior(dt);

        this.frameDelay -= dt;
        if (this.frameDelay <= 0) {
            this.frameDelay = FRAME_DELAY;
            this.frame = (this.frame + 1) % this.animation.length;
            if(this.animation != this.dieA && (this.animation == this.attackA || this.animation == this.hurtA) && this.frame == this.animation.length -1){
                if(this.animationBeforeHit == this.walkA){
                    this.walk();
                }else{
                    this.stop();
                }
            }
        }

        player.invisibilityFrame -= dt;

        if(this.distance < this.range && player.invisibilityFrame <=0){
            this.attack();
            player.hit(this.attackDamage)
            player.setInvinsibilityFrame();
        }
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

    attack(){
        if(this.health <= 0){
            return;
        }
        if(this.animationBeforeHit == undefined){
            this.animationBeforeHit = this.animation;
        }
        
        this.setAnimation(this.attackA);
    }

    stop() {
        this.speed = 0;
        this.setAnimation(this.idleA);
    }

    hit(amount){
        if(this.health <= 0){
            return;
        }
        if(this.animationBeforeHit == undefined){
            this.animationBeforeHit = this.animation;
        }
        this.stop();
        this.health -= amount;
        if(this.health <= 0){
            this.die();
        }else{
            this.setAnimation(this.hurtA);
        }
    }

    die(){
        this.setAnimation(this.dieA);
    }

    burn(){
        this.setAnimation(this.burnA);
    }
}

class Tree extends Enemy {

    constructor(x, y, dirX, dirY, dropPoints) {
        super(x, y, dirX, dirY, TREE_WALK,TREE_IDLE,TREE_HURT, TREE_PUNCH, TREE_DED, TREE_BURNT, TREE_HP, TREE_ATTACK_DAMAGE, TREE_RANGE);
        this.setAnimation(TREE_IDLE);
        this.factor = 0.5;
        this.height = TREE_HEIGHT;
        this.width = TREE_WIDTH;
        this.vMove = 20;
        this.dropPoints = dropPoints;
    }

    update(dt,player) {
        super.update(dt,player);
    }

    render(ctx, minX, maxX, sizeX, sizeY, x, y, angle) {
        /*if(this.health <= 0){
            return;
        }*/
        
        let sourceX = minX / sizeX * this.width | 0;
        let width = (maxX - minX) / sizeX * this.width | 0;

        let dec = 0;
        
        
        if(this.animation != TREE_HURT && this.animation != TREE_PUNCH && this.animation != TREE_DED && this.animation != TREE_BURNT){

            dec = 3;
            
            if (angle >= 45 && angle < 135) {
                dec = 1;
            }
            else if (angle >= 135 && angle < 225) {
                dec = 2;
            }
            else if (angle >= 225 && angle < 315) {
                dec = 0;
            } 
        }
        
        ctx.fillText(`Tree:   dirX=${this.dirX.toFixed(2)}, dirY=${this.dirY.toFixed(2)}, angle=${this.angle.toFixed(2)}, angleComputed=${angle} health=${this.health}`, 10, 30);
        ctx.drawImage(TREE_SPRITESHEET, sourceX, ((this.animation[this.frame]+dec) * this.height), width, this.height, x, y, maxX - minX, sizeY);
    
    }
}



class Turnip extends Enemy {

    constructor(x, y, dirX, dirY, dropPoints) {
        super(x, y, dirX, dirY,TURNIP_WALK,TURNIP_IDLE,TURNIP_HURT, TURNIP_BITE, TURNIP_DED, TURNIP_BURNT, TURNIP_HP,TURNIP_ATTACK_DAMAGE, TURNIP_RANGE);
        this.setAnimation(TURNIP_IDLE);
        this.factor = 0.5;
        this.height = TURNIP_HEIGHT;
        this.width = TURNIP_WIDTH;
        this.vMove = 20;
        this.dropPoints = dropPoints;
    }

    update(dt, player) {
        super.update(dt, player);
    }

    render(ctx, minX, maxX, sizeX, sizeY, x, y, angle) {
        let sourceX = minX / sizeX * this.width | 0;
        let width = (maxX - minX) / sizeX * this.width | 0;
        let dec = 0;
        
        if(this.animation != TURNIP_HURT && this.animation != TURNIP_BITE && this.animation != TURNIP_DED && this.animation != TURNIP_BURNT){
            dec = 3;
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

    constructor(x, y, dirX, dirY, dropPoints) {
        super(x, y, dirX, dirY, DANDELION_WALK, DANDELION_IDLE, DANDELION_IDLE, DANDELION_YEET, DANDELION_DED, DANDELION_BURNT, DANDELION_HP,DANDELION_ATTACK_DAMAGE,DANDELION_RANGE);
        this.setAnimation(DANDELION_IDLE);
        this.factor = 0.5;
        this.height = DANDELION_HEIGHT;
        this.width = DANDELION_WIDTH;
        this.vMove = 20;
        this.dropPoints = dropPoints;
    }

    update(dt, player) {
        super.update(dt, player);
    }

    render(ctx, minX, maxX, sizeX, sizeY, x, y, angle) {
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
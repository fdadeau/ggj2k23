
import { data } from "./preload.js";

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
        case "tree":
            return new Tree(x,y,dx,dy,TREE_POINTS_DROP);
        case "turnip":
            return new Turnip(x,y,dx,dy,TURNIP_POINTS_DROP);
        case "dandelion":
            return new Dandelion(x,y,dx,dy, DANDELION_POINTS_DROP);
        case "rabbit":
            return new Rabbit(x,y,dx,dy,0);
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
    update(dt, player, map) { 
        let newX = this.x + this.dirX * dt * this.speed;
        if (player.isOnEmptyTile(map, newX, this.y)) {
            this.x = newX;
        }
        else {
            this.dirX = 0;
            this.dirY = this.dirY > 0 ? 1 : -1;
        }
        let newY = this.y + this.dirY * dt * this.speed;
        if (player.isOnEmptyTile(map, this.x, newY)) {
            this.y = newY;
        }

        this.behavior(dt, player,map);

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

        player.lighter.shots.forEach(function(s) {
            let dX = s.x - this.x;
            let dY = s.y - this.y;
            if (dX*dX+dY*dY < 0.4) {
                this.hit(5);
                if (this.health <= 0) {
                    this.burn();
                }
            }
        }.bind(this));

        
        if(this.distance < this.range){
            if(player.invisibilityFrame <=0 && this.health > 0){
                this.attack();
                player.hit(this.attackDamage)
                player.setInvinsibilityFrame();
            }
        }
    }

    /** Initially empty, allows to have customized behaviors for a given entity */
    behavior(player, map) { }

    /** Checks if it collides with en entity at coordinates (x,y) */
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



/** ANGRY TREE */
const TREE_WALK = [0,4,8];
const TREE_IDLE = [0];
const TREE_PUNCH = [12,12,13,14,15];
const TREE_HURT = [16,16,16,16,16];
const TREE_DED = [17];
const TREE_BURNT = [18];

const TREE_HEIGHT = 15200/19 | 0;
const TREE_WIDTH = 800;

const TREE_ATTACK_DAMAGE = 15;
const TREE_HP = 120;
const TREE_ATTACK_DELAY = 500;
const TREE_POINTS_DROP = 50;
const TREE_RANGE = 1.1;

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

    update(dt,player,map) {
        super.update(dt,player,map);
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
        
        //ctx.fillText(`Tree:   dirX=${this.dirX.toFixed(2)}, dirY=${this.dirY.toFixed(2)}, angle=${this.angle.toFixed(2)}, angleComputed=${angle} health=${this.health}`, 10, 30);
        ctx.drawImage(data["tree-spritesheet"], sourceX, ((this.animation[this.frame]+dec) * this.height), width, this.height, x, y, maxX - minX, sizeY);
    
    }
}


/** DEADLY TURNIP */
const TURNIP_WALK = [0,4,8];
const TURNIP_IDLE = [0];
const TURNIP_BITE = [12,12,13,13];
const TURNIP_HURT = [14,14,14,14,14];
const TURNIP_DED = [15];
const TURNIP_BURNT = [16];

const TURNIP_HEIGHT = 7106/17 | 0;
const TURNIP_WIDTH = 419;

const TURNIP_ATTACK_DAMAGE = 25;
const TURNIP_HP = 50;
const TURNIP_ATTACK_DELAY = 500;
const TURNIP_POINTS_DROP = 100;
const TURNIP_RANGE = 0.9;


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

    update(dt, player,map) {
        super.update(dt, player,map);
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
        
        //ctx.fillText(`Turnip:   dirX=${this.dirX.toFixed(2)}, dirY=${this.dirY.toFixed(2)}, angle=${this.angle.toFixed(2)}, angleComputed=${angle} health=${this.health}`, 10, 30);
        ctx.drawImage(data["turnip-spritesheet"], sourceX, ((this.animation[this.frame]+dec) * this.height), width, this.height, x, y, maxX - minX, sizeY);
    
    }
}


/** DANDELION LA MENACE  */
const DANDELION_WALK = [0,2,4,6];
const DANDELION_IDLE = [0];
const DANDELION_YEET = [8,9,10,11];
const DANDELION_DED = [12];
const DANDELION_BURNT = [13];

const DANDELION_HEIGHT = 7000/14 | 0;
const DANDELION_WIDTH = 500;

const DANDELION_ATTACK_DAMAGE = 5;
const DANDELION_HP = 1.15;
const DANDELION_ATTACK_DELAY = 500;
const DANDELION_POINTS_DROP = 200;
const DANDELION_RANGE = 1;

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

    update(dt, player,map) {
        super.update(dt, player,map);
    }

    render(ctx, minX, maxX, sizeX, sizeY, x, y, angle) {
        let sourceX = minX / sizeX * this.width | 0;
        let width = (maxX - minX) / sizeX * this.width | 0;

        let dec = 0;
        
        if (angle >= 45 && angle < 135) {
            dec = 0;
        }
        else if (angle >= 135 && angle < 225) {
            dec = 0;
        }
        else if (angle >= 225 && angle < 315) {
            dec = 0;
        }
         
        //ctx.fillText(`Dandelion:   dirX=${this.dirX.toFixed(2)}, dirY=${this.dirY.toFixed(2)}, angle=${this.angle.toFixed(2)}, angleComputed=${angle} health=${this.health}`, 10, 30);
        ctx.drawImage(data["dandelion-spritesheet"], sourceX, ((this.animation[this.frame]+dec) * this.height), width, this.height, x, y, maxX - minX, sizeY);
    
    }
}


/** MAD RABBIT */

const ANIM_KILLER = [0];
const ANIM_NIBBLER = [3];
const ANIM_WAITING = [2];

const RABBIT_HEIGHT = 500;
const RABBIT_WIDTH = 500;

const JUMP_SPEED = 0.015;

class Rabbit extends Enemy {

    constructor(x, y, dirX, dirY, dropPoints) {
        super(x, y, dirX, dirY, ANIM_KILLER, ANIM_WAITING, ANIM_KILLER, ANIM_KILLER, ANIM_KILLER, ANIM_KILLER, 200, 20, 0.2);
        this.setAnimation(ANIM_WAITING);
        this.factor = 0.5;
        this.height = RABBIT_HEIGHT;
        this.width = RABBIT_WIDTH;
        this.vMove = 60;
        this.dropPoints = dropPoints;
        this.range = 0.2;

        this.initVMove = 60;
        this.decZ = 0;
    }

    update(dt, player,map) {
        super.update(dt, player,map);

        if (this.nibble) {
            return;
        }
        let dX = player.posX - this.x;
        let dY = player.posY - this.y;
        let norm = Math.sqrt(dX*dX+dY*dY);
                
        if (this.killer) {
            // todo detect wall collision
            this.dirX = dX / norm;
            this.dirY = dY / norm;
            this.speed = 0.002;
            this.decZ += dt * JUMP_SPEED;
            this.vMove = this.initVMove+3*Math.sin(this.decZ) * 6;    
            //this.setAnimation(ANIM_KILLER);
            return;
        }
    
        if (norm < 2 && player.haveCarrot) {
            this.nibble = true;
            this.setAnimation(ANIM_NIBBLER);
            return;
        }
        
        if (norm < 2 && !player.haveCarrot) {
            this.killer = true;
            this.setAnimation(ANIM_KILLER);
            return;
        }
        
    }

    hit() {
        this.killer = true;     // becomes mad and runs after the player
    }

    render(ctx, minX, maxX, sizeX, sizeY, x, y, angle) {
        let sourceX = minX / sizeX * this.width | 0;
        let width = (maxX - minX) / sizeX * this.width | 0;

        let dec = 0;
               
        //ctx.fillText(`Rbbit:   dirX=${this.dirX.toFixed(2)}, dirY=${this.dirY.toFixed(2)}, angle=${this.angle.toFixed(2)}, angleComputed=${angle} health=${this.health}`, 10, 30);
        ctx.drawImage(data["rabbit-spritesheet"], sourceX, ((this.animation[this.frame]+dec) * this.height), width, this.height, x, y, maxX - minX, sizeY);
        
    }

}
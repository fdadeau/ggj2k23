import { buildWeapon, Lighter } from "./weapons.js";

import { Hud } from "./hud.js";

import { audio } from "./audio.js";


const FRAME_DELAY = 100;

const NATURAL_SOBRIETY_DECREASE = 0.1;


/***
 * Class describing the main character of the game.
 */

const PLAYER_MOVEMENT_SPEED = 0.003;

const PLAYER_ROTATION_SPEED = 0.002;

const PLAYER_OFFSET_SPEED = 0.05;

const MAX_PITCH = 200;

const INVISIVILTY_FRAME = 750;

const PLAYER_HP = 100;

export default class Player {

    constructor() {
        /** Coordinates */
        this.posX = 0;
        this.posY = 0;
        this.posZ = 0.5;

        /** Direction vector (where the character looks at) */
        this.dirX = 0;
        this.dirY = 0;

        /** Additional altitude (used to simulate breathing) */
        this.altitude = 0.5;
        this.offset = 0;

        /** Speed when walking/running */
        this.speed = 0;

        /** Breathing speed */
        this.offSpeed = PLAYER_OFFSET_SPEED;

        /** Movement: set to a value > 0 to strafe */
        this.translSpeed = 0;

        /** Used when the character raises/lowers his head */
        this.pitch = 0;

        /** projection plane (screen) distance */
        this.plane = { x: 0, y: 0.66 };

        /** Score of the player */
        this.score = 0;

        /** player's health */
        this.health = PLAYER_HP;

        /** player's sobriety */
        this.sobriety = 0;

        /** weapon management */
        this.weapons = [
            buildWeapon("whisky"),
            buildWeapon("tequila"),
            buildWeapon("axe"),
        ];

        this.currentWeapon = this.weapons[2];
        this.lighter = new Lighter(this);
        this.setAnimation(this.currentWeapon.idle);
        this.frameDelay = FRAME_DELAY;

        /** Tells if the player can attack or not */
        this.isAttacking = false;

        /** Consumable */
        this.nbWhisky = 3;
        this.nbTequila = 3;

        /** Tells if the player is drunk or not */
        this.isDrunk = false;

        this.hud = new Hud(75);

        /** Invisibilty frame */
        this.invisibilityFrame = INVISIVILTY_FRAME;

        /** Time when the player is drunk */
        this.drunkTime = 10000;

        /** Tells if the player have found the carrot */
        this.haveCarrot = false;
        /** Tells if the player finished the level */
        this.arrived = false;
    }
    
    setInvinsibilityFrame(){
        this.invisibilityFrame = INVISIVILTY_FRAME;
    }



    initialize(posX, posY, dirX, dirY) {
        this.posX = posX;
        this.posY = posY;
        this.dirX = dirX;
        this.dirY = dirY;
        if (dirX > 0) {
            this.plane.y *= -1;
        } else if (dirY > 0) {
            this.plane.x = 0.66;
            this.plane.y = 0;
        } else if (dirY < 0) {
            this.plane.x = -0.66;
            this.plane.y = 0;
        }

        /** initialize angles */
        this.rotate(0);

    }

    getInfos() {
      //  return `x-0.25=${this.posX-0.25}, y+0.25=${this.posY+0.25}`;
        return `Player: posX=${this.posX.toFixed(2)}, posY=${this.posY.toFixed(2)}, dirX=${this.dirX.toFixed(2)}, dirY=${this.dirY.toFixed(2)}, angle=${this.angle.toFixed(2)}`;
    }

    /**
     * Perform player/plane screen rotation
     * @param {Number} a angle to rotate 
     */
    rotate(a) {
        const oldX = this.dirX,
            oldY = this.dirY;
        this.dirX = Math.cos(a) * oldX - Math.sin(a) * oldY;
        this.dirY = Math.sin(a) * oldX + Math.cos(a) * oldY;
        const oldPX = this.plane.x,
            oldPY = this.plane.y;
        this.plane.x = Math.cos(a) * oldPX - Math.sin(a) * oldPY;
        this.plane.y = Math.sin(a) * oldPX + Math.cos(a) * oldPY;

        this.angle = Math.acos(this.dirX / Math.sqrt(this.dirX * this.dirX + this.dirY * this.dirY)) * 180 / Math.PI;
        if (this.dirY < 0) {
            this.angle *= -1;
        }
        if (this.angle < 0) {
            this.angle += 360;
        }
    }


    update(dt, map, enemies) {
        // rotation [dirX dirY] * M et [ planeX, planeY ]
        // [ cos(a) -sin(a) ]
        // [ sin(a)  cos(a) ]

        this.offset = (this.offset + this.offSpeed) % (2 * Math.PI);
        this.altitude = this.posZ + 0.01 * Math.cos(this.offset);
        let isMovingX = this.speed != 0;
        let isMovingY = this.translSpeed != 0;

        // move forward/backward
        if (this.speed != 0) {
            let newX = this.posX + this.dirX * dt * this.speed;
            let newY = this.posY + this.dirY * dt * this.speed;

            if (this.isStillOnMap(map, newX, this.posY) && !enemies.some(e => e.collides(newX, this.posY))) {
                this.posX = newX;
            }
            
            if (this.isStillOnMap(map, this.posX, newY) && !enemies.some(e => e.collides(newX, this.posY))) {
                this.posY = newY;
            }

            let dist = Math.sqrt(Math.pow(this.posX-newX,2) + Math.pow(this.posY-newY,2));

            if((dist > 0.015 && this.speed == PLAYER_MOVEMENT_SPEED) || (dist > 0.01 && this.speed == -PLAYER_MOVEMENT_SPEED/2)){
                isMovingX = false;
            }
        }

        // strafe left/right
        if (this.translSpeed != 0) {
            // compute orthogonal vector to current direction
            let vecX = 0,
                vecY = 0;
            if (this.dirY == 0) {
                vecX = 0
                vecY = -1;
            } else if (this.dirY > 0) {
                vecX = 1;
                vecY = -this.dirX / this.dirY;
            } else {
                vecX = -1;
                vecY = this.dirX / this.dirY;
            }

            let norm = Math.sqrt((vecX * vecX) + (vecY * vecY));
            vecX = vecX / norm;
            vecY = vecY / norm;

            let newX = this.posX + vecX * dt * this.translSpeed;
            if (this.isStillOnMap(map, newX, this.posY) && !enemies.some(e => e.collides(newX, this.posY))) {
                this.posX = newX;
            }
            let newY = this.posY + vecY * dt * this.translSpeed;
            if (this.isStillOnMap(map, this.posX, newY) && !enemies.some(e => e.collides(this.posX, newY))) {
                this.posY = newY;
            }

            let dist = Math.sqrt(Math.pow(this.posX-newX,2) + Math.pow(this.posY-newY,2));

            if(dist > 0.01){
            
               isMovingY = false;
            }
        }

        if(!isMovingX && !isMovingY){
            if(audio.audioIsPlaying(10)){
                audio.pause(10);
            }
        }else{
            if(!audio.audioIsPlaying(10)){
                audio.playSound('walkSound',10,1,true);
            }
        }

        this.frameDelay -= dt;
        if (this.frameDelay <= 0) {
            this.frameDelay = FRAME_DELAY;
            this.sobriety -= NATURAL_SOBRIETY_DECREASE;
            if(this.sobriety < 0){
                this.sobriety = 0;
            }
            this.frame = (this.frame + 1) % this.animation.length;
            if(this.frame == 0 && this.isAttacking){
                this.isAttacking = false;
                this.setAnimation(this.currentWeapon.idle);
                this.currentWeapon.afterAnimation(this);
            }
        }

        this.currentWeapon.update(dt,this,enemies);

        this.hud.update(dt);

        this.lighter.update(dt);

        this.invisibilityFrame -= dt;

        this.collectPowerUp(enemies);

        // Drunk time
        if (this.isDrunk) {
            this.drunkTime -= dt;
            if (this.drunkTime <= 0) {
                this.isDrunk = false;
                this.drunkTime = 10000;
            }
        }
    }

    isStillOnMap(map, x, y) {
        return this.isOnEmptyTile(map, x, y) &&
        this.isOnEmptyTile(map, x-0.2, y-0.2) &&
        this.isOnEmptyTile(map, x-0.2, y+0.2) &&
        this.isOnEmptyTile(map, x+0.2, y-0.2) &&
        this.isOnEmptyTile(map, x+0.2, y+0.2);
    }
    isOnEmptyTile(map, x, y) {
        let tileX = x | 0, tileY = y | 0;
        let inTileX = x - tileX, inTileY = y - tileY;
        if (map[tileX][tileY] == 1) { return false; }
        if (map[tileX][tileY] == 2 && inTileX <= inTileY) { return false; }
        if (map[tileX][tileY] == 3 && inTileX >= 1-inTileY) { return false; }
        if (map[tileX][tileY] == 4 && inTileX >= inTileY) { return false; }
        if (map[tileX][tileY] == 5 && inTileX <= 1-inTileY) { return false; }
        return true;
    }

    moveHead(dx, dy) {
        this.rotate(dx * -3 * PLAYER_ROTATION_SPEED);
        this.pitch += dy * 2;
        if (this.pitch > MAX_PITCH) {
            this.pitch = MAX_PITCH;
        } else if (this.pitch < -MAX_PITCH) {
            this.pitch = -MAX_PITCH;
        }

    }

    stop1() {
        if(this.translSpeed == 0){
            audio.pause(10);
        }
        this.speed = 0;
        this.offSpeed = PLAYER_OFFSET_SPEED;
    }

    stop2() {
        if(this.speed == 0){
            audio.pause(10);
        }
        this.translSpeed = 0;
        this.offSpeed = PLAYER_OFFSET_SPEED;
    }

    walk(dir) {
        if(!audio.audioIsPlaying(10)){
            audio.playSound('walkSound',10,1,true);
        }
        this.speed = PLAYER_MOVEMENT_SPEED * dir;
        this.offSpeed = PLAYER_OFFSET_SPEED * 2;
    }

    strafe(dir) {
        if(!audio.audioIsPlaying(10)){
            audio.playSound('walkSound',10,1,true);
        }
        this.translSpeed = PLAYER_ROTATION_SPEED * dir;
    }
    
    equipeAxe(){
        if (this.isAttacking) {
            return -1;
        }
        this.currentWeapon = this.weapons[2];
        this.setAnimation(this.currentWeapon.idle);
        this.hud.equipeAxe();
    }

    equipeWhisky(){
        if (this.isAttacking) {
            return -1;
        }
        this.currentWeapon = this.weapons[0];
        this.setAnimation(this.currentWeapon.idle);
        this.hud.equipeWhisky();
    }

    equipeTequila(){
        if (this.isAttacking) {
            return -1;
        }
        this.currentWeapon = this.weapons[1];
        this.setAnimation(this.currentWeapon.idle);
        this.hud.equipeTequila();
    }

    switchToNextWeapon(next){
        if(this.isAttacking) {
            return -1;
        }
        let id = this.weapons.lastIndexOf(this.currentWeapon);
        let newWeapon = (id+next)%this.weapons.length;

        if(next < 0){
            if(newWeapon == 1 && this.nbTequila <= 0){
                newWeapon = (newWeapon+next)%this.weapons.length;
            }
            if(newWeapon == 0 && this.nbWhisky <= 0){
                newWeapon = (newWeapon+next)%this.weapons.length;
            }
        }else{
            if(newWeapon == 0 && this.nbWhisky <= 0){
                newWeapon = (newWeapon+next)%this.weapons.length;
            }
            if(newWeapon == 1 && this.nbTequila <= 0){
                newWeapon = (newWeapon+next)%this.weapons.length;
            }
        }
        if(newWeapon < 0){
            newWeapon = 2;
        }
        
        this.currentWeapon = this.weapons[newWeapon];
        this.setAnimation(this.currentWeapon.idle);
        this.hud.changeWeapon(newWeapon);
    }

    setAnimation(anim) {
        this.animation = anim;
        this.frameDelay = FRAME_DELAY;
        this.frame = 0;
    }

    render(ctx){
        this.lighter.render(ctx);
        this.currentWeapon.render(ctx,((this.animation[this.frame])));
        this.hud.render(ctx, this);
    }

    attack() {
        if (this.isAttacking) {
            return;
        }
        this.isAttacking = true;
        this.setAnimation(this.currentWeapon.use);
        this.currentWeapon.setDelay();
    }

    hit(damage){
        if(this.health <= 0){
            return;
        }
        this.health -= damage;
        if (this.health < 0) {
            this.health = 0;
        }
        this.hud.hitAnimation();
        audio.playSound('hitPlayerSound',7,0.5,false);
    }

    collectPowerUp(powerup) {
        powerup.forEach(function(e) {
            if(e.distance <= 1 && ! e.taken){
                switch(e.constructor.name) {
                    case 'WhiskyItem' :
                        this.nbWhisky++;
                        e.taken = true;
                        this.score += e.points;
                        break;
                    case 'TequilaItem' :
                        this.nbTequila++;
                        e.taken = true;
                        this.score += e.points;
                        break;
                    case 'Carrot' :
                        this.haveCarrot = true;
                        e.taken = true;
                        break;
                   
                    case 'Rope' :
                        this.arrived = true;
                        break;
                }
            }
        },this);
    }
}


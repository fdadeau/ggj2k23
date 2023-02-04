import { buildWeapon } from "./weapons.js";

const AXE_SPRITESHEET = new Image();
AXE_SPRITESHEET.src = "../data/axe-spritesheet.png";
const AXE_HEIGHT = 5000/5 | 0;
const AXE_WIDTH = 1000;
const AXE_ATTACK = [0,1,2,3,4];
const AXE_IDLE = [0];



const WHISKY_SPRITESHEET = new Image();
WHISKY_SPRITESHEET.src = "../data/whisky-spritesheet.png";
const WHISKY_HEIGHT = 4200/6 | 0;
const WHISKY_WIDTH = 1000;
const WHISKY_DRINK = [0,1,2,2,2,3,3,3,4,5];
const WHISKY_IDLE = [0];
const WHISKY_EMPTY = [5];

const FRAME_DELAY = 100;


/***
 * Class describing the main character of the game.
 */

const PLAYER_MOVEMENT_SPEED = 0.003;

const PLAYER_ROTATION_SPEED = 0.002;

const PLAYER_OFFSET_SPEED = 0.05;

const MAX_PITCH = 2000;


export default class Player {

    constructor() {
        /** Coordinates */
        this.posX = 0;
        this.posY = 0;

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
        this.strafeSpeed = 0;

        /** Used when the character raises/lowers his head */
        this.pitch = 0;

        /** projection plane (screen) distance */
        this.plane = { x: 0, y: 0.66 };

        /** player's health */
        this.health = 100;

        /** player's sobriety */
        this.sobriety = 0;

        /** weapon management */
        this.weapons = [
            buildWeapon("whisky"),
            buildWeapon("axe"),

        ];
        this.currentWeapon = this.weapons[1];
        this.lighter = buildWeapon('lighter');
        this.setAnimation(AXE_IDLE);
        this.frameDelay = FRAME_DELAY;

        /** Tells if the player can attack or not */
        this.isAttacking = false;

        /** Consumable */
        this.nbWhisky = 2;

        /** lighting */
        this.lighting = 20;
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
        return `Player: dirX=${this.dirX.toFixed(2)}, dirY=${this.dirY.toFixed(2)}, angle=${this.angle.toFixed(2)}`;
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
        this.altitude = 0.5 + 0.01 * Math.cos(this.offset);

        // move forward/backward
        if (this.speed != 0) {
            let newX = this.posX + this.dirX * dt * this.speed;
            if (this.isStillOnMap(map, newX, this.posY) && !enemies.some(e => e.collides(newX, this.posY))) {
                this.posX = newX;
            }
            let newY = this.posY + this.dirY * dt * this.speed;
            if (this.isStillOnMap(map, this.posX, newY) && !enemies.some(e => e.collides(newX, this.posY))) {
                this.posY = newY;
            }
        }
        // strafe left/right
        if (this.translSpeed != 0) {
            // compute orthogonal vector to current direction
            let vecX = 0,
                vecY = 0;
            if (this.dirY == 0) {
                vecX = 0
                vecY = 1;
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
        } 

        this.frameDelay -= dt;
        if (this.frameDelay <= 0) {
            this.frameDelay = FRAME_DELAY;
            this.frame = (this.frame + 1) % this.animation.length;
            if(this.frame == 0){
                this.isAttacking = false;
                switch(this.currentWeapon.constructor.name){
                    case 'Axe':
                        this.setAnimation(AXE_IDLE);
                        break;
                    case 'Whisky':
                        if(this.nbWhisky == 0){
                            this.setAnimation(WHISKY_EMPTY);
                        }else{
                            this.setAnimation(WHISKY_IDLE);
                        }
                        break;
                }
            }
        }
    }

    isStillOnMap(map, x, y) {
        return map[x | 0][y | 0] === 0 &&
            map[x - 0.25 | 0][y | 0] === 0 &&
            map[x + 0.25 | 0][y | 0] === 0 &&
            map[x | 0][y - 0.25 | 0] === 0 &&
            map[x | 0][y + 0.25 | 0] === 0;
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
        this.speed = 0;
        this.offSpeed = PLAYER_OFFSET_SPEED;
    }

    stop2() {
        this.translSpeed = 0;
        this.offSpeed = PLAYER_OFFSET_SPEED;
    }

    walk(dir) {
        this.speed = PLAYER_MOVEMENT_SPEED * dir;
        this.offSpeed = PLAYER_OFFSET_SPEED * 2;

    }

    strafe(dir) {
        this.translSpeed = PLAYER_ROTATION_SPEED * dir;
    }

    hit(amout) {
        this.health -= amout;
    }

    regen(amout) {
        this.health += amout;
    }

    drink(amout) {
        this.sobriety += amout;
    }

    spit(amout) {
        this.sobriety -= amout;
    }

    equipeAxe(){
        if (this.isAttacking) {
            return -1;
        }
        this.setAnimation(AXE_IDLE);
        this.currentWeapon = this.weapons[1];
    }

    equipeWhisky(){
        if (this.isAttacking) {
            return -1;
        }
        this.setAnimation(WHISKY_IDLE);
        this.currentWeapon = this.weapons[0];
    }

    switchToNextWeapon(){
        if (this.isAttacking) {
            return -1;
        }
        let id = this.weapons.lastIndexOf(this.currentWeapon);
        let newWeapon = (id+1)%this.weapons.length;
        this.currentWeapon = this.weapons[newWeapon];
        // TODO animation
        return newWeapon;
    }

    setAnimation(anim) {
        this.animation = anim;
        this.frameDelay = FRAME_DELAY;
        this.frame = 0;
    }

    render(ctx){
        switch(this.currentWeapon.constructor.name){
            case 'Axe':
                this.currentWeapon.render(ctx,((this.animation[this.frame]) * AXE_HEIGHT));
                break;
            case 'Whisky':
                this.currentWeapon.render(ctx,((this.animation[this.frame]) * WHISKY_HEIGHT));
                break;
        }
    }

    attack(enemies) {
        if (this.isAttacking) {
            return;
        }
        this.isAttacking = true;
        switch(this.currentWeapon.constructor.name){
            case 'Axe':
                this.setAnimation(AXE_ATTACK);
                enemies.forEach(function(e) {
                    if(e.distance <= this.currentWeapon.range){{
                        e.hit(this.currentWeapon.damage);
                    }}
                },this);
                break;
            case 'Whisky':
                if(this.nbWhisky == 0){
                    return;
                }
                this.setAnimation(WHISKY_DRINK);
                this.sobriety +=10;
                this.nbWhisky--;
                break;
        }
    }

}
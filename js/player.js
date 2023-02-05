import { buildWeapon, Lighter } from "./weapons.js";

import { Hud } from "./hud.js";


const FRAME_DELAY = 100;


/***
 * Class describing the main character of the game.
 */

const PLAYER_MOVEMENT_SPEED = 0.003;

const PLAYER_ROTATION_SPEED = 0.002;

const PLAYER_OFFSET_SPEED = 0.05;

const MAX_PITCH = 2000;

const INVISIVILTY_FRAME = 2000;

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

        /** Score of the player */
        this.score = 0;

        /** player's health */
        this.health = 100;

        /** player's sobriety */
        this.sobriety = 0;

        /** weapon management */
        this.weapons = [
            buildWeapon("whisky"),
            buildWeapon("tequila"),
            buildWeapon("axe"),
        ];

        // Whisky
        this.weapons[0].behavior = function(player) {
            if(player.nbWhisky == 0){
                return;
            }

            player.sobriety += 10;
            player.nbWhisky--;
            player.equipeAxe();
        }.bind(this.weapons[0]);

        this.weapons[0].afterAnimation = function(player) {
            if(player.nbWhisky == 0){
                player.equipeAxe();
            }
        }.bind(this.weapons[0]);

        // Tequila
        this.weapons[1].behavior = function(player) {
            if(player.nbTequila == 0){
                return;
            }
            player.isDrunk = true;
            player.sobriety += 10;
            player.nbTequila--;
        }.bind(this.weapons[1]);

        this.weapons[1].afterAnimation = function(player) {
            if(player.nbTequila == 0){
                player.equipeAxe();
            }
        }.bind(this.weapons[0]);

        // Axe
        this.weapons[2].behavior = function(player, enemies) {
            enemies.forEach(function(e) {
                if(e.distance <= player.currentWeapon.range){
                    let u = {
                        x:player.posX-e.x,
                        y:player.posY-e.y
                    };

                    let v = {
                        x:player.dirX,
                        y:player.dirY
                    };

                    let x = u.x*v.x + u.y*v.y
                    
                    if(x < 0 && e.health > 0){
                        e.hit(player.currentWeapon.damage);
                        player.score += e.dropPoints ?? 0;
                        //angle = Math.acos(-x/(1));
                    }
                }
            },this);
        }.bind(this.weapons[2]);

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
        /** Tells if the rabbit have received the carrot */
        this.giveCarrot = false;
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
            if(this.frame == 0 && this.isAttacking){
                this.isAttacking = false;
                this.setAnimation(this.currentWeapon.idle);
                this.currentWeapon.afterAnimation(this);
            }
        }

        this.currentWeapon.update(dt,this,enemies);

        this.hud.update(dt);

        this.lighter.update(dt);

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
        this.isOnEmptyTile(map, x-0.25, y-0.25) &&
        this.isOnEmptyTile(map, x-0.25, y+0.25) &&
        this.isOnEmptyTile(map, x+0.25, y-0.25) &&
        this.isOnEmptyTile(map, x+0.25, y+0.25);
    }
    isOnEmptyTile(map, x, y) {
        let tileX = x | 0, tileY = y | 0;
        let inTileX = x - tileX, inTileY = y - inTileX;
        //if (inTileX < 0) { inTileX *= -1; }
        //if (inTileY < 0) { inTileY *= -1; }
        if (map[tileX][tileY] == 1) { return false; }
        if (map[tileX][tileY] == 2 && inTileX < inTileY) { return false; }
        if (map[tileX][tileY] == 3 && inTileY < -inTileX) { return false; }
        if (map[tileX][tileY] == 4 && inTileX < -inTileY) { return false; }
        if (map[tileX][tileY] == 5 && inTileY < inTileX) { return false; }
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

        if(newWeapon == 0 && this.nbWhisky <= 0){
            newWeapon = (newWeapon+next)%this.weapons.length;
        }
        if(newWeapon == 1 && this.nbTequila <= 0){
            newWeapon = (newWeapon+next)%this.weapons.length;
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
        this.hud.hitAnimation();
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
                    case 'CarrotItem' :
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


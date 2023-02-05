import { buildWeapon } from "./weapons.js";

import { Hud } from "./hud.js";

import { data } from "./preload.js";

const FRAME_DELAY = 100;

const WIDTH = 640, HEIGHT = 480;


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
                    e.hit(player.currentWeapon.damage);
                    player.score += e.dropPoints ?? 0;
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

    switchToNextWeapon(){
        if(this.isAttacking) {
            return -1;
        }
        let id = this.weapons.lastIndexOf(this.currentWeapon);
        let newWeapon = (id+1)%this.weapons.length;

        if(newWeapon == 0 && this.nbWhisky <= 0){
            newWeapon = (newWeapon+1)%this.weapons.length;
        }
        if(newWeapon == 1 && this.nbTequila <= 0){
            newWeapon = (newWeapon+1)%this.weapons.length;
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

    attack(enemies) {
        if (this.isAttacking) {
            return;
        }
        this.isAttacking = true;
        this.setAnimation(this.currentWeapon.use);
        this.currentWeapon.behavior(this,enemies);
    }

    hit(damage){
        if(this.health <= 0){
            return;
        }
        this.health -= damage;
        // TODO : end game
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
                    case 'Rabbit' :
                        if (this.haveCarrot) {
                            this.haveCarrot = false;
                            this.giveCarrot = true;
                            e.nibble = true;
                            // Deleting the bull dialog
                            powerup.forEach(function(e2) {
                                if (e2.constructor.name == "Dialog") {
                                    e2.taken = true;
                                }
                            });
                        }
                        break;
                }
            }
        },this);
    }
}


/***
 * LIGHTER
 */

const FIRE_SPEED = 0.01;

const LIGHTER_OFF = 0, LIGHTER_ON = 1, LIGHTER_BLOW = 2;

const FIRE_ANIMATION_DELAY = 200;

const INTERSHOT_DELAY = 200;

const SIZES = [100, 120, 140, 150, 160, 165, 170, 175, 160, 150, 145, 140, 135, 120, 115, 100, 80, 50];

const SPRITE_ANIM_DELAY = 100;
const SPRITE_WIDTH = 1000;
const SPRITE_HEIGHT = 2800 / 4;
const SPRITE_ANIM_NB = 4;

class Lighter {

    constructor(player) {
        this.state = LIGHTER_OFF;
        this.player = player;
        this.shots = [];
        this.lastShot = 0;
        this.blowing = false;
        this.player = player;
        this.frame = 0;
        this.frameDelay = SPRITE_ANIM_DELAY;
    }

    update(dt) {
        this.shots = this.shots.filter(s => {
            s.x += dt * s.dirX * FIRE_SPEED;
            s.y += dt * s.dirY * FIRE_SPEED;
            s.delay -= dt;
            if (s.delay < 0) {
                // change size
                s.cycle++;
                s.image = data["fire" + (Math.random() * 3 + 1 | 0)];
                s.delay = FIRE_ANIMATION_DELAY;
                s.offsetX = Math.random() * 40 - 20 | 0;
                s.offsetY = Math.random() * 40 - 20 | 0;
            }
            return s.cycle < SIZES.length;
        });
        this.frameDelay -= dt;
        if (this.frameDelay < 0) {
            if (this.frame < 2 || this.state != LIGHTER_BLOW) {
                this.frame = (this.frame + 1) % SPRITE_ANIM_NB;
            }
            this.frameDelay = SPRITE_ANIM_DELAY;
        }
        this.lastShot += dt;
        if (this.blowing && this.lastShot > INTERSHOT_DELAY) {
            this.lastShot = 0;
            this.addShot();
        }
    }


    getLight() {
        if (this.shots.length > 0) {
            return 10;
        } 
        if (this.state > LIGHTER_OFF) {
            return 4;
        }
        return 2;
    }


    toggle() {
        this.state = (this.state == LIGHTER_OFF) ? LIGHTER_ON : LIGHTER_OFF;
        this.frame = 0;
    }

    isVisible() {
        return this.state > LIGHTER_OFF;
    }

    blow(b) {
        this.state = b ? LIGHTER_BLOW : LIGHTER_ON;
        this.frame = 0;
    }

    startBlowing() {
        if (this.state == LIGHTER_BLOW) {
            this.blowing = true;
        }
    }
    stopBlowing() {
        this.blowing = false;
    }

    addShot() {
        this.shots.push({ 
            x: this.player.posX + this.player.dirX * 0.2, 
            y: this.player.posY + this.player.dirY * 0.2, 
            dirX: this.player.dirX, 
            dirY: this.player.dirY,
            delay: FIRE_ANIMATION_DELAY,
            cycle: 0,
            image: data["fire" + (Math.random() * 3 + 1 | 0)],
            offsetX: Math.random() * 40 - 20 | 0,
            offsetY: Math.random() * 40 - 20 | 0
        });
    }

    render(ctx) {
        this.shots.forEach(s => {
            ctx.drawImage(s.image, WIDTH/2 - SIZES[s.cycle]/2 + s.offsetX | 0, HEIGHT / 2 - SIZES[s.cycle] + s.offsetY | 0, SIZES[s.cycle]*1.5, SIZES[s.cycle]*1.5);
        });
        if (this.state > LIGHTER_OFF) {
            ctx.drawImage((this.state == LIGHTER_ON) ? data.lighter1 : data.lighter2, 0, this.frame * SPRITE_HEIGHT, SPRITE_WIDTH, SPRITE_HEIGHT, -150, this.state == LIGHTER_ON ? 70 : 100, 500, 350);
        }
    }

}
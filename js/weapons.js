
import {data} from "./preload.js";

const WIDTH = 640, HEIGHT = 480;

/**
 * Build a weapon of the specified type.
 * @param {string} type Weapon type
 * 
 * @returns A newly-built weapon of the specified type.
 */
export function buildWeapon(type,){
    switch(type){
        case 'whisky':
            return new Whisky();
        case 'tequila':
            return new Tequila();
        case 'axe':
            return new Axe();
    }
}


/** Whisky */
const WHISKY_HEIGHT = 4200/6 | 0;
const WHISKY_WIDTH = 1000;

const WHISKY_DRINK = [0,1,2,2,2,3,3,3,4,5];
const WHISKY_IDLE = [0];
const CONSUME_DELAY = 300;

/** AXE */
const AXE_HEIGHT = 5000/5 | 0;
const AXE_WIDTH = 1000;
const AXE_DELAY = 375;

const AXE_ATTACK = [0,1,2,3,3,4];
const AXE_IDLE = [0];

/** TEQUILA */
const TEQUILA_HEIGHT = 4200/6 | 0;
const TEQUILA_WIDTH = 1000;


const TEQUILA_DRINK = [0,1,2,2,2,3,3,3,4,5];
const TEQUILA_IDLE = [0];

class Weapon{
    /**
     * 
     * @param damage Weapon's damages
     * @param scope Weapon's range
     */
    constructor(damage, range){
        this.damage = damage;
        this.delay = undefined;
        this.range = range;
    }

    behavior() { }

    update(dt){
        this.delay -= dt;
    }

    afterAnimation() { }

    render(ctx, SPRITE, frame, WIDTH, HEIGHT) {
        ctx.drawImage(SPRITE, 0, frame * HEIGHT, WIDTH, HEIGHT, 350, 20, 450, 390); // TODO : make it clean (temporary, wait final textures)
    }
}

class Consumable extends Weapon{
    constructor(){
        super(0,0);
    }

    setDelay(){
        this.delay = CONSUME_DELAY;
    }

    update(dt, player, enemies){
        super.update(dt);
        if(this.delay != undefined && this.delay <= 0) {
            this.delay = undefined;
            this.behavior(player);
        }
    }
}

class Whisky extends Consumable{
    constructor(){
        super();
        this.idle = WHISKY_IDLE;
        this.use = WHISKY_DRINK;
        this.addSobriety = 10;
    }

    render(ctx, frame){
        super.render(ctx, data["whisky-spritesheet"], frame, WHISKY_WIDTH, WHISKY_HEIGHT);
    }
}

class Tequila extends Consumable {
    constructor(){
        super();
        this.idle = TEQUILA_IDLE;
        this.use = TEQUILA_DRINK;
        this.addSobriety = 20;
    }

    render(ctx, frame){
        super.render(ctx, data["tequila-spritesheet"], frame, TEQUILA_WIDTH, TEQUILA_HEIGHT);
    }
}

class Axe extends Weapon{
    constructor(){
        super(25,2.5);
        this.idle = AXE_IDLE;
        this.use = AXE_ATTACK;
    }

    setDelay(){
        this.delay = AXE_DELAY;
    }

    update(dt, player, enemies){
        super.update(dt);
        if(this.delay != undefined && this.delay <= 0) {
            this.delay = undefined;
            this.behavior(player,enemies);
        }
    }
    
    render(ctx, frame){
        super.render(ctx, data["axe-spritesheet"], frame, AXE_WIDTH, AXE_HEIGHT);
    }
}



/***
 * LIGHTER
 */

const FIRE_SPEED = 0.01;

const LIGHTER_OFF = 0, LIGHTER_ON = 1, LIGHTER_BLOW = 2;

const FIRE_ANIMATION_DELAY = 100;

const INTERSHOT_DELAY = 200;

const SIZES = [100, 140, 160, 165, 170, 175, 160, 150, 145, 140, 135, 120, 115, 100, 80, 50];

const SPRITE_ANIM_DELAY = 100;
const SPRITE_WIDTH = 1000;
const SPRITE_HEIGHT = 2800 / 4;
const SPRITE_ANIM_NB = 4;

export class Lighter {

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
        if (b && this.state == LIGHTER_ON) {
            this.state = LIGHTER_BLOW;
        }
        else if (!b && this.state == LIGHTER_BLOW) {
            this.state = LIGHTER_ON;
        }
        else if (b && this.state == LIGHTER_OFF) {
            this.state = LIGHTER_BLOW;
        }
        this.frame = 0;
    }

    startBlowing() {
        if (this.state == LIGHTER_BLOW) {
            if (this.player.sobriety > 0) {
                this.blowing = true;
            }
            else if (!this.blowing) {
                this.state = LIGHTER_OFF;
            }
        }
    }
    stopBlowing() {
        this.blowing = false;
    }

    addShot() {
        if (this.player.sobriety <= 0) {
            return;
        }
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
        this.player.sobriety -= 10;
        if (this.player.sobriety < 0) {
            this.player.sobriety = 0;
        }
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
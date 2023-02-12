
import {data, preload} from "./preload.js";
import { WIDTH, HEIGHT } from "./gui.js";
import { audio } from "./audio.js";

/**
 * Build a weapon of the specified type.
 * @param {string} type Weapon type
 * 
 * @returns A newly-built weapon of the specified type.
 */
export function buildWeapon(type){
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
const WHISKY_INCREASE_SOBRIETY = 25;

const WHISKY_DRINK = [0,1,2,2,2,3,3,3,4,5];
const WHISKY_IDLE = [0];
const CONSUME_DELAY = 300;

/** AXE */
const AXE_HEIGHT = 5000/5 | 0;
const AXE_WIDTH = 1000;
const AXE_DELAY = 375;
const AXE_DAMAGE = 20;
const AXE_RANGE = 1.2;

const AXE_ATTACK = [0,1,2,3,3,4];
const AXE_IDLE = [0];

/** TEQUILA */
const TEQUILA_HEIGHT = 4200/6 | 0;
const TEQUILA_WIDTH = 1000;
const TEQUILA_INCREASE_SOBRIETY = 15;

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

    render(ctx, SPRITE, frame, WIDTH, HEIGHT, dX, dY) {
        ctx.drawImage(SPRITE, 0, frame * HEIGHT, WIDTH, HEIGHT, 350+dX, 20+dY, 450, 390); // TODO : make it clean (temporary, wait final textures)
    }
}

class Consumable extends Weapon{
    constructor(){
        super(0,0);
    }

    setDelay(){
        this.delay = CONSUME_DELAY;
        audio.playSound('drinkSound',5, false);
    }

    afterAnimation(){
        audio.playSound('drinkEndSound',5, 0.25, false);
        audio.playSound('yeetBottleSound',6, 0.5, false);
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

    behavior(player){
        super.behavior();
        if(player.nbWhisky == 0){
            return;
        }
        player.sobriety += WHISKY_INCREASE_SOBRIETY;
        if(player.sobriety > 100){
            player.sobriety = 100;
        }
        player.nbWhisky--;
    }

    afterAnimation(player){
        super.afterAnimation();
        if(player.nbWhisky == 0){
            player.equipeAxe();
        }
    }

    render(ctx, frame){
        super.render(ctx, data["whisky-spritesheet"], frame, WHISKY_WIDTH, WHISKY_HEIGHT, 0, 0);
    }
}

class Tequila extends Consumable {
    constructor(){
        super();
        this.idle = TEQUILA_IDLE;
        this.use = TEQUILA_DRINK;
        this.addSobriety = 20;
    }

    behavior(player){
        super.behavior();
        if(player.nbTequila == 0){
            return;
        }
        player.isDrunk = true;
        player.sobriety += TEQUILA_INCREASE_SOBRIETY;
        if(player.sobriety > 100){
            player.sobriety = 100;
        }
        player.nbTequila--;
    }

    afterAnimation(player){
        super.afterAnimation();
        if(player.nbTequila == 0){
            player.equipeAxe();
        }
    }

    render(ctx, frame){
        super.render(ctx, data["tequila-spritesheet"], frame, TEQUILA_WIDTH, TEQUILA_HEIGHT, 0, 0);
    }
}

const AXE_SHIFT = [-20, -30, -50, -60, -40];
class Axe extends Weapon {
    constructor(){
        super(AXE_DAMAGE,AXE_RANGE);
        this.idle = AXE_IDLE;
        this.use = AXE_ATTACK;
    }

    setDelay(){
        this.delay = AXE_DELAY;
        audio.playSound('axeSound',5,1, false);
    }

    update(dt, player, enemies){
        super.update(dt);
        if(this.delay != undefined && this.delay <= 0) {
            this.delay = undefined;
            this.behavior(player,enemies);
        }
    }

    behavior(player, enemies){
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
    }
    
    render(ctx, frame){
        super.render(ctx, data["axe-spritesheet"], frame, AXE_WIDTH, AXE_HEIGHT, AXE_SHIFT[frame], AXE_SHIFT[frame]);
    }
}



/***
 *  LIGHTER
 */
const FIRE_SPEED = 0.001;

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
        this.state = LIGHTER_ON;
        this.player = player;
        this.shots = [];
        this.lastShot = 0;
        this.blowing = false;
        this.player = player;
        this.frame = 0;
        this.frameDelay = SPRITE_ANIM_DELAY;
    }

    update(dt) {
        if (this.blowing && this.state == LIGHTER_BLOW && this.player.sobriety <= 0) {
            this.state = LIGHTER_OFF;
        }

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
            this.frame = (this.frame + 1) % (this.state == LIGHTER_BLOW ? SPRITE_ANIM_NB+2 : SPRITE_ANIM_NB);
            if (this.frame == 0 && this.state == LIGHTER_BLOW) {
                this.frame = 2;
            }
            
            this.frameDelay = SPRITE_ANIM_DELAY;
        }
        this.lastShot += dt;
        if (this.blowing && this.state == LIGHTER_BLOW && this.lastShot > INTERSHOT_DELAY) {
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
           this.state = LIGHTER_ON;
        }
        this.frame = 0;
    }

    startBlowing() {
        this.blowing = true;
    }
    stopBlowing() {
        this.blowing = false;
        audio.pause(6);
    }

    addShot() {
        if (this.player.sobriety <= 0) {
            return;
        }
        if (this.shots.length == 0) {
            audio.pause(6);
            audio.playSound("flamethrower",5,0.5, false); 
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
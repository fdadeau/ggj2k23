const WEAPON_WHISKY = 0;
const WEAPON_TEQUILA = 1;
const WEAPON_AXE = 2;

const NB_SLOTS = 7;

import { data } from "./preload.js";


const AXE_IMG = new Image();
AXE_IMG.src = './data/images/axe.png';

const HEART_IMG = new Image();
HEART_IMG.src = './data/images/heart.png';

const WHISKY_IMG = new Image();
WHISKY_IMG.src = './data/images/whisky.png';

const TEQUILA_IMG = new Image();
TEQUILA_IMG.src = './data/images/tequila.png';

const CARROT_IMG = new Image();
CARROT_IMG.src = './data/images/carrot.png';

const TIMBER_IMG = new Image();
TIMBER_IMG.src = './data/images/raymond.png';

const BACKGROUND_IMG = new Image();
BACKGROUND_IMG.src = './data/textures/wood.png';

const ROOT_IMG = new Image();
ROOT_IMG.src = './data/hud-roots.png';

const FILTER_SPRITESHEET = new Image();
FILTER_SPRITESHEET.src = './data/raymon-scar-spritesheet.png';
const FILTER_HEIGHT = 150/2;
const FILTER_WIDTH = 75;

const TIMBER_SPRITESHEET = new Image();
TIMBER_SPRITESHEET.src = "./data/raymond-spritesheet.png"
const TIMBER_HEIGHT = 375/5;
const TIMBER_WIDTH = 75;
const TIMBER_HIT = [0,1,2,1,0];
const TIMBER_IDLE = [0];
const TIMBER_DED = [4];

const FRAME_DELAY = 150;
const RED_OVERLAY_DELAY = 200;


export class Hud {

    constructor(hudHeight) {
        // Score
        this.score = 0;
        // Level
        this.level = 1;
        // Health (in %)
        this.health = 100;
        // Sobriety bar (in %)
        this.sobriety = 0;
        // Weapon id
        this.weapon = WEAPON_AXE;
        // lighter
        this.lighter = 0;
        // Hud Height
        this.height = hudHeight;
        // Number of whisky bottles
        this.nbWhisky = 0;
        // Number of tequila bottles
        this.nbTequila = 0;
        // Tells if the carrot is present
        this.haveCarrot = false;

        this.delay = 0;
        this.redDelay = undefined;
        this.frame = 0;
        this.idle();
        this.red = false;
    }

    hitAnimation(){
        this.redDelay = RED_OVERLAY_DELAY
        this.red = true;
        this.setAnimation(TIMBER_HIT);
    }

    idle(){
        this.setAnimation(TIMBER_IDLE);
    }

    ded(){
        this.setAnimation(TIMBER_DED);
    }

    update(dt){
        this.delay -= dt;
        if(this.delay <= 0) {
            this.delay = FRAME_DELAY;
            this.frame = (this.frame + 1) % this.animation.length;
            if(this.frame == 0 && this.animation == TIMBER_HIT){
                this.idle();
            }
        }

        this.redDelay -= dt;
        if(this.redDelay != undefined && this.redDelay <= 0){
            this.red = false;   
        }
    }

    setAnimation(anim) {
        this.animation = anim;
        this.frame = 0;
    }

    render(ctx, player) {
        this.health = player.health;
        this.sobriety = player.sobriety;
        this.nbWhisky = player.nbWhisky;
        this.nbTequila = player.nbTequila;
        this.score = player.score;
        this.haveCarrot = player.haveCarrot;

        let hudY_origin = cvs.height - this.height;
       
        // Draw the window
        ctx.fillStyle = '#0000a6';
        ctx.fillRect(0, hudY_origin, cvs.width, this.height);
        ctx.drawImage(BACKGROUND_IMG, 0, hudY_origin, cvs.width, this.height);
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 2;
        //ctx.strokeRect(0, hudY_origin, cvs.width, 0);

        // Draw the separators
        let slot = cvs.width / NB_SLOTS;
        ctx.drawImage(ROOT_IMG, slot-3, hudY_origin + 10,6,60);
        ctx.drawImage(ROOT_IMG, slot*2-3, hudY_origin + 10,6,60);
        ctx.drawImage(ROOT_IMG, slot*3-3, hudY_origin + 10,6,60);
        ctx.drawImage(ROOT_IMG, slot*4-3, hudY_origin + 10,6,60);
        ctx.fillStyle = '#fff';
        ctx.font = "12pt pixel-bit-advanced";

        // Level slot
        ctx.fillText("LEVEL", 15, hudY_origin + 25);
        ctx.fillText(this.level, 40, hudY_origin + 55);

        // Score slot
        ctx.fillText("SCORE", 100, hudY_origin + 25);
        ctx.fillText(this.score, 100, hudY_origin + 55);

        // Skin slot
        ctx.drawImage(TIMBER_SPRITESHEET, 0, ((this.animation[this.frame]) * TIMBER_HEIGHT), TIMBER_WIDTH, TIMBER_HEIGHT, 275, hudY_origin + 1, slot - 2, this.height);
        
        if(this.health <= 50){
            if(this.health == 0){
                if(this.animation != TIMBER_DED){
                    this.ded();
                }
                ctx.drawImage(FILTER_SPRITESHEET, 0, FILTER_HEIGHT, FILTER_WIDTH, FILTER_HEIGHT, 275, hudY_origin + 1, slot - 2, this.height);
            }else{
                ctx.drawImage(FILTER_SPRITESHEET, 0, 0, FILTER_WIDTH, FILTER_HEIGHT, 275, hudY_origin + 1, slot - 2, this.height);
            }
        }
        
        // Weapon slot
        this.drawWeapon(ctx, hudY_origin, this.weapon);

        // Draw the health and sobriety bars
        this.drawBar(ctx, player, 'health');
        this.drawBar(ctx, player, 'sobriety');

        // DRaw the carrot if the player have it
        if (this.haveCarrot) {
            ctx.drawImage(CARROT_IMG, cvs.width - slot / 2, 10, 30, 30);
        }
        
        // Reset the font height
        ctx.font = "6pt Verdana";
        if(this.red){
            ctx.globalAlpha = 0.25;
            ctx.fillStyle = '#f00';
            ctx.fillRect(0, 0, cvs.width, cvs.height);
            ctx.globalAlpha = 1;
        }
    }

    drawWeapon(ctx, hudY_origin, id){
        switch(id){
            case WEAPON_AXE:
                ctx.drawImage(data.axe, 200, hudY_origin + 5, this.height - 10, this.height - 10);
                break;
            case WEAPON_WHISKY:
                ctx.drawImage(WHISKY_IMG, 200, hudY_origin + 5, this.height - 10, this.height - 10);
                ctx.fillText(this.nbWhisky, 248, hudY_origin + 64);
                break;
            case WEAPON_TEQUILA:
                ctx.drawImage(TEQUILA_IMG, 200, hudY_origin + 5, this.height - 10, this.height - 10);
                ctx.fillText(this.nbTequila, 248, hudY_origin + 64);
                break;
        }
    }

    drawBar(ctx, player, type) {
        let height = cvs.height - this.height;
        let slot = cvs.width / NB_SLOTS;
        let levelRef;
        let barColor;
        let image = new Image();

        if (type == 'health') {
            height += 10;
            levelRef = this.health;
            let barLevel = (this.health * 512) / 100
            let red;
            let green;
            if (barLevel < 255) {
                red = 255;
                green = barLevel;
            } else {
                red = 255 * 2 - barLevel;
                green = 255;
            }
            barColor = 'rgb(' + red + ', ' + green + ', 0)';
            image.src = './data/images/heart.png';
        } else {
            height += 45;
            levelRef = this.sobriety;
            // Drunk animation (tequila)
            if (player.isDrunk) {
                barColor = '#dfe8e8';
                image.src = './data/images/tequila.png';
            } else {
                barColor = 'rgb(220, 131, 58)';
                image.src = './data/images/whisky.png';
            }
        }

        // Fill the bars
        ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
        let barHeight = 20;
        let barWidth = slot * 2 + slot / 3;
        ctx.fillRect(slot * 4 + 10, height, barWidth, barHeight);
        ctx.fillStyle = barColor;
        let fillBar = (levelRef * barWidth) / 100;
        let miniMargin = 2;
        ctx.fillRect(slot * 4 + 10 + miniMargin, height + miniMargin, (levelRef < miniMargin) ? fillBar : fillBar - miniMargin * 2, barHeight - miniMargin * 2);

        // Draw the images
        ctx.drawImage(image, slot * 6 + 50, height - 5, 30, 30);
    }

    /**
     * SETTERS
     */

    incrementScore(amount) {
        this.score += amount;
    }

    incrementLevel() {
        this.level++;
    }

    decrementLevel() {
        this.level++;
    }

    hit(damage) {
        this.health -= damage;
    }

    heal(regen) {
        this.health += regen;
    }

    drink(amount) {
        this.sobriety += amount;
    }

    spit(amount) {
        this.sobriety += amount;
    }

    changeWeapon(weapon) {
        this.weapon = weapon;
    }

    equipeAxe(){
        this.weapon = WEAPON_AXE;
    }

    equipeWhisky(){
        this.weapon = WEAPON_WHISKY;
    }

    equipeTequila(){
        this.weapon = WEAPON_TEQUILA;
    }
}


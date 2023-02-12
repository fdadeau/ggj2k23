const WEAPON_WHISKY = 0;
const WEAPON_TEQUILA = 1;
const WEAPON_AXE = 2;

const NB_SLOTS = 7;

import { data } from "./preload.js";


const FILTER_HEIGHT = 150/2;
const FILTER_WIDTH = 75;

const TIMBER_HEIGHT = 375/5;
const TIMBER_WIDTH = 75;
const TIMBER_HIT = [0,1,2,1,0];
const TIMBER_IDLE = [0];
const TIMBER_DED = [4];
const TIMBER_BLOWING = [3];

const FRAME_DELAY = 150;
const RED_OVERLAY_DELAY = 200;


export class Hud {

    constructor(hudHeight) {
        // Level
        this.level = 1;
        // Weapon id
        this.weapon = WEAPON_AXE;
        // Hud Height
        this.height = hudHeight;

        // Animation variables
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
        let hudY_origin = cvs.height - this.height;
       
        if (player.lighter.blowing) {
            this.setAnimation(TIMBER_BLOWING)
        }
        else if (this.animation == TIMBER_BLOWING) {
            this.setAnimation(TIMBER_IDLE);
        }

        // Draw the window
        ctx.textAlign = "left";
        ctx.fillStyle = '#0000a6';
        ctx.fillRect(0, hudY_origin, cvs.width, this.height);
        ctx.drawImage(data["woodTexture"], 0, hudY_origin, cvs.width, this.height);
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 2;
        //ctx.strokeRect(0, hudY_origin, cvs.width, 0);

        // Draw the separators
        let slot = cvs.width / NB_SLOTS;
        ctx.drawImage(data["hud-roots"], slot-3, hudY_origin + 10,6,60);
        ctx.drawImage(data["hud-roots"], slot*2-3, hudY_origin + 10,6,60);
        ctx.drawImage(data["hud-roots"], slot*3-3, hudY_origin + 10,6,60);
        ctx.drawImage(data["hud-roots"], slot*4-3, hudY_origin + 10,6,60);
        ctx.fillStyle = '#fff';
        ctx.font = "12pt pixel-bit-advanced";

        // Level slot
        ctx.fillText("LEVEL", 15, hudY_origin + 25);
        ctx.fillText(this.level, 40, hudY_origin + 55);

        // Score slot
        ctx.fillText("SCORE", 100, hudY_origin + 25);
        ctx.fillText(player.score, 100, hudY_origin + 55);

        // Skin slot
        ctx.drawImage(data["raymond-spritesheet"], 0, ((this.animation[this.frame]) * TIMBER_HEIGHT), TIMBER_WIDTH, TIMBER_HEIGHT, 275, hudY_origin + 1, slot - 2, this.height);
        
        if(player.health <= 50){
            if(player.health <= 25){
                if(player.health <= 0 && this.animation != TIMBER_DED){
                    this.ded();
                }
                ctx.drawImage(data["filter-spritesheet"], 0, FILTER_HEIGHT, FILTER_WIDTH, FILTER_HEIGHT, 275, hudY_origin + 1, slot - 2, this.height);
            }else{
                ctx.drawImage(data["filter-spritesheet"], 0, 0, FILTER_WIDTH, FILTER_HEIGHT, 275, hudY_origin + 1, slot - 2, this.height);
            }
        }
        
        // Weapon slot
        this.drawWeapon(ctx, player, hudY_origin, this.weapon);

        // Draw the health and sobriety bars
        this.drawBar(ctx, player, 'health');
        this.drawBar(ctx, player, 'sobriety');

        // DRaw the carrot if the player have it
        if (player.haveCarrot) {
            ctx.drawImage(data.carrot, cvs.width - slot / 2, 10, 30, 30);
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

    drawWeapon(ctx, player, hudY_origin, id){
        switch(id){
            case WEAPON_AXE:
                ctx.drawImage(data.axe, 200, hudY_origin + 5, this.height - 10, this.height - 10);
                break;
            case WEAPON_WHISKY:
                ctx.drawImage(data.whisky, 200, hudY_origin + 5, this.height - 10, this.height - 10);
                ctx.fillText(player.nbWhisky, 248, hudY_origin + 64);
                break;
            case WEAPON_TEQUILA:
                ctx.drawImage(data.tequila, 200, hudY_origin + 5, this.height - 10, this.height - 10);
                ctx.fillText(player.nbTequila, 248, hudY_origin + 64);
                break;
        }
    }

    drawBar(ctx, player, type) {
        let height = cvs.height - this.height;
        let slot = cvs.width / NB_SLOTS;
        let levelRef;
        let barColor;
        let image;

        if (type == 'health') {
            height += 10;
            levelRef = player.health;
            let barLevel = (player.health * 512) / 100
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
            image = data.heart;
        } else {
            height += 45;
            levelRef = player.sobriety;
            // Drunk animation (tequila)
            if (player.isDrunk) {
                barColor = '#dfe8e8';
                image = data.tequila;
            } else {
                barColor = 'rgb(220, 131, 58)';
                image = data.whisky;
            }
        }

        // Fill the bars
        ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
        let miniMargin = 2;
        let barHeight = 20;
        let barWidth = slot * 2 + slot / 3;
        ctx.fillRect(slot * 4 + 10, height, barWidth, barHeight);
        ctx.fillStyle = barColor;
        let fillBar = (levelRef * barWidth) / 100;
        ctx.fillRect(slot * 4 + 10 + miniMargin, height + miniMargin, fillBar*0.98, barHeight-miniMargin*2);

        // Draw the images
        ctx.drawImage(image, slot * 6 + 50, height - 5, 30, 30);
    }


    /**
     * SETTERS
     */
    incrementLevel() {
        this.level++;
    }

    decrementLevel() {
        this.level++;
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


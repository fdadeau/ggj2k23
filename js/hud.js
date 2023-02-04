const WEAPON_WHISKY = 0;
const WEAPON_TEQUILA = 1;
const WEAPON_AXE = 2;
const WEAPON_LIGHTER = 4;


const NB_SLOTS = 7;

const AXE_IMG = new Image();
AXE_IMG.src = '../data/images/axe.png';

const HEART_IMG = new Image();
HEART_IMG.src = '../data/images/heart.png';

const WHISKY_IMG = new Image();
WHISKY_IMG.src = '../data/images/whisky.png';

const TEQUILA_IMG = new Image();
TEQUILA_IMG.src = '../data/images/tequila.png';

const TIMBER_IMG = new Image();
TIMBER_IMG.src = '../data/images/raymond.png';

const BACKGROUND_IMG = new Image();
BACKGROUND_IMG.src = '../data/wood.png';

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
        // Hud Height
        this.height = hudHeight;
        // Number of whisky bottles
        this.nbWhisky = 0;
        // Number of tequila bottles
        this.nbTequila = 0;
    }

    render(ctx, player) {
        this.health = player.health;
        this.sobriety = player.sobriety;
        this.nbWhisky = player.nbWhisky;
        this.nbTequila = player.nbTequila;

        let hudY_origin = cvs.height - this.height;

        // Draw the window
        ctx.fillStyle = '#0000a6';
        ctx.fillRect(0, hudY_origin, cvs.width, this.height);
        ctx.drawImage(BACKGROUND_IMG, 0, hudY_origin, cvs.width, this.height);
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 2;
        ctx.strokeRect(0, hudY_origin, cvs.width, 0);

        // Draw the separators
        let slot = cvs.width / NB_SLOTS;
        ctx.strokeRect(slot, hudY_origin + 10, 0, this.height - 20);
        ctx.strokeRect(slot * 2, hudY_origin + 10, 0, this.height - 20);
        ctx.strokeRect(slot * 3, hudY_origin, 0, this.height);
        ctx.strokeRect(slot * 4, hudY_origin, 0, this.height);

        ctx.fillStyle = '#fff';
        ctx.font = "12pt ka1";

        // Level slot
        ctx.fillText("LEVEL", 15, hudY_origin + 25);
        ctx.fillText(this.level, 40, hudY_origin + 55);

        // Score slot
        ctx.fillText("SCORE", 100, hudY_origin + 25);
        ctx.fillText(this.score, 100, hudY_origin + 55);

        // Weapon slot
        this.drawWeapon(ctx, hudY_origin, this.weapon);

        // Skin slot
        ctx.drawImage(TIMBER_IMG, 275, hudY_origin + 1, slot - 2, this.height);

        // Draw the health and sobriety bars
        this.drawBar(ctx, player, 'health');
        this.drawBar(ctx, player, 'sobriety');

        // Reset the font height
        ctx.font = "6pt Verdana";
    }

    drawWeapon(ctx, hudY_origin, id){
        switch(id){
            case WEAPON_AXE:
                ctx.drawImage(AXE_IMG, 200, hudY_origin + 5, this.height - 10, this.height - 10);
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

    equipeWeapon(id){
        this.weapon = id;
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
            //console.log(barLevel);
            if (barLevel < 255) {
                red = 255;
                green = barLevel;
            } else {
                red = 255 * 2 - barLevel;
                green = 255;
            }
            barColor = 'rgb(' + red + ', ' + green + ', 0)';
            image.src = '../data/images/heart.png';
        } else {
            height += 45;
            levelRef = this.sobriety;
            // Drunk animation (tequila)
            if (player.isDrunk) {
                barColor = '#dfe8e8';
                image.src = '../data/images/tequila.png';
            } else {
                barColor = 'rgb(220, 131, 58)';
                image.src = '../data/images/whisky.png';
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
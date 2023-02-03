const WEAPON_AXE = 1; // Hache
const WEAPON_CHAINSAW = 2; // Tronçonneuse
const WEAPON_LIGHTER = 3; // Briquet

const HUD_HEIGHT = 75;

export class Hud {

    constructor(cvs) {
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
        // Canvas
        this.cvs = cvs;
    }

    render(ctx) {
        ctx.fillStyle = '#0000a6';
        ctx.fillRect(0, cvs.height - HUD_HEIGHT, cvs.width, HUD_HEIGHT);
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
}
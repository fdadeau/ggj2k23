/** CUTE WHISKY */

const WHISKY_SPRITESHEET = new Image();
WHISKY_SPRITESHEET.src = "../data/images/whisky.png";
const WHISKY_HEIGHT = 500 | 0;
const WHISKY_WIDTH = 500;

/** NOT CUTE TEQUILA */

const TEQUILA_SPRITESHEET = new Image();
TEQUILA_SPRITESHEET.src = "../data/images/tequila.png";
const TEQUILA_HEIGHT = 500 | 0;
const TEQUILA_WIDTH = 500;

const CARROT_SPRITESHEET = new Image();
CARROT_SPRITESHEET.src = "../data/images/carrot.png";
const CARROT_HEIGHT = 454 | 0;
const CARROT_WIDTH = 454;
let carrotInstance = 0;

const RABBIT_SPRITESHEET = new Image();
RABBIT_SPRITESHEET.src = "../data/images/rabbit.png";
const RABBIT_HEIGHT = 454 | 0;
const RABBIT_WIDTH = 454;
let rabbitInstance = 0;

const DIALOG_SPRITESHEET = new Image();
DIALOG_SPRITESHEET.src = "../data/images/dialog.png";
const DIALOG_HEIGHT = 663 | 0;
const DIALOG_WIDTH = 663;
let dialogInstance = 0;

/**
 * Build a power up of the specified type.
 * @param {string} type Power up type
 * @param {number} x initial X position
 * @param {number} y initial Y position
 * @param {number} dx initial direction on X axis
 * @param {number} dy initial direction on Y axis
 * @returns A newly-built power up of the specified type.
 */
export function buildPowerUp(type,x,y) {
    switch (type) {
        case "whisky":
            return new WhiskyItem(x, y);
        case "tequila":
            return new TequilaItem(x, y);
        case "carrot":
            // Singleton
            if (carrotInstance < 1) {
                carrotInstance = 1;
                return new CarrotItem(x, y);
            }
            break;
        case "rabbit":
            // Singleton
            if (rabbitInstance < 1) {
                rabbitInstance = 1;
                return new Rabbit(x, y);
            }
            break;
        case "dialog":
            // Singleton
            if (dialogInstance < 1) {
                dialogInstance = 1;
                return new Dialog(x, y);
            }
            break;
    }
}


/**
 * Classes describing enemies.
 */

class PowerUp {

    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.taken = false;
    }

    /** Common behavior */
    update() { }

    hit() { }

    behavior() { }

    collides(x, y) {
        return false;
        // return x < this.x - 0.1 || x > this.x + 0.1 || y < this.y - 0.1 || y > this.y - 0.1; 
    }
}

class WhiskyItem extends PowerUp {

    constructor(x, y) {
        super(x, y);
        this.factor = 0.25;
        this.height = WHISKY_HEIGHT;
        this.width = WHISKY_WIDTH;
        this.points = 100;
    }

    update(dt) {
        super.update(dt);
    }

    render(ctx, minX, maxX, sizeX, sizeY, x, y) {
        let sourceX = minX / sizeX * this.width | 0;

        //ctx.fillStyle = '#fff';
        //ctx.fillText(`Whisky:   dirX=${this.dirX.toFixed(2)}, dirY=${this.dirY.toFixed(2)}, angle=${this.angle.toFixed(2)}`, 10, 40);

        ctx.drawImage(WHISKY_SPRITESHEET, sourceX, 0, this.width, this.height, x, y, maxX - minX, sizeY);
    }
}

class TequilaItem extends PowerUp {

    constructor(x, y) {
        super(x, y);
        this.factor = 0.25;
        this.height = TEQUILA_HEIGHT;
        this.width = TEQUILA_WIDTH;
        this.points = 200;
    }

    update(dt) {
        super.update(dt);
    }

    render(ctx, minX, maxX, sizeX, sizeY, x, y) {
        let sourceX = minX / sizeX * this.width | 0;

        //ctx.fillStyle = '#fff';
        //ctx.fillText(`Tequila:   dirX=${this.dirX.toFixed(2)}, dirY=${this.dirY.toFixed(2)}, angle=${this.angle.toFixed(2)}`, 10, 30);

        ctx.drawImage(TEQUILA_SPRITESHEET, sourceX, 0, this.width, this.height, x, y, maxX - minX, sizeY);
    }
}

class CarrotItem extends PowerUp {

    constructor(x, y) {
        super(x, y);
        this.factor = 0.25;
        this.height = CARROT_HEIGHT;
        this.width = CARROT_WIDTH;
        this.points = 0;
    }

    update(dt) {
        super.update(dt);
    }

    render(ctx, minX, maxX, sizeX, sizeY, x, y) {
        let sourceX = minX / sizeX * this.width | 0;

        //ctx.fillStyle = '#fff';
        //ctx.fillText(`Tequila:   dirX=${this.dirX.toFixed(2)}, dirY=${this.dirY.toFixed(2)}, angle=${this.angle.toFixed(2)}`, 10, 30);

        ctx.drawImage(CARROT_SPRITESHEET, sourceX, 0, this.width, this.height, x, y, maxX - minX, sizeY);
    }
}

class Rabbit extends PowerUp {

    constructor(x, y) {
        super(x, y);
        this.factor = 0.25;
        this.decalage = 800;
        this.height = RABBIT_HEIGHT + this.decalage;
        this.width = RABBIT_WIDTH;
        this.points = 0;
    }

    update(dt) {
        super.update(dt);
    }

    render(ctx, minX, maxX, sizeX, sizeY, x, y) {
        let sourceX = minX / sizeX * this.width | 0;

        //ctx.fillStyle = '#fff';
        //ctx.fillText(`Tequila:   dirX=${this.dirX.toFixed(2)}, dirY=${this.dirY.toFixed(2)}, angle=${this.angle.toFixed(2)}`, 10, 30);

        ctx.drawImage(RABBIT_SPRITESHEET, sourceX, - this.decalage, this.width, this.height, x, y, maxX - minX, sizeY);
    }
}

class Dialog extends PowerUp {

    constructor(x, y) {
        super(x, y);
        this.factor = 0.2;
        this.decalage = 200;
        this.height = DIALOG_HEIGHT + this.decalage;
        this.width = DIALOG_WIDTH;
        this.points = 0;
    }

    update(dt) {
        super.update(dt);
    }

    render(ctx, minX, maxX, sizeX, sizeY, x, y) {
        let sourceX = minX / sizeX * this.width | 0;

        //ctx.fillStyle = '#fff';
        //ctx.fillText(`Tequila:   dirX=${this.dirX.toFixed(2)}, dirY=${this.dirY.toFixed(2)}, angle=${this.angle.toFixed(2)}`, 10, 30);

        ctx.drawImage(DIALOG_SPRITESHEET, sourceX, 0, this.width, this.height, x, y, maxX - minX, sizeY);
    }
}
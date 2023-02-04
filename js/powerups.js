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

/**
 * Build a power up of the specified type.
 * @param {string} type Power up type
 * @param {number} x initial X position
 * @param {number} y initial Y position
 * @param {number} dx initial direction on X axis
 * @param {number} dy initial direction on Y axis
 * @returns A newly-built power up of the specified type.
 */
export function buildPowerUp(type,x,y,dx,dy) {
    switch (type) {
        case "whisky":
            return new WhiskyItem(x, y);
        case "tequila":
            return new TequilaItem(x, y);
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

    behavior() { }

    collides(x, y) {
        return false;
        // return x < this.x - 0.1 || x > this.x + 0.1 || y < this.y - 0.1 || y > this.y - 0.1; 
    }
}

class WhiskyItem extends PowerUp {

    constructor(x, y, dirX, dirY) {
        super(x, y, dirX, dirY);
        this.factor = 0.25;
        this.height = WHISKY_HEIGHT;
        this.width = WHISKY_WIDTH;
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

    constructor(x, y, dirX, dirY) {
        super(x, y, dirX, dirY);
        this.factor = 0.25;
        this.height = TEQUILA_HEIGHT;
        this.width = TEQUILA_WIDTH;
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
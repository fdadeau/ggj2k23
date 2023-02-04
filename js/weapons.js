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
        case 'axe':
            return new Axe();
        case 'lighter':
            return new Lighter();
        case 'chainsaw':
            return new Chainsaw();
        
    }
}

class Weapon{
    /**
     * 
     * @param damage Weapon's damages
     * @param nbFrames Number of frame of the animation
     * @param delay Delay between each attack (in ms)
     * @param scope Weapon's scope
     */
    constructor(damage, nbFrames, delay, scope){
        this.damage = damage;
        this.delay = delay;
        this.scope = scope; // Todo : think about units
        this.nbFrames = nbFrames;
    }
}

class Consumable extends Weapon{
    constructor(nbFrames, delay){
        super(0,nbFrames,delay,0);
    }
}

const WHISKY_SPRITESHEET = new Image();
WHISKY_SPRITESHEET.src = "../data/whisky-spritesheet.png";
const WHISKY_HEIGHT = 724/3 | 0;
const WHISKY_DRINK = [0,1,2];
const WHISKY_WIDTH = 240;

class Whisky extends Consumable{ // TODO : make it consommable
    constructor(){
        super(3,600); // TODO : optimize
        this.setAnimation(WHISKY_DRINK);
    }

    setAnimation(anim) {
        this.animation = anim;
        this.frameDelay = this.delay/this.nbFrames;
        this.frame = 0;
    }

    update() {
        this.frameDelay -= this.delay/this.nbFrames;
        if (this.frameDelay <= 0) {
            this.frameDelay = this.delay/this.nbFrames;
            this.frame = (this.frame + 1) % this.animation.length;
        }
        return this.frame != 0;
    }

    render(ctx){
        ctx.drawImage(WHISKY_SPRITESHEET, 0, ((this.animation[this.frame]) * WHISKY_HEIGHT), WHISKY_WIDTH, 236, 400, 325-150, 170, 150); // TODO : make it clean (temporary, wait final textures)
    }
}

const AXE_SPRITESHEET = new Image();
AXE_SPRITESHEET.src = "../data/dino-spritesheet.png";
const AXE_HEIGHT = 5664/24 | 0;
const AXE_WIDTH = 240;
const AXE_ATTACK = [0,1,2];

class Axe extends Weapon{
    constructor(){
        super(25,3,600,0); // TODO : optimize
        this.setAnimation(AXE_ATTACK);
    }

    setAnimation(anim) {
        this.animation = anim;
        this.frameDelay = this.delay/this.nbFrames;
        this.frame = 0;
    }

    update() {
        this.frameDelay -= this.delay/this.nbFrames;
        if (this.frameDelay <= 0) {
            this.frameDelay = this.delay/this.nbFrames;
            this.frame = (this.frame + 1) % this.animation.length;
        }
        return this.frame != 0;
    }

    render(ctx){
        ctx.drawImage(AXE_SPRITESHEET, 0, ((this.animation[this.frame]) * AXE_HEIGHT), AXE_WIDTH, 236, 400, 325-150, 170, 150); // TODO : make it clean (temporary, wait final textures)
    }
}

class Lighter extends Weapon{
    constructor(){
        super(0,0,0,0);
        // TODO : complete constructor
    }

    // TODO : add animation and rander methods
}


const CHAINSAW_SPRITESHEET = new Image();
CHAINSAW_SPRITESHEET.src = "../data/dino-spritesheet.png";
const CHAINSAW_HEIGHT = 5664/24 | 0;
const CHAINSAW_WIDTH = 240;
const CHAINSAW_ATTACK = [3,4,5];

class Chainsaw extends Weapon{
    constructor(){
        super(25,3,300,0); // TODO : optimize
        this.setAnimation(CHAINSAW_ATTACK);
    }

    setAnimation(anim) {
        this.animation = anim;
        this.frameDelay = this.delay/this.nbFrames;
        this.frame = 0;
    }

    update() {
        this.frameDelay -= this.delay/this.nbFrames;
        if (this.frameDelay <= 0) {
            this.frameDelay = this.delay/this.nbFrames;
            this.frame = (this.frame + 1) % this.animation.length;
        }
        return this.frame != 0;
    }

    render(ctx){
        ctx.drawImage(CHAINSAW_SPRITESHEET, 0, ((this.animation[this.frame]) * CHAINSAW_HEIGHT), CHAINSAW_WIDTH, 236, 400, 325-150, 170, 150); // TODO : make it clean (temporary, wait final textures)
    }
}
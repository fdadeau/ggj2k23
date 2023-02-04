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


const FRAME_DELAY = 200;
const WHISKY_SPRITESHEET = new Image();
WHISKY_SPRITESHEET.src = "../data/whisky-spritesheet.png";
const WHISKY_HEIGHT = 724/3 | 0;
const WHISKY_DRINK = [0,1,2];

class Whisky extends Consumable{
    constructor(){
        super(3,FRAME_DELAY*3);
        this.setAnimation(WHISKY_DRINK);
    }

    setAnimation(anim) {
        this.animation = anim;
        this.frameDelay = FRAME_DELAY;
        this.frame = 0;
    }

    update() {
        this.frameDelay -= FRAME_DELAY;
        if (this.frameDelay <= 0) {
            this.frameDelay = FRAME_DELAY;
            this.frame = (this.frame + 1) % this.animation.length;
        }
        return this.frame != 0;
    }

    render(ctx){
        ctx.drawImage(WHISKY_SPRITESHEET, 0, ((this.animation[this.frame]) * WHISKY_HEIGHT), 240, 236, 400, 325-150, 170, 150); // TODO : make it clean (temporary, wait final textures)
    }
}

class Axe extends Weapon{
    constructor(){
        // TODO : complete constructor
    }

    // TODO : add animation and rander methods
}

class Lighter extends Weapon{
    constructor(){
        // TODO : complete constructor
    }

    // TODO : add animation and rander methods
}

class Chainsaw extends Weapon{
    constructor(){
        // TODO : complete constructor
    }

    // TODO : add animation and rander methods
}
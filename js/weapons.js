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
    }
}

class Weapon{
    /**
     * 
     * @param damage Weapon's damages
     * @param delay Delay between each attack (in ms)
     * @param scope Weapon's scope
     */
    constructor(damage, delay, range){
        this.damage = damage;
        this.delay = delay; // TODO : not used 
        this.range = range;
    }
}

class Consumable extends Weapon{
    constructor(){
        super(0,1200,0);
    }
}

const WHISKY_SPRITESHEET = new Image();
WHISKY_SPRITESHEET.src = "../data/whisky-spritesheet.png";
const WHISKY_HEIGHT = 4200/6 | 0;
const WHISKY_WIDTH = 1000;

class Whisky extends Consumable{
    constructor(){
        super();
    }

    render(ctx, frame){
        ctx.drawImage(WHISKY_SPRITESHEET, 0, frame, WHISKY_WIDTH, WHISKY_HEIGHT, 350, 325-170, 200, 170); // TODO : make it clean (temporary, wait final textures)
    }
}

const AXE_SPRITESHEET = new Image();
AXE_SPRITESHEET.src = "../data/axe-spritesheet.png";
const AXE_HEIGHT = 5000/5 | 0;
const AXE_WIDTH = 1000;

class Axe extends Weapon{
    constructor(){
        super(25,800,2.5);
    }
    render(ctx, frame){
        ctx.drawImage(AXE_SPRITESHEET, 0, frame, AXE_WIDTH, AXE_HEIGHT, 400, 325-150, 170, 150); // TODO : make it clean (temporary, wait final textures)
    }
}

class Lighter extends Weapon{
    constructor(){
        super(0,0,0,0);
        // TODO : complete constructor
    }

    // TODO : add animation and rander methods
}
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
        case 'tequila':
            return new Tequila();
        case 'axe':
            return new Axe();
        case 'lighter':
            return new Lighter();   
    }
}

/** Whisky */
const WHISKY_SPRITESHEET = new Image();
WHISKY_SPRITESHEET.src = "../data/whisky-spritesheet.png";
const WHISKY_HEIGHT = 4200/6 | 0;
const WHISKY_WIDTH = 1000;

const WHISKY_DRINK = [0,1,2,2,2,3,3,3,4,5];
const WHISKY_IDLE = [0];

/** AXE */
const AXE_SPRITESHEET = new Image();
AXE_SPRITESHEET.src = "../data/axe-spritesheet.png";
const AXE_HEIGHT = 5000/5 | 0;
const AXE_WIDTH = 1000;

const AXE_ATTACK = [0,1,2,3,4];
const AXE_IDLE = [0];

/** TEQUILA */
const TEQUILA_SPRITESHEET = new Image();
TEQUILA_SPRITESHEET.src = "../data/tequila-spritesheet.png";
const TEQUILA_HEIGHT = 4200/6 | 0;
const TEQUILA_WIDTH = 1000;


const TEQUILA_DRINK = [0,1,2,2,2,3,3,3,4,5];
const TEQUILA_IDLE = [0];

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

    behavior() { }

    afterAnimation() { }
}

class Consumable extends Weapon{
    constructor(){
        super(0,1200,0);
    }
}

class Whisky extends Consumable{
    constructor(){
        super();
        this.idle = WHISKY_IDLE;
        this.use = WHISKY_DRINK;
    }

    render(ctx, frame){
        ctx.drawImage(WHISKY_SPRITESHEET, 0, frame * WHISKY_HEIGHT, WHISKY_WIDTH, WHISKY_HEIGHT, 350, 325-170, 200, 170); // TODO : make it clean (temporary, wait final textures)
    }
}

class Tequila extends Consumable {
    constructor(){
        super();
        this.idle = TEQUILA_IDLE;
        this.use = TEQUILA_DRINK;
    }

    render(ctx, frame){
        ctx.drawImage(TEQUILA_SPRITESHEET, 0, frame * TEQUILA_HEIGHT, TEQUILA_WIDTH, TEQUILA_HEIGHT, 350, 325-170, 200, 170); // TODO : make it clean (temporary, wait final textures)
    }
}

class Axe extends Weapon{
    constructor(){
        super(25,800,2.5);
        this.idle = AXE_IDLE;
        this.use = AXE_ATTACK;
    }
    
    render(ctx, frame){
        ctx.drawImage(AXE_SPRITESHEET, 0, frame * AXE_HEIGHT, AXE_WIDTH, AXE_HEIGHT, 400, 325-150, 170, 150); // TODO : make it clean (temporary, wait final textures)
    }
}

class Lighter extends Weapon{
    constructor(){
        super(0,0,0,0);
        // TODO : complete constructor
    }

    // TODO : add animation and rander methods
}
/**
 * Build a weapon of the specified type.
 * @param {string} type Weapon type
 * 
 * @returns A newly-built weapon of the specified type.
 */
export function buildWeapon(type,){
    switch(type){
        case 'axe':
            return new Axe();
        // TODO : add more
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


const FRAME_DELAY = 200;
const AXE_SPRITESHEET = new Image();
AXE_SPRITESHEET.src = "../data/whisky-spritesheet.png"; // TODO : change
const AXE_HEIGHT = 724/3 | 0;
const WALK = [0,1,2];

class Axe extends Weapon{
    constructor(){
        super(30,3,FRAME_DELAY*3,10);
        this.setAnimation(WALK);
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
        ctx.fillStyle = 'red';
        ctx.drawImage(AXE_SPRITESHEET, 0, ((this.animation[this.frame]) * AXE_HEIGHT), 240, 236, 400, 325-150, 170, 150);
    }
}
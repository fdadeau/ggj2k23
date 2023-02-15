/** Data to preload */
const data = {
    
    // spritesheets
    "axe-spritesheet": "./data/spritesheets/axe-spritesheet.png",
    "lighter-spritesheet": "./data/spritesheets/lighter-spritesheet.png",
    "tree-spritesheet": "./data/spritesheets/tree-spritesheet.png",
    "whisky-spritesheet": "./data/spritesheets/whisky-spritesheet.png",
    "tequila-spritesheet": "./data/spritesheets/tequila-spritesheet.png",
    "turnip-spritesheet": "./data/spritesheets/turnip-spritesheet.png",
    "dandelion-spritesheet": "./data/spritesheets/dandelion-spritesheet.png",
    "rabbit-spritesheet": "./data/spritesheets/rabbit-spritesheet.png",
    "filter-spritesheet": "./data/spritesheets/raymon-scar-spritesheet.png",
    "raymond-spritesheet": "./data/spritesheets/raymond-spritesheet.png",
    "dandelion-wiggle1-spritesheet": "./data/spritesheets/dandelion_wiggle1_spritesheet.png",
    "dandelion-wiggle2-spritesheet": "./data/spritesheets/dandelion_wiggle2_spritesheet.png",

    // images
    "wood": "./data/textures/wood.png",
    "hud-roots": "./data/images/hud-roots.png",
    "axe": "./data/images/axe.png",
    "heart": "./data/images/heart.png",
    "tequila": "./data/images/tequila.png",
    "timber": "./data/images/raymond.png",
    "whisky": "./data/images/whisky.png",
    "carrot": "./data/images/carrot.png",
    "rope": "./data/images/rope.png",
    "rope-menu": "./data/images/rope-menu.png",

    // lighter
    "lighter1": "./data/spritesheets/lighter-spritesheet.png",
    "lighter2": "./data/spritesheets/blow-spritesheet.png",
    "fire1": "./data/images/fire1.png",
    "fire2": "./data/images/fire2.png",
    "fire3": "./data/images/fire3.png",

    // textures 
    "wall1": "./data/textures/wall1.png",
    "wall2": "./data/textures/wall2.png",
    "wall3": "./data/textures/wall3.png",
    "wall4": "./data/textures/wall4.png",
    "wall5": "./data/textures/wall5.png",
    "wall6": "./data/textures/wall6.png",
    "wall7": "./data/textures/wall7.png",
    "wall8": "./data/textures/wall_rocks.png",
    "wall_diagonal": "./data/textures/wall_diagonal.png",
    "floor": "./data/textures/floor.png",

    // musics
    "ingame1": "./data/sounds/Musique_Calme_V3.mp3",
    "ingame2": "./data/sounds/Musique_dynamique_V3.mp3",
    "titleScreenMusic": "./data/sounds/title_screen_music.mp3",
    "defeatMusic": "./data/sounds/die_music.mp3",
    "victoryMusic":"./data/sounds/victory_music.mp3",
    
    // Titles, buttons and cinematics
    "titleScreen": "./data/title-screen.png",
    "woodTexture" : "./data/textures/wood.png",
    // 
    "logoGGJ": "./data/logos/logoGGJ.png",
    "logoOFNI": "./data/logos/logoOFNI.png",
    "logoDPS": "./data/logos/logoDPS.png",

    "intro1": "./data/cinematics/intro-1.png",
    "intro2": "./data/cinematics/intro-2.png",
    "intro3": "./data/cinematics/intro-3.png",
    "intro4": "./data/cinematics/intro-4.png",
    "intro5": "./data/cinematics/intro-5.png",
    "intro6": "./data/cinematics/intro-6.png",
    "intro6_2": "./data/cinematics/intro-6_2.png",
    "intro6_3": "./data/cinematics/intro-6_3.png",
    "intro7": "./data/cinematics/intro-7.png",
    // outro
    "outro1": "./data/cinematics/fin_1.png",
    "outro2": "./data/cinematics/fin_2_1.png",
    "outro3": "./data/cinematics/fin_2_2.png",
    "outro4": "./data/cinematics/fin_2_3.png",
    "outro5": "./data/cinematics/fin_3.png",
    "outro6": "./data/cinematics/fin_4.png",
    "outro7": "./data/cinematics/happy_bunny_fin.png",

    // Icons
    "wasd": "./data/icons/wasd.png",
    "left-click": "./data/icons/left-click.png",
    "right-click": "./data/icons/right-click.png",
    "scroll": "./data/icons/scroll.png",
    "key": "./data/icons/key.png",
    "mike": "./data/icons/mike.png",
    "home": "./data/icons/home.png",

    // Sounds
    "axeSound": "./data/sounds/axe.mp3",
    "drinkSound": "./data/sounds/glou.mp3",
    "drinkEndSound": "./data/sounds/huu.mp3",
    "walkSound": "./data/sounds/walk-bis.mp3",
    "woodSound": "./data/sounds/wood.mp3",
    "yeetBottleSound": "./data/sounds/yeetBottle.mp3",
    "hitPlayerSound": "./data/sounds/hurt.mp3",
    "crunch": "./data/sounds/crunch.mp3",
    "ouch": "./data/sounds/ouch.mp3",
    "foule": "./data/sounds/foule.mp3",
    'throw': "./data/sounds/throw.mp3",
    "whoosh": "./data/sounds/whoosh.mp3",
    "flamethrower": "./data/sounds/flamethrower.mp3",
    "breathing": "./data/sounds/breathing.mp3",
    "truck-start": "./data/sounds/truck-start.mp3",
    "wilhelm": "./data/sounds/wilhelm.mp3"
}

/***
 * Preload of resource files (images/sounds) 
 */
async function preload(callback) {
    let loaded = 0;
    const total = Object.keys(data).length;
    for (let i in data) {
        if (data[i].endsWith(".png") || data[i].endsWith(".jpg") || data[i].endsWith(".jpeg")) {
            data[i] = await loadImage(data[i]);
        }
        else {
            data[i] = await loadSound(data[i]);
        }
        loaded++;
        callback(loaded, total);
    }
}

function loadImage(path) {
    return new Promise(function(resolve, reject) {
        let img = new Image();
        img.onload = function() {
            resolve(this);
        }
        img.onerror = function() {
            reject(this);
        }
        img.src = path;
    });
}

function loadSound(path) {
    return new Promise(function(resolve, reject) {
        let audio = new Audio();
        audio.oncanplaythrough = function() {
            resolve(this);
        }
        audio.onerror = function() {
            reject(this);
        }
        audio.src = path;
    });    
}

export { preload, data };
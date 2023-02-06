/** Data to preload */
const data = {
    
    // spritesheets
    "axe-spritesheet": "./data/axe-spritesheet.png",
    "lighter-spritesheet": "./data/lighter-spritesheet.png",
    "tree-spritesheet": "./data/tree-spritesheet.png",
    "whisky-spritesheet": "./data/whisky-spritesheet.png",
    "tequila-spritesheet": "./data/tequila-spritesheet.png",
    "turnip-spritesheet": "./data/turnip-spritesheet.png",
    "dandelion-spritesheet": "./data/dandelion-spritesheet.png",
    "rabbit-spritesheet": "./data/rabbit-spritesheet.png",
    "filter-spritesheet": "./data/raymon-scar-spritesheet.png",
    "raymond-spritesheet": "./data/raymond-spritesheet.png",

    // images
    "wood": "./data/textures/wood.png",
    "hud-roots": "./data/hud-roots.png",
    "axe": "./data/images/axe.png",
    "heart": "./data/images/heart.png",
    "tequila": "./data/images/tequila.png",
    "timber": "./data/images/raymond.png",
    "whisky": "./data/images/whisky.png",
    "carrot": "./data/images/carrot.png",
    "rope": "./data/images/rope.png",

    // lighter
    "lighter1": "./data/lighter-spritesheet.png",
    "lighter2": "./data/blow-spritesheet.png",
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
    "logoGGJ": "./data/logoGGJ.png",
    "intro1": "./data/cinematics/intro-1.png",
    "intro2": "./data/cinematics/intro-2.png",
    "intro3": "./data/cinematics/intro-3.png",
    "intro4": "./data/cinematics/intro-4.png",
    "intro5": "./data/cinematics/intro-5.png",
    "intro6": "./data/cinematics/intro-6.png",
    "intro7": "./data/cinematics/intro-7.png",
    // outro
    // TO COME

    // Sounds
    "axeSound": "./data/sounds/axe.mp3",
    "drinkSound": "./data/sounds/glou.mp3",
    "drinkEndSound": "./data/sounds/huu.mp3",
    "walkSound": "./data/sounds/walk.mp3",
    "woodSound": "./data/sounds/wood.mp3",
    "yeetBottleSound": "./data/sounds/yeetBottle.mp3",
    "hitPlayerSound": "./data/sounds/roblox-death-sound-effect-bis.mp3"
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
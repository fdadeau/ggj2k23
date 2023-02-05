/** Data to preload */
const data = {
    
    // spritesheets
    "axe-spritesheet": "../data/axe-spritesheet.png",
    "lighter-spritesheet": "../data/lighter-spritesheet.png",
    "tree-spritesheet": "../data/tree-spritesheet.png",
    "whisky-spritesheet": "../data/whisky-spritesheet.png",

    // images
    "wood": "../data/wood.png",
    "hud-roots": "../data/hud-roots.png",
    "axe": "../data/images/axe.png",
    "heart": "../data/images/heart.png",
    "tequila": "../data/images/tequila.png",
    "timber": "../data/images/timber.jpeg",
    "whisky": "../data/images/whisky.png",

    // lighter
    "lighter1": "../data/lighter-spritesheet.png",
    "lighter2": "../data/blow-spritesheet.png",

    "fire1": "../data/images/fire1.png",
    "fire2": "../data/images/fire2.png",
    "fire3": "../data/images/fire3.png",

    // textures 
    "wall1": "../data/textures/wall1.png",
    "wall2": "../data/textures/wall2.png",
    "wall3": "../data/textures/wall3.png",
    "wall4": "../data/textures/wall4.png",
    "wall_diagonal": "../data/textures/wall_diagonal.png",
    "floor": "../data/textures/floor.png",

    // musics
    "ingame1": "../data/sounds/Musique_Calme_V3.mp3",
    "ingame2": "../data/sounds/Musique_dynamique_V3.mp3"

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
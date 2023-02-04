/** Data to preload */
const data = {
    
    // spritesheets
    "axe-spritesheet": "../data/axe-spritesheet.png",
    "lighter-spritesheet": "../data/lighter-spritesheet.png",
    "tree-spritesheet": "../data/tree-spritesheet.png",
    "whisky-spritesheet": "../data/whisky-spritesheet.png",
    "lighter-spritesheet": "../data/lighter-spritesheet.png",

    // images
    "wood": "../data/wood.png",
    "axe": "../data/images/axe.png",
    "heart": "../data/images/heart.png",
    "tequila": "../data/images/tequila.png",
    "timber": "../data/images/timber.jpeg",
    "whisky": "../data/images/whisky.png",

    // textures 
    "wall1": "../data/textures/wall1.png",
    "wall2": "../data/textures/wall2.png",
    "wall3": "../data/textures/wall3.png",
    "wall4": "../data/textures/wall4.png",
    "wall_diagonal": "../data/textures/wall_diagonal.png",
    "floor": "../data/textures/floor.png"
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
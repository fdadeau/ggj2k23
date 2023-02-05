
import { buildEnemy } from "./enemies.js";

import { buildPowerUp } from "./powerups.js";

const NB_WALL_TEXTURES = 7;


/*const MAP0 = [
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,1,2,0,0,0,0,0,1],
    [1,0,4,5,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,3,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,4,1,5,0,0,0,0,0,1],
    [1,0,1,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,0,1,1,1,1,1],
    [1,0,1,0,0,0,0,1,0,1,0,1,0,1,0,3,1,2,0,0,1,1,1,1],
    [1,0,1,0,0,0,0,1,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,1],
    [1,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1],
    [1,0,1,0,0,0,0,1,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,1],
    [1,0,1,0,0,0,0,1,0,0,0,0,0,0,0,1,1,0,0,0,1,1,1,1],
    [1,0,0,0,0,0,0,1,1,1,1,0,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1,1,1,1,1,0,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,1,1,1,1,1,0,1,1,1,1,0,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,0,1,1,1,1,0,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,0,0,0,0,0,0,0,0,1,1,0,1,1,0,0,0,0,0,1,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,1,0,0,1,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,1,1,0,1,1,0,0,0,0,0,1,1,0,1,1],
    [1,0,1,0,1,0,0,0,0,1,1,0,0,0,0,0,1,0,0,0,0,0,0,1],
    [1,0,0,1,0,0,0,0,0,1,1,0,1,1,0,0,0,0,0,1,1,0,1,1],
    [1,0,1,0,1,0,0,0,0,1,1,0,1,1,0,0,1,0,0,1,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,1,1,0,1,1,5,0,0,0,0,1,0,0,0,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
];*/

const MAP0 = [
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,0,0,0,0,1,1,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,1,1,5,0,0,0,1,0,0,0,0,0,1,0,4,1,5,0,1],
    [1,0,0,0,0,1,1,0,0,0,0,3,1,1,0,0,0,0,0,4,1,5,0,0,0,1,1,1,0,1],
    [1,0,0,0,0,1,1,1,1,5,0,0,0,0,0,0,1,0,0,1,1,1,0,0,0,3,1,2,0,1],
    [1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,3,1,2,0,1,0,0,1,0,0,1],
    [1,1,1,1,1,1,1,1,1,2,0,0,1,1,1,1,1,5,0,0,0,0,0,0,0,0,1,0,0,1],
    [1,1,1,1,1,2,0,0,0,0,0,0,1,0,0,0,3,1,5,0,1,0,4,1,1,1,1,5,0,1],
    [1,1,1,2,0,0,0,0,0,0,0,0,1,0,0,0,0,3,1,5,0,4,1,2,0,0,0,3,1,1],
    [1,1,2,0,0,4,1,1,5,0,0,0,1,1,1,1,5,0,3,1,1,1,2,0,4,1,5,0,0,1],
    [1,2,0,0,4,1,1,1,1,5,0,0,3,1,1,1,1,5,0,3,1,2,0,4,1,1,2,0,0,1],
    [1,0,0,4,1,1,1,1,1,1,5,0,0,3,1,1,1,2,0,0,1,0,4,1,1,2,0,1,0,1],
    [1,0,0,1,1,1,1,1,2,3,1,0,0,0,0,0,0,0,0,0,1,0,1,1,2,0,0,0,0,1],
    [1,0,1,1,1,0,0,0,0,0,3,5,0,0,0,0,0,0,0,0,1,0,1,0,0,0,1,5,0,1],
    [1,0,1,0,1,0,1,5,0,0,0,1,0,0,1,1,1,1,0,1,1,0,1,0,1,0,3,1,0,1],
    [1,0,0,0,1,0,1,1,1,0,0,1,0,0,1,0,0,1,0,0,1,0,1,0,1,5,0,0,0,1],
    [1,0,1,0,1,0,4,1,1,0,0,1,0,0,1,0,1,1,0,0,1,0,1,0,3,1,5,0,0,1],
    [1,0,1,1,1,1,1,1,1,0,0,1,0,0,1,0,1,1,0,4,1,1,1,5,0,1,1,1,1,1],
    [1,0,3,1,0,0,0,1,2,0,0,1,0,0,1,0,1,1,0,1,0,0,0,1,0,0,0,0,0,1],
    [1,0,0,3,1,0,1,2,0,1,0,1,0,0,1,0,1,1,0,1,0,1,1,1,5,0,1,1,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,1,0,1,1,0,0,0,0,1,0,1,0,0,1,0,0,1,0,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,0,0,1,1,1,1,0,1,0,1,0,1,2,0,4,1,0,1],
    [1,1,1,1,1,1,1,1,1,1,1,2,0,0,3,1,0,1,1,2,0,1,0,1,0,4,1,1,0,1],
    [1,1,1,1,1,1,1,1,1,1,2,0,0,0,0,1,0,0,0,0,0,0,0,0,0,1,0,0,0,1],
    [1,2,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,2,0,0,0,1],
    [1,0,0,4,1,1,1,1,1,1,1,0,5,0,0,0,0,0,0,0,0,0,0,0,0,0,4,1,5,1],
    [1,0,0,1,1,0,0,0,0,1,1,0,1,5,0,0,0,0,0,0,0,4,1,5,0,4,1,0,1,1],
    [1,0,0,3,1,1,1,0,1,1,0,0,0,3,1,1,1,1,1,1,1,1,0,1,1,1,0,0,0,1],
    [1,5,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
  ]

const MAP1 = [
    [1,1,1,1,1,1,1,1,1],
    [1,5,0,0,0,0,0,2,1],
    [1,0,0,0,0,0,0,0,1],
    [1,0,0,2,0,3,0,0,1],
    [1,0,0,0,0,0,0,0,1],
    [1,0,0,5,0,4,0,0,1],
    [1,0,0,0,0,0,0,0,1],
    [1,4,0,0,0,0,0,3,1],
    [1,1,1,1,1,1,1,1,1]
]


const ENEMIES2 = function() {

    /*
    // dino running around
    const dino0 = buildEnemy("dino", 3.5, 5.5, 0, 1);
    dino0.behavior = function() {
        if (!this.xTarget || !this.yTarget) {
            this.xTarget = 3.5;
            this.yTarget = 7.5;
            this.walk();
        }
        if ((this.x-this.xTarget)*(this.x-this.xTarget) + (this.y-this.yTarget)*(this.y-this.yTarget) < 0.1) {
            this.dirY = -this.dirY;
            this.yTarget += this.dirY * 4;
            this.angle = (this.angle + 180) % 360;
        }
    }.bind(dino0);

    // static dino
    const dino1 = buildEnemy("dino", 6.5, 4.5, 1, 0);

    return [dino0, dino1];*/
};

const ENEMIES4 = function() {

    // tree running around
    const tree0 = buildEnemy("dandelion", 3.5, 5.5, 0, 1);
    /*stree0.behavior = function() {
        if (!this.xTarget || !this.yTarget) {
            this.xTarget = 3.5;
            this.yTarget = 7.5;
            this.walk();
        }
        if ((this.x-this.xTarget)*(this.x-this.xTarget) + (this.y-this.yTarget)*(this.y-this.yTarget) < 0.1) {
            this.dirY = -this.dirY;
            this.yTarget += this.dirY * 4;
            this.angle = (this.angle + 180) % 360;
        }
    }.bind(tree0);*/

    // static tree
    const tree1 = buildEnemy("dandelion", 3.5, 10.5, 0, 1);

    // tree running around
    const turnip0 = buildEnemy("tree", 6.5, 16.5, 0, 1);
    

    // static tree
    const turnip1 = buildEnemy("tree", 4.5, 14.5, 0, 1);
    turnip1.behavior = function() {
        if (!this.xTarget || !this.yTarget) {
            this.xTarget = 4.5;
            this.yTarget = 14.5;
            this.walk();
        }
        if ((this.x-this.xTarget)*(this.x-this.xTarget) + (this.y-this.yTarget)*(this.y-this.yTarget) < 0.1) {
            this.dirY = -this.dirY;
            this.yTarget += this.dirY * 4;
            this.angle = (this.angle + 180) % 360;
        }
    }.bind(turnip1);
    
    // Whisky power up
    const whisky0 = buildPowerUp("whisky", 3.5, 20.5);
    const whisky1 = buildPowerUp("whisky", 3.5, 19.5);
    const whisky2 = buildPowerUp("whisky", 3.5, 18.5);
    const whisky3 = buildPowerUp("whisky", 3.5, 17.5);
    const whisky4 = buildEnemy("tree", 3.5, 13.5,0,0);

    // Tequila power up
    const tequila0 = buildPowerUp("tequila", 2.5, 20.5);

    // Uique carrot
    const carrot = buildPowerUp("carrot", 6.5, 20.5);

    // Uique rabbit and dialog
    const rabbit = buildPowerUp("rabbit", 10.5, 20.5);
    const dialog = buildPowerUp("dialog", 10.5, 20.5); // same position as rabit

    return [tree0, tree1, /*turnip1,*/ whisky0, whisky1, whisky2, whisky3, whisky4, tequila0, carrot, rabbit, dialog];
};

const ENEMIES3 = function() {

    // tree running around
    const tree0 = buildEnemy("dandelion", 3.5, 5.5, 0, 1);
    /*stree0.behavior = function() {
        if (!this.xTarget || !this.yTarget) {
            this.xTarget = 3.5;
            this.yTarget = 7.5;
            this.walk();
        }
        if ((this.x-this.xTarget)*(this.x-this.xTarget) + (this.y-this.yTarget)*(this.y-this.yTarget) < 0.1) {
            this.dirY = -this.dirY;
            this.yTarget += this.dirY * 4;
            this.angle = (this.angle + 180) % 360;
        }
    }.bind(tree0);*/

    // static tree
    const tree1 = buildEnemy("dandelion", 3.5, 10.5, 0, 1);

    // tree running around
    const turnip0 = buildEnemy("tree", 6.5, 16.5, 0, 1);
    

    // static tree
    const turnip1 = buildEnemy("tree", 4.5, 14.5, 0, 1);
    turnip1.behavior = function() {
        if (!this.xTarget || !this.yTarget) {
            this.xTarget = 4.5;
            this.yTarget = 14.5;
            this.walk();
        }
        if ((this.x-this.xTarget)*(this.x-this.xTarget) + (this.y-this.yTarget)*(this.y-this.yTarget) < 0.1) {
            this.dirY = -this.dirY;
            this.yTarget += this.dirY * 4;
            this.angle = (this.angle + 180) % 360;
        }
    }.bind(turnip1);
    
    // Whisky power up
    const whisky0 = buildPowerUp("whisky", 3.5, 20.5);
    const whisky1 = buildPowerUp("whisky", 3.5, 19.5);
    const whisky2 = buildPowerUp("whisky", 3.5, 18.5);
    const whisky3 = buildPowerUp("whisky", 3.5, 17.5);
    const whisky4 = buildEnemy("tree", 3.5, 13.5,0,0);

    // Tequila power up
    const tequila0 = buildPowerUp("tequila", 2.5, 20.5);

    // Uique carrot
    const carrot = buildPowerUp("carrot", 6.5, 20.5);

    // Uique rabbit and dialog
    const rabbit = buildPowerUp("rabbit", 10.5, 20.5);
    const dialog = buildPowerUp("dialog", 10.5, 20.5); // same position as rabit

    return [tree0, tree1, /*turnip1,*/ whisky0, whisky1, whisky2, whisky3, whisky4, tequila0, carrot, rabbit, dialog];
};




export const levels = {

    "demo": {
        player: { posX: 3.5, posY: 12.5, dirX: 0, dirY: 1 },
        map: invert(MAP0),
        textures: mkTextures(invert(MAP0)),
        enemies: ENEMIES2
    },
    "tree": {
        player: { posX: 2.5, posY: 26.5, dirX: 1, dirY: 0 },
        map: invert(MAP0),
        textures: mkTextures(invert(MAP0)),
        enemies: ENEMIES4
    },
    "test": {
        player: { posX: 2.5, posY: 2.5, dirX: 1, dirY: 0 },
        map: invert(MAP1),
        textures: mkTextures(invert(MAP0)),
        enemies: () => []
    }

}

function invert(m) {
    let r = [];
    for (let i=0; i < m[0].length; i++) {
        r[i] = [];
    }

    for (let i=0; i < m.length; i++) {
        let l = m.length - 1;
        for (let j=0; j < m[i].length; j++) {
            let c = m[0].length - 1;
            r[i][j] = m[l-j][i];
        }
    }
    return r;
}

function mkTextures(m) {
    let r = [];
    for (let i=0; i < m.length; i++) {
        r[i] = [];
        for (let j=0; j < m[i].length; j++) {
            r[i][j] = [Math.random() * NB_WALL_TEXTURES | 0, Math.random() * NB_WALL_TEXTURES | 0, Math.random() * NB_WALL_TEXTURES | 0, Math.random() * NB_WALL_TEXTURES | 0];
        }
    } 
    return r;
}
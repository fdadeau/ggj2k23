
import { buildEnemy } from "./enemies.js";

import { buildPowerUp } from "./powerups.js";

const MAP0 = [
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
];

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

    return [dino0, dino1];
};


const ENEMIES3 = function() {

    // tree running around
    const tree0 = buildEnemy("tree", 3.5, 5.5, 0, 1);
    tree0.behavior = function() {
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
    }.bind(tree0);

    // static tree
    const tree1 = buildEnemy("tree", 3.5, 10.5, 0, 1);

    // tree running around
    const turnip0 = buildEnemy("turnip", 6.5, 7.5, 0, 1);
    turnip0.behavior = function() {
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
    }.bind(turnip0);
    

    // static tree
    const turnip1 = buildEnemy("turnip", 4.5, 5.5, 0, 1);
    

    // Whisky power up
    const whisky0 = buildPowerUp("whisky", 3.5, 20.5, 0, 1);

    // Tequila power up
    const tequila0 = buildPowerUp("tequila", 2.5, 20.5, 0, 1);

    return [tree0, tree1, whisky0, tequila0, turnip0, turnip1];
};




export const levels = {

    "demo": {
        player: { posX: 3.5, posY: 12.5, dirX: 0, dirY: 1 },
        map: invert(MAP0),
        textures: mkTextures(MAP0),
        enemies: ENEMIES2
    },
    "tree": {
        player: { posX: 3.5, posY: 12.5, dirX: 0, dirY: 1 },
        map: invert(MAP0),
        textures: mkTextures(MAP0),
        enemies: ENEMIES3
    },
    "test": {
        player: { posX: 2.5, posY: 2.5, dirX: 1, dirY: 0 },
        map: invert(MAP1),
        textures: mkTextures(MAP0),
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
            r[i][j] = [Math.random() * 3 | 0, Math.random() * 3 | 0, Math.random() * 3 | 0, Math.random() * 3 | 0, Math.random() * 3 | 0];
        }
    } 
    return r;
}

import { buildEnemy } from "./enemies.js";

const MAP0 = [
    [4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,7,7,7,7,7,7,7,7],
    [4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,7,0,0,0,0,0,0,7],
    [4,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,7],
    [4,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,7],
    [4,0,3,0,0,0,0,0,0,0,0,0,0,0,0,3,7,0,0,0,0,0,0,7],
    [4,0,4,0,0,0,0,5,5,5,5,5,5,5,5,5,7,7,0,7,7,7,7,7],
    [4,0,5,0,0,0,0,5,0,5,0,5,0,5,0,5,7,0,0,0,7,7,7,1],
    [4,0,6,0,0,0,0,5,0,0,0,0,0,0,0,5,7,0,0,0,0,0,0,8],
    [4,0,7,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,7,7,7,1],
    [4,0,8,0,0,0,0,5,0,0,0,0,0,0,0,5,7,0,0,0,0,0,0,8],
    [4,0,0,0,0,0,0,5,0,0,0,0,0,0,0,5,7,0,0,0,7,7,7,1],
    [4,0,0,0,0,0,0,5,5,5,5,0,5,5,5,5,7,7,7,7,7,7,7,1],
    [6,6,6,6,6,6,6,6,6,6,6,0,6,6,6,6,6,6,6,6,6,6,6,6],
    [8,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,4],
    [6,6,6,6,6,6,0,6,6,6,6,0,6,6,6,6,6,6,6,6,6,6,6,6],
    [4,4,4,4,4,4,0,4,4,4,6,0,6,2,2,2,2,2,2,2,3,3,3,3],
    [4,0,0,0,0,0,0,0,0,4,6,0,6,2,0,0,0,0,0,2,0,0,0,2],
    [4,0,0,0,0,0,0,0,0,0,0,0,6,2,0,0,5,0,0,2,0,0,0,2],
    [4,0,0,0,0,0,0,0,0,4,6,0,6,2,0,0,0,0,0,2,2,0,2,2],
    [4,0,6,0,6,0,0,0,0,4,6,0,0,0,0,0,5,0,0,0,0,0,0,2],
    [4,0,0,5,0,0,0,0,0,4,6,0,6,2,0,0,0,0,0,2,2,0,2,2],
    [4,0,6,0,6,0,0,0,0,4,6,0,6,2,0,0,5,0,0,2,0,0,0,2],
    [4,0,0,0,0,0,0,0,0,4,6,0,6,2,0,0,0,0,0,2,0,0,0,2],
    [4,4,4,4,4,4,4,4,4,4,1,1,1,2,2,2,2,2,2,3,3,3,3,3]
];

const MAP1 = [
    [1,1,1,1,1,1,1,1,1],
    [1,5,0,0,0,0,0,2,1],
    [1,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,1],
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

    return [tree0, tree1];
};




export const levels = {

    "demo": {
        player: { posX: 3.5, posY: 12.5, dirX: 0, dirY: 1 },
        map: MAP0,
        enemies: ENEMIES2
    },
    "tree": {
        player: { posX: 3.5, posY: 12.5, dirX: 0, dirY: 1 },
        map: MAP0,
        enemies: ENEMIES3
    },
    "test": {
        player: { posX: 2.5, posY: 2.5, dirX: 1, dirY: 0 },
        map: MAP1,
        enemies: () => []
    }

}

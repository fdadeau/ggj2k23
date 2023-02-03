
import Player from "./player.js";

import { levels } from "./levels.js";

import { buildEnemy } from "./enemies.js";


export class Game {

    constructor() {

        this.paused = false;
        this.on2D = false;

        this.enemies = [];
        this.player = new Player();

        this.loadLevel("demo");
    }

    loadLevel(id) {
        let levelData = levels[id];
        this.enemies = levelData.enemies();
        this.player.initialize(levelData.player.posX, levelData.player.posY, levelData.player.dirX, levelData.player.dirY);
        this.map = levelData.map;
    }

    update(dt) {
        this.enemies.forEach(e => {
            e.update(dt);   // TODO add player for detecting collisions?
        });
        this.player.update(dt, this.map, this.enemies);
    }

   


    // Commands
    press(key) {
        switch (key) {
            case 'ArrowUp': 
            case 'KeyW':
                this.player.walk(1);
                break;
            case 'KeyS':
            case 'ArrowDown':
                this.player.walk(-0.5);
                break;
            case 'ArrowLeft': 
            case 'KeyA':
                this.player.strafe(-1);
                break;
            case 'ArrowRight':
            case 'KeyD':
                this.player.strafe(1);
                break;
            case 'KeyP':
                this.paused = !this.paused;
                break;
            case 'Semicolon':
                this.on2D = !this.on2D;
        }
    }
    release(key) {
        switch (key) {
            case 'KeyW':
            case 'KeyS':
            case 'ArrowUp': 
            case 'ArrowDown':
                this.player.stop1();
                break;
            case 'KeyA':
            case 'KeyD':
            case 'ArrowLeft':
            case 'ArrowRight':
                this.player.stop2()
                break;
            
        }
    }
    mouseMove(dx, dy) {
        this.player.moveHead(dx,dy);
    }

}
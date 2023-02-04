
import Player from "./player.js";

import { levels } from "./levels.js";

import { buildEnemy } from "./enemies.js";


const STORAGE_KEY_MOUSE = "ggj2k23-invert-mouse";

export class Game {

    constructor(hud) {

        this.paused = false;
        this.on2D = false;
        if (localStorage.getItem(STORAGE_KEY_MOUSE)) {
            this.inverted = 1*localStorage.getItem(STORAGE_KEY_MOUSE);
        }
        else {
            this.inverted = 1;
        }

        this.enemies = [];
        this.player = new Player();

        this.loadLevel("demo");
        this.hud = hud;
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

        //this.player.currentWeapon.update(dt);   // TODO remove (only debug)
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
                break;
            case 'KeyI':
                this.inverted *= -1;
                localStorage.setItem(STORAGE_KEY_MOUSE, this.inverted);
                break;
            case 'KeyE':
                this.player.attack();
                break;
            case 'Digit1':
                this.player.equipeAxe();
                this.hud.equipeAxe();
                break;
            case 'Digit2':
                this.player.equipeChainsaw();
                this.hud.equipeChainsaw();
                break;
            case 'Digit3':
                this.player.equipeWhisky();
                this.hud.equipeWhisky();
                break;
            case 'Space':
                let id = this.player.switchToNextWeapon();
                this.hud.equipeWeapon(id);
                break;
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
        this.player.moveHead(dx,dy*this.inverted);
    }

}
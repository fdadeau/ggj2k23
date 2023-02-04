
import Player from "./player.js";

import { levels } from "./levels.js";

/** Game states */
export const STATES = { LOADING: 0, PLAYING: 1, PAUSED: 2 };

export class Game {

    constructor() {
        this.state = STATES.LOADING;
        this.loading = { loaded: 0, total: 0 }

        this.paused = false;
        this.on2D = false;
        this.inverted = 1;
        
        this.enemies = [];
        this.player = new Player();
    }

    setLoadingProgress(loaded, total) {
        this.loading = { loaded, total };
        if (loaded == total) {
            this.loadLevel("tree");
            this.state = STATES.PLAYING;
        }
    }

    loadLevel(id) {
        let levelData = levels[id];
        this.enemies = levelData.enemies();
        this.player.initialize(levelData.player.posX, levelData.player.posY, levelData.player.dirX, levelData.player.dirY);
        this.map = levelData.map;
        this.textures = levelData.textures;
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
            case 'KeyB':
                this.player.lighting = (this.player.lighting == 2) ? 5 : 2;
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
                this.player.attack(this.enemies);
                break;
            case 'Digit1':
                this.player.equipeAxe();
                break;
            case 'Digit3':
                if(this.player.nbTequila > 0){
                    this.player.equipeTequila(); 
                }else{
                    this.player.equipeAxe();
                }
                break;
            case 'Digit2':
                if(this.player.nbWhisky > 0){
                    this.player.equipeWhisky();
                }else{
                    this.player.equipeAxe();
                }
                break;
            case 'Space':
                this.player.switchToNextWeapon();
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
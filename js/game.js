
import Player from "./player.js";

import { levels } from "./levels.js";

import { data } from "./preload.js";

/** Game states */
export const STATES = { LOADING: 0, WAITING_TO_START: 1, PLAYING_INTRO: 2, PLAYING: 3, PAUSE: 4, PLAYING_OUTRO: 5 };

export class Game {

    constructor() {
        this.state = STATES.LOADING;
        this.loading = { loaded: 0, total: 0 }

        this.paused = false;
        this.on2D = false;
        this.inverted = 1;
        
        this.enemies = [];
        this.player;
    }

    setLoadingProgress(loaded, total) {
        this.loading = { loaded, total };
        if (loaded == total) {
            this.state = STATES.WAITING_TO_START;
        }
    }

    start() {
        this.loadLevel("tree");
        this.state = STATES.PLAYING;
    }

    loadLevel(id) {
        let levelData = levels[id];
        this.enemies = levelData.enemies();
        this.player =  new Player();
        this.player.initialize(levelData.player.posX, levelData.player.posY, levelData.player.dirX, levelData.player.dirY);
        this.map = levelData.map;
        this.textures = levelData.textures;
        this.audio = data.ingame1;
        this.audio.loop = 1;
        this.audio.play();
    }

    update(dt) {
        if (this.state != STATES.PLAYING) {
            return false;
        }
        this.enemies.forEach((e,player) => {
            e.update(dt,this.player);   // TODO add player for detecting collisions?
        });
        this.player.update(dt, this.map, this.enemies);

        //this.player.currentWeapon.update(dt);   // TODO remove (only debug)
    }

   
    // Commands
    press(key) {
        if (this.state != STATES.PLAYING) {
            return;
        }
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
                this.player.lighter.toggle();
                break;
            case 'KeyL':
                this.player.lighter.blow(true);
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
            case 'KeyF':
                this.player.lighter.startBlowing();
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
        if (this.state != STATES.PLAYING) {
            return;
        }
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
            case 'KeyL':
                this.player.lighter.blow(false);
                break;  
            case 'KeyF':
                this.player.lighter.stopBlowing();
                break;  
        }
    }
    mouseMove(dx, dy) {
        if (this.state != STATES.PLAYING) {
            return;
        }
        this.player.moveHead(dx,dy*this.inverted);
    }

}
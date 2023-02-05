
import Player from "./player.js";

import { levels } from "./levels.js";

import { data } from "./preload.js";

import { GUI } from "./gui.js";

/** Game states */
export const STATES = { LOADING: 0, WAITING_TO_START: 1, PLAYING_INTRO: 2, PLAYING: 3, PAUSE: 4, PLAYING_OUTRO: 5, DEAD: 6, ARRIVED: 7 };

export class Game {

    constructor() {
        this.state = STATES.LOADING;
        this.loading = { loaded: 0, total: 0 }

        this.paused = false;
        this.on2D = false;
        this.inverted = 1;
        
        this.enemies = [];
        this.player;

        this.gui = new GUI(this.loading);
        this.currentLevel = 'tree';
    }

    setLoadingProgress(loaded, total) {
        this.loading = { loaded, total };
        if (loaded == total) {
            this.state = STATES.PLAYING_INTRO; // To change
        }
    }

    lookDead() {
        if (this.state == STATES.PLAYING && this.player.health <= 0) {
            this.state = STATES.DEAD;
        }
    }

    lookArrived() {
        if (this.state == STATES.PLAYING && this.player.arrived) {
            this.state = STATES.ARRIVED;
        }
    }

    start() {
        this.loadLevel();
        this.state = STATES.PLAYING;
    }

    loadLevel() {
        let levelData = levels[this.currentLevel];
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
        this.enemies.forEach((e) => {
            e.update(dt,this.player);   // TODO add player for detecting collisions?
        });
        this.player.update(dt, this.map, this.enemies);

        //this.player.currentWeapon.update(dt);   // TODO remove (only debug)

        /** If the player is dead */
        this.lookDead();
        this.lookArrived();
    }

   
    // Commands
    press(key) {
        if (this.state == STATES.PLAYING) {
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
                    this.player.switchToNextWeapon(-1);
                    break;
            }
        } else if (this.state == STATES.DEAD) {
            switch (key) {
                case 'Space' :
                case 'Enter' :
                    this.resetGame();
                break;
            }
        } else if (this.state == STATES.ARRIVED) {
            switch (key) {
                case 'Space' :
                case 'Enter' :
                    this.state = STATES.PLAYING_OUTRO;
                break;
            }
        }
    }

    resetGame() {
        this.gui.gameDead = false;
        this.start();
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
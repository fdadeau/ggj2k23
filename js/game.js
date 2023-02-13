
import Player from "./player.js";

import { levels } from "./levels.js";

import { audio } from "./audio.js";


/** Game states */
export const STATES = { LOADING: 0, WAITING_TO_START: 1, PLAYING_INTRO: 2, PLAYING: 3, PAUSE: 4, PLAYING_OUTRO: 5, DEAD: 6, FINISHED: 7, TITLE: 8, CONTROLS: 9, CREDITS: 10 };

export class Game {

    constructor() {
        this.state = STATES.LOADING;
        this.loading = { loaded: 0, total: 0 }

        this.paused = false;
        this.on2D = false;
        this.inverted = 1;
        
        this.enemies = [];
        this.player;

        this.currentLevel = 'tree';
    }

    setLoadingProgress(loaded, total) {
        this.loading = { loaded, total };
        if (loaded == total) {
            this.state = STATES.WAITING_TO_START;
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
        audio.reset();
        audio.playMusic("ingame1", 0.4);
    }

    update(dt) {
        if (this.state != STATES.PLAYING) {
            return false;
        }

        /** If the player is dead */
        if (this.player.health <= 0) {
            this.state = STATES.DEAD;
            return;
        }
        if (this.player.hasExited) {
            this.state = STATES.FINISHED;
            return;
        }

        this.player.update(dt, this.map, this.enemies);

        this.enemies.forEach((e) => {
            e.update(dt, this.player, this.map);   
        });


        
    }

   
    // Commands
    press(key) {
        if (this.state == STATES.PLAYING) {
            switch (key instanceof KeyboardEvent?key.code:key) {
                case 'ArrowUp': 
                case 'KeyW':
                    if(key instanceof KeyboardEvent && key.repeat){
                        return;
                    }
                    this.player.walk(1);
                    break;
                case 'KeyS':
                case 'ArrowDown':
                    if(key instanceof KeyboardEvent && key.repeat){
                        return;
                    }
                    this.player.walk(-0.5);
                    break;
                case 'ArrowLeft': 
                case 'KeyA':
                    if(key instanceof KeyboardEvent && key.repeat){
                        return;
                    }
                    this.player.strafe(-1);
                    break;
                case 'ArrowRight':
                case 'KeyD':
                    if(key instanceof KeyboardEvent && key.repeat){
                        return;
                    }
                    this.player.strafe(1);
                    break;
                case 'KeyL':
                    if(key instanceof KeyboardEvent && key.repeat){
                        return;
                    }
                    this.player.lighter.blow(true);
                    break;
                case 'KeyP':
                    this.state = STATES.PAUSE;
                    audio.pause();
                    this.player.stop1();
                    this.player.stop2();
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
            switch (key instanceof KeyboardEvent?key.code:key) {
                case 'Space' :
                case 'Enter' :
                    this.resetGame();
                break;
            }
        }
         else if(this.state == STATES.PAUSE && key.code == 'KeyP') {
            this.state = STATES.PLAYING;
            audio.resume();
        }
    }

    wheel(dY) {
        if (dY > 0) {
            this.player.switchToNextWeapon(-1);
        }
        else {
            this.player.switchToNextWeapon(1);
        }

    }

    resetGame() {
        this.state = STATES.PLAYING;
        this.start();
    }

    release(key) {
        if (this.state != STATES.PLAYING) {
            return;
        }
        switch (key) {
            case 'KeyW':
            case 'ArrowUp': 
                if (this.player.speed > 0) {
                    this.player.stop1();    
                }
                break;
            case 'KeyS':
            case 'ArrowDown':
                if (this.player.speed < 0) {
                    this.player.stop1();
                }
                break;
            case 'KeyA':
            case 'ArrowLeft':
                if (this.player.translSpeed < 0) {
                    this.player.stop2()
                }
                break;
            case 'KeyD':
            case 'ArrowRight':
                if (this.player.translSpeed > 0) {
                    this.player.stop2()
                }
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
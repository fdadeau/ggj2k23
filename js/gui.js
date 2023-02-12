import { audio } from "./audio.js";
import { data } from "./preload.js";

import { Engine } from "./engine.js";
import { STATES } from "./game.js";

// Assuming 640x400 (10/16 ratio) 

/** Screen width */
export const WIDTH = 640;
/** Screen height */
export const HEIGHT = WIDTH * 10 / 16;

const DEBUG = false;

const BUTTON_HEIGHT = 50;
const BUTTON_WIDTH = 300;

const BUTTON_PLAY = {
    x: (WIDTH / 2 - BUTTON_WIDTH / 2),
    y: 210,
    width: BUTTON_WIDTH,
    height: BUTTON_HEIGHT,
    text: "Play"
}

const BUTTON_CONTROLS = {
    x: (WIDTH / 2 - BUTTON_WIDTH / 2),
    y: 270,
    width: BUTTON_WIDTH,
    height: BUTTON_HEIGHT,
    text: "Controls"
}

const BUTTON_CREDITS = {
    x: (WIDTH / 2 - BUTTON_WIDTH / 2),
    y: 330,
    width: BUTTON_WIDTH,
    height: BUTTON_HEIGHT,
    text: "Credits"
}


export class GUI {

    constructor(game, cvs) {
        this.game = game;
        this.time = 0;

        // 2D context 
        this.ctx = cvs.getContext("2d");

        // 2.5D engine
        this.engine = new Engine(cvs);

        /** Framerate information */
        this.framerate = 60;
    }


    render() {

        switch (this.game.state) {
            case STATES.LOADING:
                this.loading(this.ctx);
                return;
            case STATES.WAITING_TO_START:
                if (this.engine.textures == null) {
                    this.engine.initialize();
                }
                this.waitingToStart(this.ctx);
                return;
            case STATES.TITLE:
                this.showTitleScreen(this.ctx);
                return;
            case STATES.CONTROLS:
                this.showControls(this.ctx);
                return;
            case STATES.CREDITS:
                this.showCredits(this.ctx);
                return;
            case STATES.PLAYING_INTRO:
                this.playIntro(this.ctx);
                return;
            case STATES.FINISHED:
                this.finished(ctx, this.game.player.hasExited);
                return;
            case STATES.PLAYING_OUTRO:
                this.playOutro(this.ctx);
                return;
            case STATES.PAUSE:
            case STATES.DEAD:
            case STATES.PLAYING: 
                if (this.game.on2D) {
                    this.engine.render2D(this.game);
                }
                else {
                    // 2.5D rendering
                    this.engine.render(this.game);
                    // also render HUD
                    this.game.player.render(this.ctx);
                }
                if (this.game.state == STATES.DEAD) {
                    this.dead(this.ctx);
                }
                else if (this.game.state == STATES.PAUSE) {
                    this.pause(this.ctx);
                }
                return;
        }
 
        // print framerate & debug info
        this.ctx.fillStyle = "white";
        DEBUG && this.ctx.fillText(this.framerate, 10, 10);
        DEBUG && this.ctx.fillText(game.player.getInfos(), 10, 20);        
    }


    /** Loading screen */
    loading(ctx) {
        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, WIDTH, HEIGHT);
        ctx.fillStyle = '#fff';
        ctx.font = "18px pixel-bit-advanced";
        ctx.textAlign = "center";
        ctx.fillText(`Loading assets: ${this.game.loading.loaded * 100 / this.game.loading.total | 0} %...`, WIDTH / 2, HEIGHT/2);
    }

    showTitleScreen(ctx) {
        // Background image
        ctx.drawImage(data.titleScreen, 0, 0, WIDTH, HEIGHT);

        // Buttons
        ctx.font = "26px pixel-bit-advanced";
        ctx.textAlign = "center";
        ctx.fillStyle = '#fff';
        [BUTTON_PLAY, BUTTON_CONTROLS, BUTTON_CREDITS].forEach((b,i,a) => {
            ctx.drawImage(data.woodTexture, b.x, b.y, b.width, b.height);
            ctx.strokeRect(b.x, b.y, b.width, b.height);
            ctx.fillText(b.text, b.x + b.width/2, b.y + b.height - 26/2);
        });
        ctx.drawImage(data.logoGGJ, WIDTH - 100, HEIGHT - 100, 90, 90);
    }

    clickButton(clicX, clicY) {
        // If we play
        if (this.clicOnButton(clicX, clicY, BUTTON_PLAY)) {
            if (!document.pointerLockElement) {
                document.getElementById("cvs").requestPointerLock({ unadjustedMovement: true });
            }
            //data['titleScreenMusic'].pause();
            this.game.state = STATES.PLAYING_INTRO;
        }
        // If we see the controls
        else if (this.clicOnButton(clicX, clicY, BUTTON_CONTROLS)) {
            this.game.state = STATES.CONTROLS;
        }
        // If we see the credits
        else if (this.clicOnButton(clicX, clicY, BUTTON_CREDITS)) {
            this.game.state = STATES.CREDITS;
        }
    }

    clicOnButton(clicX, clicY, BUTTON) {
        return clicX >= BUTTON.x && clicX <= BUTTON.x + BUTTON.width && clicY >= BUTTON.y && clicY <= BUTTON.y + BUTTON.height;
    }

    showControls(ctx) {
        // Theme
        this.drawMenuTheme(ctx, 'Controls');
        ctx.textAlign = "left";
        
        // WASD / arrows
        ctx.drawImage(data.wasd, 15, 140, 80, 80);
        ctx.fillStyle = '#ffd728';
        ctx.font = "15px pixel-bit-advanced";
        ctx.fillText('WASD / arrows', 120, 170);
        ctx.fillStyle = '#fff';
        ctx.font = "11.5px pixel-bit-advanced";
        ctx.fillText('Move', 120, 200);

        // Left click / L
        ctx.drawImage(data["left-click"], 15, 240, 35, 40);
        ctx.drawImage(data.key, 60, 240, 40, 40);
        ctx.fillText('L', 75, 267);
        ctx.fillStyle = '#ffd728';
        ctx.font = "15px pixel-bit-advanced";
        ctx.fillText('Left click / L', 120, 250);
        ctx.fillStyle = '#fff';
        ctx.font = "11.5px pixel-bit-advanced";
        ctx.fillText('Use the lighter', 120, 280);

        // Right click / E
        ctx.drawImage(data["right-click"], 15, 320, 35, 40);
        ctx.drawImage(data.key, 60, 320, 40, 40);
        ctx.fillText('E', 75, 347);
        ctx.fillStyle = '#ffd728';
        ctx.font = "15px pixel-bit-advanced";
        ctx.fillText('Right click / E', 120, 330);
        ctx.fillStyle = '#fff';
        ctx.font = "11.5px pixel-bit-advanced";
        ctx.fillText('Attack / equip', 120, 360);

        // Root separator
        ctx.drawImage(data['hud-roots'], WIDTH / 2, HEIGHT / 2 - 70, 10, 250);

        // Scroll / space
        ctx.drawImage(data.scroll, 340, 160, 35, 40);
        ctx.drawImage(data.key, 380, 170, 50, 15);
        ctx.fillStyle = '#ffd728';
        ctx.font = "15px pixel-bit-advanced";
        ctx.fillText('Scroll / space', 450, 170);
        ctx.fillStyle = '#fff';
        ctx.font = "11.5px pixel-bit-advanced";
        ctx.fillText('Change equipment', 450, 200);

        // F / blow
        ctx.drawImage(data.key, 385, 240, 40, 40);
        ctx.fillText('F', 400, 267);
        ctx.drawImage(data.mike, 345, 242, 25, 35);
        ctx.fillStyle = '#ffd728';
        ctx.font = "15px pixel-bit-advanced";
        ctx.fillText('F / blow (mike)', 450, 250);
        ctx.fillStyle = '#fff';
        ctx.font = "11.5px pixel-bit-advanced";
        ctx.fillText('Blow on the lighter', 450, 280);

         // I
        ctx.drawImage(data.key, 385, 320, 40, 40);
        ctx.fillText('I', 400, 347);
        ctx.fillStyle = '#ffd728';
        ctx.font = "15px pixel-bit-advanced";
        ctx.fillText('I', 450, 330);
        ctx.fillStyle = '#fff';
        ctx.font = "11.5px pixel-bit-advanced";
        ctx.fillText('Invert mouse', 450, 360);
    }


    showCredits(ctx) {
        // Theme
        this.drawMenuTheme(ctx, 'Credits');

        // Coding
        ctx.fillStyle = '#ffd728';
        ctx.font = "25px pixel-bit-advanced";
        ctx.fillText('Coding', 170, 160);
        ctx.fillStyle = '#fff';
        ctx.font = "20px pixel-bit-advanced";
        ctx.fillText('Fred Dadeau', 170, 200);
        ctx.fillText('Robin Grappe', 170, 230);
        ctx.fillText('Tayeb Hakkar', 170, 260);

        // Music
        ctx.fillStyle = '#ffd728';
        ctx.font = "25px pixel-bit-advanced";
        ctx.fillText('Music', 170, 330);
        ctx.fillStyle = '#fff';
        ctx.font = "20px pixel-bit-advanced";
        ctx.fillText('Lancelot Vega', 170, 370);

        // Root separator
        ctx.drawImage(data['hud-roots'], WIDTH / 2, 130, 10, 250);

        // Game Art
        ctx.fillStyle = '#ffd728';
        ctx.font = "25px pixel-bit-advanced";
        ctx.fillText('Game Art', 480, 160);
        ctx.fillStyle = '#fff';
        ctx.font = "20px pixel-bit-advanced";
        ctx.fillText('Marie-Almina', 480, 200);
        ctx.fillText('Gindre', 480, 230);
        ctx.fillText('Elea Jacquin', 480, 260);

        // Thanks to
        ctx.fillStyle = '#ffd728';
        ctx.font = "25px pixel-bit-advanced";
        ctx.fillText('Thanks to :', 480, 330);
        ctx.fillStyle = '#fff';
        ctx.font = "20px pixel-bit-advanced";
        // ctx.fillText('OFNI', WIDTH / 3.5 * 2.3, HEIGHT/2 + 150);
        // ctx.fillText('DPS', WIDTH / 3.5 * 2.3, HEIGHT/2 + 180);

        //Logos
        ctx.drawImage(data.logoOFNI, 380, 350, 100, 28);
        ctx.drawImage(data.logoDPS, 500, 350, 80, 28);
    }

    drawMenuTheme(ctx, title) {
        ctx.textAlign = "center";

        // Background image
        for(let i = 0; i < 4; i++) {
            ctx.drawImage(data.wood, 0, HEIGHT / 4 * i, WIDTH, HEIGHT / 4);
        }

        // Hanging ropes
        ctx.drawImage(data["rope-menu"], WIDTH / 3, -45, 20, 100);
        ctx.drawImage(data["rope-menu"], (WIDTH / 3) * 2 - 25, -45, 20, 100);

        // Title text
        ctx.textAlign = "center";
        ctx.fillStyle = '#fff';
        ctx.font = "50px pixel-bit-advanced";
        ctx.fillText(title, WIDTH / 2, HEIGHT/2 - 100);
        ctx.fillStyle = '#fff';

        // Home
        ctx.drawImage(data.home, 15, 15, 40, 40);
        ctx.font = "12px pixel-bit-advanced";
        ctx.fillText('click', 36, 75);
    }

    /** Waiting to start screen */
    waitingToStart(ctx) {
        ctx.textAlign = "center";
        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, WIDTH, HEIGHT);
        ctx.fillStyle = '#fff';
        ctx.font = "23px pixel-bit-advanced";
        ctx.fillText("Loading complete", WIDTH / 2, HEIGHT/2 - 50);
        ctx.fillText("Double click to start",  WIDTH/2, HEIGHT/2 +50);
    }

    /** Dead screen */
    dead(ctx) {
        ctx.globalAlpha = 0.25;
        ctx.textAlign = "center";
        ctx.fillStyle = '#f00';
        ctx.fillRect(0, 0, WIDTH, HEIGHT);
        ctx.globalAlpha = 1;
        ctx.font = "35px pixel-bit-advanced";
        ctx.fillText("You've been", WIDTH / 2, HEIGHT/2 - 50);
        ctx.font = "45px pixel-bit-advanced";
        ctx.fillText("DANDELIONED", WIDTH / 2, HEIGHT/2);
        ctx.fillStyle = '#fff';
        ctx.font = "23px pixel-bit-advanced";
        ctx.fillText("Press ENTER or SPACE to restart", WIDTH / 2, HEIGHT/2 + 75);
    }

    /** Pause screen */
    pause(ctx) {
        ctx.globalAlpha = 0.25;
        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, WIDTH, HEIGHT);
        ctx.globalAlpha = 1;
        ctx.fillStyle = '#fff';
        ctx.font = "35px pixel-bit-advanced";
        ctx.fillText("|| PAUSE", WIDTH / 2 - 110, HEIGHT/2 - 50);
        ctx.font = "23px pixel-bit-advanced";
        ctx.fillText("Press P to resume", WIDTH / 2 - 170, HEIGHT/2 + 20);
    }
    
    /** Winning screen */
    finished(ctx, won) {
        audio.pause();
        this.game.state = STATES.PLAYING_OUTRO;
        this.end = won;
        this.showOutro = false;
    }

    /** Intro animation */
    playIntro(ctx) {
        let now = Date.now();
        if (!this.showIntro) {
            this.showIntro = true;
            this.time = now + 1000;
            this.step = 0;
            document.querySelector("canvas").classList.add("fade");
            ctx.textAlign = "center";
            ctx.fillStyle = "white";
        }
        if (now < this.time) {
            return;
        }
        this.step++
        if (this.step < INTRO.length) {
            INTRO[this.step](this, ctx, now);
        }
    }

    /** Outro animation */
    playOutro(ctx) {
        let now = Date.now();
        if (!this.showOutro) {
            this.showOutro = true;
            this.time = now + 1000;
            this.step = -1;
            document.querySelector("canvas").classList.add("fade");
            ctx.textAlign = "center";
            ctx.fillStyle = "white";
        }
        if (now < this.time) {
            return;
        }
        this.step++
        if (this.step < OUTRO.length) {
            OUTRO[this.step](this, ctx, now);
        }
    }
}


const INTRO = [
    (t,ctx,now) => {
        t.time = now + 2000;
        drawOldStyle(ctx);
        ctx.font = "40px pixel-bit-advanced";
        ctx.textAlign = "center";
        ctx.fillText("A few moments later...", WIDTH / 2, HEIGHT / 2);
    },
    (t,ctx,now) => {
        t.time = now + 3000;
        document.querySelector("canvas").classList.remove("fade");
        ctx.drawImage(data["intro1"], 0, 0, WIDTH, HEIGHT);
        audio.playSound("woodSound", 0, 0.4, true);
    },
    (t,ctx,now) => {
        t.time = now + 3000;
        drawOldStyle(ctx);
        ctx.textAlign = "center";
        ctx.font = "40px pixel-bit-advanced";
        ctx.fillText("Hum... I'm thirsty!", WIDTH / 2, HEIGHT / 2);
        audio.pause(0);
    },
    (t,ctx,now) => {
        t.time = now + 1000;
        audio.playSound("drinkSound", 0, 0.4);
    },
    (t,ctx,now) => {
        t.time = now + 1000;
        audio.playSound("drinkSound", 0, 0.4);
    },
    (t,ctx,now) => {
        t.time = now + 1000;
        audio.playSound("drinkSound", 0, 0.4);
    },
    (t,ctx,now) => {
        t.time = now + 3000;
        audio.playSound("drinkEndSound", 0, 0.4);
    },
    (t,ctx,now) => {
        t.time = now + 2000;
        ctx.drawImage(data["intro2"], 0, 0, WIDTH, HEIGHT);
        audio.playSound("crunch", 0, 0.6);
    },
    (t,ctx,now) => {
        t.time = now + 3000;
        drawOldStyle(ctx);
        ctx.textAlign = "center";
        ctx.font = "40px pixel-bit-advanced";
        ctx.fillText('Oupsi...', WIDTH / 2, HEIGHT / 2);
    },
    (t,ctx,now) => {
        t.time = now + 3000;
        ctx.drawImage(data["intro3"], 0, 0, WIDTH, HEIGHT);
        audio.playSound("foule", 0, 0.4, false);
    },
    (t,ctx,now) => {
        t.time = now + 2000;
        drawOldStyle(ctx);
        ctx.textAlign = "center";
        ctx.font = "40px pixel-bit-advanced";
        ctx.fillText('Excuse us!', WIDTH / 2, HEIGHT / 2);
    },
    (t,ctx,now) => {
        t.time = now + 1000;
        ctx.drawImage(data["intro4"], 0, 0), WIDTH, HEIGHT;
    },
    (t,ctx,now) => {
        t.time = now + 2000;
        drawOldStyle(ctx);
        ctx.textAlign = "center";
        ctx.font = "40px pixel-bit-advanced";
        ctx.fillText('Hu?!', WIDTH / 2, HEIGHT / 2);
    },
    (t,ctx,now) => {
        t.time = now + 1000;
        ctx.drawImage(data["intro5"], 0, 0, WIDTH, HEIGHT);
    },
    (t,ctx,now) => {
        t.time = now + 500;
        ctx.drawImage(data["intro6"], 0, 0, WIDTH, HEIGHT);
    },
    (t,ctx,now) => {
        t.time = now + 500;
        ctx.drawImage(data["intro6_2"], 0, 0, WIDTH, HEIGHT);
    },
    (t,ctx,now) => {
        t.time = now + 2000;
        drawOldStyle(ctx);
        ctx.fillText('AAAaaaaaaahh!', WIDTH / 2, HEIGHT / 2);
    },
    (t,ctx,now) => {
        t.time = now + 300;
        ctx.drawImage(data["intro6_3"], 0, 0, WIDTH, HEIGHT);
    },
    (t,ctx,now) => {
        t.time = now + 300;
        ctx.drawImage(data["intro6"], 0, 0, WIDTH, HEIGHT);
    },
    (t,ctx,now) => {
        t.time = now + 300;
        ctx.drawImage(data["intro6_2"], 0, 0, WIDTH, HEIGHT);
    },
    (t,ctx,now) => {
        t.time = now + 300;
        ctx.drawImage(data["intro6_3"], 0, 0, WIDTH, HEIGHT);
    },
    (t,ctx,now) => {
        t.time = now + 300;
        ctx.drawImage(data["intro6"], 0, 0, WIDTH, HEIGHT);
    },
    (t,ctx,now) => {
        t.time = now + 300;
        ctx.drawImage(data["intro6_2"], 0, 0, WIDTH, HEIGHT);
    },
    (t,ctx,now) => {
        t.time = now + 300;
        ctx.drawImage(data["intro6_3"], 0, 0, WIDTH, HEIGHT);
    },
    (t,ctx,now) => {
        t.time = now + 300;
        ctx.drawImage(data["intro6"], 0, 0, WIDTH, HEIGHT);
    },
    (t,ctx,now) => {
        t.time = now + 2000;
        ctx.drawImage(data["intro7"], 0, 0, WIDTH, HEIGHT);
        audio.playSound("throw", 0, 0.5, false);
    },
    (t,ctx,now) => {
        t.time = now + 2000;
        drawOldStyle(ctx);
        ctx.textAlign = "center";
        ctx.font = "40px pixel-bit-advanced";
        ctx.fillText('So long,', WIDTH / 2, HEIGHT / 2 - 50);
        ctx.fillText('M****r F****r!', WIDTH / 2, HEIGHT / 2 + 50);
    },
    (t,ctx,now) => {
        t.time = now + 3000;
        document.querySelector("canvas").classList.add("fade");
    },
    (t,ctx,now) => {
        ctx.clearRect(0,0,WIDTH,HEIGHT);
        t.time = now + 1000;
        audio.playSound("ouch", "player", 0.4);
    },
    (t) => {
        t.game.start();        
        document.querySelector("canvas").classList.remove("fade");
    }
];


const OUTRO = [
    (t, ctx, now) => {
        t.time = now + 2000;
        ctx.drawImage(data["outro1"], 0, 0, WIDTH, HEIGHT);
        audio.playSound("breathing", 0, 0.4, false);
        document.querySelector("canvas").classList.remove("fade");
    }, 
    (t,ctx,now) => {
        t.time = now + 1000;
        audio.playSound(t.end == 1 ? "victoryMusic" : "defeatMusic", 1, 0.4, false);
    },
    (t,ctx,now) => {
        t.time = now + 1000;
        ctx.drawImage(data["outro2"], 0, 0, WIDTH, HEIGHT);
    },
    (t,ctx,now) => {
        t.time = now + 2500;
        audio.playSound("truck-start", 0, 0.4, false);
    },
    (t,ctx,now) => {
        t.time = now + 500;
        ctx.drawImage(data["outro3"], 0, 0, WIDTH, HEIGHT);
        
    },
    (t,ctx,now) => {
        t.time = now + 1000;
        ctx.drawImage(data["outro4"], 0, 0, WIDTH, HEIGHT);
    },
    (t,ctx,now) => {
        t.time = now + (t.end == 1 ? 6000 : 4000);
        drawOldStyle(ctx);
        ctx.textAlign = "center";
        ctx.font = "40px pixel-bit-advanced";
        ctx.fillText('GAME OVER', WIDTH / 2, HEIGHT / 2 - 80);
        ctx.fillText('THANK YOU', WIDTH / 2, HEIGHT / 2 + 50);
        ctx.fillText('FOR PLAYING!', WIDTH / 2, HEIGHT / 2 + 120);
    },
    (t,ctx,now) => {
        if (t.end == 2) {
            t.time = now + 2000;
            ctx.drawImage(data["outro5"], 0, 0, WIDTH, HEIGHT);
        }
        else {
            ctx.drawImage(data["outro7"], 0, 0, WIDTH, HEIGHT);            
        }
    },
    (t,ctx,now) => {
        if (t.end == 2) {
            ctx.drawImage(data["outro6"], 0, 0, WIDTH, HEIGHT);
        }
    }  
]

function drawOldStyle(ctx) {
    ctx.clearRect(0, 0, WIDTH, HEIGHT);
    ctx.strokeStyle = "#FFFFFF"; 
    ctx.lineWidth = 4;
    ctx.fillStyle = "#FFFFFF";
    // top-left
    ctx.beginPath();
    ctx.moveTo(20, 50);
    ctx.lineTo(20, 20);
    ctx.lineTo(50, 20);
    ctx.stroke();
    // bottom-left
    ctx.beginPath();
    ctx.moveTo(20, HEIGHT-50);
    ctx.lineTo(20, HEIGHT-20);
    ctx.lineTo(50, HEIGHT-20);
    ctx.stroke();
    // top-right
    ctx.beginPath();
    ctx.moveTo(WIDTH - 20, 50);
    ctx.lineTo(WIDTH - 20, 20);
    ctx.lineTo(WIDTH - 50, 20);
    ctx.stroke();
    // bottom-left
    ctx.beginPath();
    ctx.moveTo(WIDTH - 20, HEIGHT-50);
    ctx.lineTo(WIDTH - 20, HEIGHT-20);
    ctx.lineTo(WIDTH - 50, HEIGHT-20);
    ctx.stroke();
} 
import { data } from "./preload.js";

import { STATES } from "./game.js";

import { audio } from "./audio.js";

// Assuming 640x400 (10/16 ratio) 

/** Screen width */
export const WIDTH = 640;
/** Screen height */
export const HEIGHT = WIDTH * 10 / 16;

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

const OUTRO_IMG = new Image();
// OUTRO_IMG.src = "./data/some-outro.png"; // To change
const OUTRO_HEIGHT = 15200/19 | 0;
const OUTRO_WIDTH = 800;

const ANIM_DELAY = 100;

const PICS_DELAY = 3000;

export class GUI {

    constructor(game) {
        this.game = game;
        this.time = 0;
        //this.gameDead = false;
        //this.gameArrived = false;
        //this.showIntro = false;
        //this.showOutro = false;
    }

    /** Loading screen */
    loading(ctx) {
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, WIDTH, HEIGHT);
        ctx.fillStyle = '#FFFFFF';
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
        ctx.fillStyle = '#FFFFFF';
        [BUTTON_PLAY, BUTTON_CONTROLS, BUTTON_CREDITS].forEach((b,i,a) => {
            ctx.drawImage(data.woodTexture, b.x, b.y, b.width, b.height);
            ctx.fillText(b.text, b.x + b.width/2, b.y + b.height - 26/2);
        });
        ctx.drawImage(data.logoGGJ, WIDTH - 100, HEIGHT - 100, 90, 90);
    }

    clickButton(clicX, clicY) {
        // If we play
        if (clicX >= BUTTON_PLAY.x && clicX <= BUTTON_PLAY.x + BUTTON_PLAY.width && clicY >= BUTTON_PLAY.y && clicY <= BUTTON_PLAY.y + BUTTON_PLAY.height) {
            if (!document.pointerLockElement) {
                document.getElementById("cvs").requestPointerLock({ unadjustedMovement: true });
            }
            //data['titleScreenMusic'].pause();
            this.game.state = STATES.PLAYING_INTRO;
        }
        // If we see the controls
        else if (clicX >= BUTTON_CONTROLS.x && clicX <= BUTTON_CONTROLS.x + BUTTON_CONTROLS.width && clicY >= BUTTON_CONTROLS.y && clicY <= BUTTON_CONTROLS.y + BUTTON_CONTROLS.height) {
            // TODO
        }
        // If we see the credits
        else if (clicX >= BUTTON_CREDITS.x && clicX <= BUTTON_CREDITS.x + BUTTON_CREDITS.width && clicY >= BUTTON_CREDITS.y && clicY <= BUTTON_CREDITS.y + BUTTON_CREDITS.height) {
            // TODO
        }
    }


    /** Waiting to start screen */
    waitingToStart(ctx) {
        ctx.textAlign = "center";
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, WIDTH, HEIGHT);
        ctx.fillStyle = '#FFFFFF';
        ctx.font = "23px pixel-bit-advanced";
        ctx.fillText("Loading complete", WIDTH / 2, HEIGHT/2 - 50);
        ctx.fillText("Double click to start",  WIDTH/2, HEIGHT/2 +50);
    }

    /** Dead screen */
    dead(ctx) {
        if (this.gameDead == false) {
            this.gameDead = true;
            ctx.globalAlpha = 0.25;
            ctx.fillStyle = '#f00';
            ctx.fillRect(0, 0, WIDTH, HEIGHT);
            ctx.globalAlpha = 1;
            ctx.font = "35px pixel-bit-advanced";
            ctx.fillText("You've been", WIDTH / 2 - 150, HEIGHT/2 - 50);
            ctx.font = "45px pixel-bit-advanced";
            ctx.fillText("DANDELIONED", WIDTH / 2 - 200, HEIGHT/2);
            ctx.fillStyle = '#FFFFFF';
            ctx.font = "23px pixel-bit-advanced";
            ctx.fillText("Press ENTER or SPACE to restart", WIDTH / 2 - 290, HEIGHT/2 + 75);
            data["ingame1"].pause();
            data["ingame2"].pause();
            data["walkSound"].pause();
            data["defeatMusic"].loop = false;
            data["defeatMusic"].play();
        }
    }
    
    /** Winning screen */
    finished(ctx, won) {
        if (this.gameArrived == false) {
            audio.pause();
            audio.playSound(won == 1 ? "victoryMusic" : "defeatMusic", "main", 0.4, false);

            document.querySelector("canvas").classList.add("fade");
        
            this.gameArrived = true;
            ctx.globalAlpha = 0.5;
            ctx.fillStyle = '#000';
            ctx.fillRect(0, 0, WIDTH, HEIGHT);
            ctx.globalAlpha = 1;
            ctx.fillStyle = '#fff';
            ctx.font = "35px pixel-bit-advanced";
            ctx.fillText("You've reached", WIDTH / 2 - 170, HEIGHT/2 - 50);
            ctx.font = "45px pixel-bit-advanced";
            ctx.fillText("the surface !", WIDTH / 2 - 200, HEIGHT/2);
            ctx.font = "23px pixel-bit-advanced";
            ctx.fillText("Press ENTER or SPACE to continue", WIDTH / 2 - 300, HEIGHT/2 + 75);
            data["ingame1"].pause();
            data["ingame2"].pause();
            data["walkSound"].pause();
            data["victoryMusic"].loop = false;
            data["victoryMusic"].play();
        }
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
            ctx.font = "40px Times";
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
        if (this.showOutro == false) {
            this.showOutro = true;
            // ctx.drawImage(OUTRO_IMG, 0, 0, OUTRO_WIDTH, OUTRO_HEIGHT);
            // TODO ?
        }
    }
}


const INTRO = [
    (t, ctx, now) => {
        t.time = now + 1000;
        document.querySelector("canvas").classList.remove("fade");
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
        audio.sounds[0].pause();
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
        t.time = now + 1000;
        ctx.drawImage(data["intro6"], 0, 0, WIDTH, HEIGHT);
    },
    (t,ctx,now) => {
        t.time = now + 2000;
        drawOldStyle(ctx);
        ctx.fillText('AAAaaaaaaahh!', WIDTH / 2, HEIGHT / 2);
    },
    (t,ctx,now) => {
        t.time = now + 1000;
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
        audio.playSound("ouch", "player", 0.4);
    },
    (t) => {
        document.querySelector("canvas").classList.remove("fade");
        t.game.start();        
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
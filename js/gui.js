import { data } from "./preload.js";

import { STATES } from "./game.js";

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
        this.gameDead = false;
        this.gameArrived = false;
        this.showIntro = false;
        this.showOutro = false;
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
            data['titleScreenMusic'].pause();
            this.game.start();
        }
        // If we see the controls
        else if (this.clicOnButton(clicX, clicY, BUTTON_CONTROLS)) {
            this.game.state = STATES.CONTROLS;
            console.log('toto');
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
        // Background image
        for(let i = 0; i < 4; i++) {
            ctx.drawImage(data.wood, 0, HEIGHT / 4 * i, WIDTH, HEIGHT / 4);
        }
        ctx.textAlign = "center";
        ctx.fillStyle = '#fff';
        ctx.font = "23px pixel-bit-advanced";
    }

    showCredits(ctx) {
        // Background image
        for(let i = 0; i < 4; i++) {
            ctx.drawImage(data.wood, 0, HEIGHT / 4 * i, WIDTH, HEIGHT / 4);
        }
        ctx.textAlign = "center";
        ctx.fillStyle = '#fff';
        ctx.font = "23px pixel-bit-advanced";
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
        if (this.gameDead == false) {
            this.gameDead = true;
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
            data["ingame1"].pause();
            data["ingame2"].pause();
            data["walkSound"].pause();
            data["defeatMusic"].loop = false;
            data["defeatMusic"].play();
        }
    }
    
    /** Winning screen */
    arrived(ctx) {
        if (this.gameArrived == false) {
            this.gameArrived = true;
            ctx.globalAlpha = 0.5;
            ctx.textAlign = "center";
            ctx.fillStyle = '#000';
            ctx.fillRect(0, 0, WIDTH, HEIGHT);
            ctx.globalAlpha = 1;
            ctx.fillStyle = '#ffd728';
            ctx.font = "35px pixel-bit-advanced";
            ctx.fillText("You've reached", WIDTH / 2, HEIGHT/2 - 50);
            ctx.font = "45px pixel-bit-advanced";
            ctx.fillText("the surface !", WIDTH / 2, HEIGHT/2);
            ctx.fillStyle = '#fff';
            ctx.font = "23px pixel-bit-advanced";
            ctx.fillText("Press ENTER or SPACE to continue", WIDTH / 2, HEIGHT/2 + 75);
            data["ingame1"].pause();
            data["ingame2"].pause();
            data["walkSound"].pause();
            data["victoryMusic"].loop = false;
            data["victoryMusic"].play();
        }
    }

    /** Intro animation */
    playIntro(ctx) {
        if (this.showIntro == false) {
            this.showIntro = true;
            //ctx.drawImage(OUTRO_IMG, 0, 0, OUTRO_WIDTH, OUTRO_HEIGHT);
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
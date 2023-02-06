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
        ctx.fillText('Coding', WIDTH / 3.5, HEIGHT/2 - 40);
        ctx.fillStyle = '#fff';
        ctx.font = "20px pixel-bit-advanced";
        ctx.fillText('Fred Dadeau', WIDTH / 3.5, HEIGHT/2);
        ctx.fillText('Robin Grappe', WIDTH / 3.5, HEIGHT/2 + 30);
        ctx.fillText('Tayeb Hakkar', WIDTH / 3.5, HEIGHT/2 + 60);

        // Root separator
        ctx.drawImage(data['hud-roots'], WIDTH / 2, HEIGHT / 2 - 60, 10, 120);

        // Game Art
        ctx.fillStyle = '#ffd728';
        ctx.font = "25px pixel-bit-advanced";
        ctx.fillText('Game Art', (WIDTH / 3.5) * 2.6, HEIGHT/2 - 40);
        ctx.fillStyle = '#fff';
        ctx.font = "20px pixel-bit-advanced";
        ctx.fillText('Marie-Almina', (WIDTH / 3.5) * 2.6, HEIGHT/2);
        ctx.fillText('Gindre', (WIDTH / 3.5) * 2.6, HEIGHT/2 + 30);
        ctx.fillText('Elea Jacquin', (WIDTH / 3.5) * 2.6, HEIGHT/2 + 60);

        // Special Thanks
        ctx.fillStyle = '#ffd728';
        ctx.font = "25px pixel-bit-advanced";
        ctx.fillText('Special Thanks', WIDTH / 2, HEIGHT/2 + 110);
        ctx.fillStyle = '#fff';
        ctx.font = "20px pixel-bit-advanced";
        ctx.fillText('OFNI association', WIDTH / 2, HEIGHT/2 + 150);
        ctx.fillText('DPS association', WIDTH / 2, HEIGHT/2 + 180);

        //Logos
        ctx.drawImage(data.logoOFNI, 20, HEIGHT - 75, 130, 70);
        ctx.drawImage(data.logoDPS, WIDTH - 150, HEIGHT - 75, 130, 50);
    }

    drawMenuTheme(ctx, title) {
        ctx.textAlign = "center";

        // Background image
        for(let i = 0; i < 4; i++) {
            ctx.drawImage(data.wood, 0, HEIGHT / 4 * i, WIDTH, HEIGHT / 4);
        }

        // Hanging ropes
        ctx.drawImage(data.rope, WIDTH / 3, -45, 20, 100);
        ctx.drawImage(data.rope, (WIDTH / 3) * 2 - 25, -45, 20, 100);

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
    finished(ctx, won) {
        if (this.gameArrived == false) {
            audio.pause();
            audio.playSound(won == 1 ? "victoryMusic" : "defeatMusic", "main", 0.4, false);

            document.querySelector("canvas").classList.add("fade");
        
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
        if (this.showOutro == false) {
            this.showOutro = true;
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
        if (this.step < OUTRO.length) {
            OUTRO[this.step](this, ctx, now);
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
        t.time = now + 1000;
        document.querySelector("canvas").classList.remove("fade");
        audio.playMusic("", )
    }, 
    (t,ctx,now) => {
        t.time = now + 3000;
        document.querySelector("canvas").classList.remove("fade");
        ctx.drawImage(data["fin1"], 0, 0, WIDTH, HEIGHT);
        audio.playSound("breathing", 0, 0.4, true);
    },

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
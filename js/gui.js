/** Screen width */
const WIDTH = 640;
/** Screen height */
const HEIGHT = WIDTH * 10 / 16;

const TITLE_IMG = new Image();
TITLE_IMG.src = "../data/title-screen.png"; // To change

const BUTTON_IMG = new Image();
BUTTON_IMG.src = "../data/textures/wood.png"; // To change
const BUTTON_HEIGHT = 50 | 0;
const BUTTON_WIDTH = 300;

const BUTTON_PLAY = {
    x: (WIDTH / 2 - BUTTON_WIDTH / 2),
    y: 200,
    width: BUTTON_WIDTH,
    height: BUTTON_HEIGHT,
    text: "PLAY"
}

const BUTTON_CONTROLS = {
    x: (WIDTH / 2 - BUTTON_WIDTH / 2),
    y: 260,
    width: BUTTON_WIDTH,
    height: BUTTON_HEIGHT,
    text: "CONTROLS"
}

const BUTTON_CREDITS = {
    x: (WIDTH / 2 - BUTTON_WIDTH / 2),
    y: 320,
    width: BUTTON_WIDTH,
    height: BUTTON_HEIGHT,
    text: "CREDITS"
}

const OUTRO_IMG = new Image();
// OUTRO_IMG.src = "../data/some-outro.png"; // To change
const OUTRO_HEIGHT = 15200/19 | 0;
const OUTRO_WIDTH = 800;

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
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, WIDTH, HEIGHT);
        ctx.fillStyle = '#FFFFFF';
        ctx.font = "18px pixel-bit-advanced";
        ctx.fillText(`Loading assets: ${this.game.loading.loaded * 100 / this.game.loading.total | 0} percent...`, WIDTH / 2 - 200, HEIGHT/2 - 9);
    }

    showTitleScreen(ctx) {
        // Background image
        ctx.drawImage(TITLE_IMG, 0, 0, WIDTH, HEIGHT);

        // Buttons
        ctx.font = "25px pixel-bit-advanced";
        ctx.fillStyle = '#FFFFFF';
        ctx.drawImage(BUTTON_IMG, BUTTON_PLAY.x, BUTTON_PLAY.y, BUTTON_PLAY.width, BUTTON_PLAY.height);
        ctx.fillText(BUTTON_PLAY.text, WIDTH / 2 - 40, 235, BUTTON_WIDTH, BUTTON_HEIGHT);
        ctx.drawImage(BUTTON_IMG, BUTTON_CONTROLS.x, BUTTON_CONTROLS.y, BUTTON_CONTROLS.width, BUTTON_CONTROLS.height);
        ctx.fillText(BUTTON_CONTROLS.text, WIDTH / 2 - 85, 295, BUTTON_WIDTH, BUTTON_HEIGHT);
        ctx.drawImage(BUTTON_IMG, BUTTON_CREDITS.x, BUTTON_CREDITS.y, BUTTON_CREDITS.width, BUTTON_CREDITS.height);
        ctx.fillText(BUTTON_CREDITS.text, WIDTH / 2 - 70, 355, BUTTON_WIDTH, BUTTON_HEIGHT);
    }

    clickButton(clicX, clicY) {
        // If we play
        if (clicX >= BUTTON_PLAY.x && clicX <= BUTTON_PLAY.x + BUTTON_PLAY.width && clicY >= BUTTON_PLAY.y && clicY <= BUTTON_PLAY.y + BUTTON_PLAY.height) {
            this.game.start();
        }
        // If we see the controls
        if (clicX >= BUTTON_CONTROLS.x && clicX <= BUTTON_CONTROLS.x + BUTTON_CONTROLS.width && clicY >= BUTTON_CONTROLS.y && clicY <= BUTTON_CONTROLS.y + BUTTON_CONTROLS.height) {

        }
        // If we see the credits
        if (clicX >= BUTTON_CREDITS.x && clicX <= BUTTON_CREDITS.x + BUTTON_CREDITS.width && clicY >= BUTTON_CREDITS.y && clicY <= BUTTON_CREDITS.y + BUTTON_CREDITS.height) {

        }
    }

    /** Waiting to start screen */
    waitingToStart(ctx) {
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, WIDTH, HEIGHT);
        ctx.fillStyle = '#FFFFFF';
        ctx.font = "23px pixel-bit-advanced";
        ctx.fillText("Double click to start", WIDTH / 2 - 200, HEIGHT/2 - 9);
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
        }
    }
    
    /** Winning screen */
    arrived(ctx) {
        if (this.gameArrived == false) {
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
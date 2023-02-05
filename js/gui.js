/** Screen width */
const WIDTH = 640;
/** Screen height */
const HEIGHT = WIDTH * 10 / 16;



const OUTRO_IMG = new Image();
OUTRO_IMG.src = "../data/some-outro.png"; // To change
const OUTRO_HEIGHT = 15200/19 | 0;
const OUTRO_WIDTH = 800;

export class GUI {
    constructor(loading) {
        this.gameLoading = loading;
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
        ctx.fillText(`Loading assets: ${this.gameLoading.loaded * 100 / this.gameLoading.total | 0} percent...`, WIDTH / 2 - 200, HEIGHT/2 - 9);
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
            ctx.drawImage(OUTRO_IMG, 0, 0, OUTRO_WIDTH, OUTRO_HEIGHT);
            // TODO ?
        }
    }
}
/** Screen width */
const WIDTH = 640;
/** Screen height */
const HEIGHT = WIDTH * 10 / 16;

export class GUI {
    constructor(loading) {
        this.gameLoading = loading;
        this.gameDead = false;
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
}
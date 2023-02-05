/** Screen width */
const WIDTH = 640;
/** Screen height */
const HEIGHT = WIDTH * 10 / 16;

export class GUI {
    constructor(loading) {
        this.gameLoading = loading;
    }

    loading(ctx) {
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, WIDTH, HEIGHT);
        ctx.fillStyle = '#FFFFFF';
        ctx.font = "18px pixel-bit-advanced";
        ctx.fillText(`Loading assets: ${this.gameLoading.loaded * 100 / this.gameLoading.total | 0} percent...`, WIDTH / 2 - 200, HEIGHT/2 - 9);
    }

    waitingToStart(ctx) {
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, WIDTH, HEIGHT);
        ctx.fillStyle = '#FFFFFF';
        ctx.font = "23px pixel-bit-advanced";
        ctx.fillText("Double click to start", WIDTH / 2 - 200, HEIGHT/2 - 9);
    }
}
import { Game } from "./game.js";
import { Engine } from "./engine.js";
import { Hud } from "./hud.js";

document.addEventListener("DOMContentLoaded", function() {

    // Pseudo-3D engine
    const canvas = document.getElementById("cvs");
    const engine = new Engine(canvas);
    // Game itself 
    const game = new Game();
    const hud = new Hud(canvas, 75);

    // Event listener for keyboards events
    document.addEventListener("keydown", function(e) {
        game.press(e.code);
    });
    document.addEventListener("keyup", function(e) {
        game.release(e.code);
    });
    // Double click --> switch to full screen + mouse pointer lock
    document.addEventListener("dblclick", async function(e) {
        await document.getElementById("cvs").requestFullscreen();
        if (!document.pointerLockElement) {
            await document.getElementById("cvs").requestPointerLock({ unadjustedMovement: true });
        }
    });
    document.addEventListener("mousemove", function(e) {
        let dX = e.movementX;
        let dY = e.movementY;
        game.mouseMove(dX, dY);
    });

    let lastUpdate = Date.now();
    let framerate = 0,
        framesMeasure = lastUpdate;

    function mainloop() {
        requestAnimationFrame(mainloop);
        let now = Date.now();
        let dt = now - lastUpdate;
        game.update(dt);
        lastUpdate = now;
        engine.render(game);
        game.player.currentWeapon.render(engine.ctx);
        if (now < framesMeasure + 1000) {
            framerate++;
        } else {
            engine.framerate = framerate;
            framerate = 0;
            framesMeasure = now;
        }
        hud.render(engine.ctx, game.player);
    }
    mainloop();

});
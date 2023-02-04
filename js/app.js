import { Game } from "./game.js";
import { Engine } from "./engine.js";
import { Hud } from "./hud.js";

const STORAGE_KEY_MOUSE = "ggj2k23-invert-mouse";

document.addEventListener("DOMContentLoaded", function() {

    // Pseudo-3D engine
    const canvas = document.getElementById("cvs");
    const engine = new Engine(canvas);
    // Game itself
    const hud = new Hud(canvas, 75);
    const game = new Game(hud);
    

    if (localStorage.getItem(STORAGE_KEY_MOUSE)) {
        game.inverted = 1*localStorage.getItem(STORAGE_KEY_MOUSE);
    }
    
    // Event listener for keyboards events
    document.addEventListener("keydown", function(e) {
        if (e.key == 'KeyI') {
            game.inverted *= -1;
            localStorage.setItem(STORAGE_KEY_MOUSE, game.inverted);
            return;
        }
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
        
        if (!game.on2D) {
            game.player.render(engine.ctx);
        }
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
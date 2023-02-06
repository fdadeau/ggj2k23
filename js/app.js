import { Game, STATES } from "./game.js";
import { Engine } from "./engine.js";
import { MicrophoneController } from "./microphone-controller.js";
import { preload, data } from "./preload.js";

const STORAGE_KEY_MOUSE = "ggj2k23-invert-mouse";


document.addEventListener("DOMContentLoaded", async function() {

    // Game elements 
    const canvas = document.getElementById("cvs");
    // Game itself 
    const game = new Game();
    // 2.5D engine
    const engine = new Engine(canvas);
    // microphone controller
    const micro = new MicrophoneController();

    // preloading... (async)
    const loader = new Promise(function(resolve, reject) {
        preload((loaded, total) => { game.setLoadingProgress(loaded, total); });
    });


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
    document.addEventListener("click", function(e) {
        e.preventDefault();
        if (game.state == STATES.TITLE) {
            var rect = canvas.getBoundingClientRect();
            let clicX = (e.clientX - rect.left) * 640 / rect.width;
            let clicY = (e.clientY - rect.top) * 400 / rect.height;
            game.gui.clickButton(clicX, clicY);
        }
        return false;
    });
    document.addEventListener("mousedown", function(e) {
        e.preventDefault();
        if (e.button == 2) {
            e.stopPropagation();
            e.stopImmediatePropagation();
            game.press("KeyE");
        }
        else if (document.pointerLockElement && e.button == 0) {
            game.press("KeyL");
        }
        return false;
    }, true)
    document.addEventListener("mouseup", function(e) {
        if (e.button == 0) {
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();
            game.release("KeyL");
            return false;
        }
    }, true);
    // Double click --> switch to full screen + mouse pointer lock
    document.addEventListener("dblclick", async function(e) {
        if (game.state == STATES.WAITING_TO_START) {
            game.state = STATES.TITLE;
            data['titleScreenMusic'].volume = 0.1;
            data['titleScreenMusic'].play();
            engine.initialize();
            await micro.start();
        } 
        await document.getElementById("cvs").requestFullscreen();
        if (game.state == STATES.PLAYING && !document.pointerLockElement) {
            document.getElementById("cvs").requestPointerLock({ unadjustedMovement: true });
        }
    });

    document.addEventListener("wheel", function(e) {
        if (e.deltaY > 0) {
            game.player.switchToNextWeapon(-1);
        }
        else if (e.deltaY < 0) {
            game.player.switchToNextWeapon(1);
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
        lastUpdate = now;
        
        micro.update(game);
        game.update(dt);
        engine.render(game);

        if (now < framesMeasure + 1000) {
            framerate++;
        } else {
            engine.framerate = framerate;
            framerate = 0;
            framesMeasure = now;
        }
    }
    mainloop();

});
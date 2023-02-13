
import { Game, STATES } from "./game.js";
import { MicrophoneController } from "./microphone-controller.js";
import { preload, data } from "./preload.js";
import { WIDTH, HEIGHT, GUI } from "./gui.js";
import { audio } from "./audio.js";

const STORAGE_KEY_MOUSE = "ggj2k23-invert-mouse";


document.addEventListener("DOMContentLoaded", async function() {

    // Game elements 
    const canvas = document.getElementById("cvs");
    // Game itself 
    const game = new Game();
    // microphone controller
    const micro = new MicrophoneController();
    // GUI
    const gui = new GUI(game, canvas);

    
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
        if ((e.key == " " || e.key == "Enter") && game.state == STATES.PLAYING_INTRO) {
            document.querySelector("canvas").classList.remove("fade");
            audio.pause();
            game.start();
            return;   
        }

        // to remove for the final version
        if (e.key == "£") {
            if (game.state != STATES.PLAYING) {
                document.querySelector("canvas").classList.remove("fade");
                audio.pause();
                game.start();
            }
            else {
                game.player.hasExited = confirm("gagner ?") ? 1 : 2;
                return;
            }
        }
        game.press(e);
    });
    document.addEventListener("keyup", function(e) {
        game.release(e.code);
    });
    document.addEventListener("click", function(e) {
        e.preventDefault();
        if (game.state == STATES.TITLE) {
            var rect = canvas.getBoundingClientRect();
            let clicX = (e.clientX - rect.left) * WIDTH / rect.width;
            let clicY = (e.clientY - rect.top) * HEIGHT / rect.height;
            gui.clickButton(clicX, clicY);
        } else if (game.state == STATES.CONTROLS || game.state == STATES.CREDITS) {
            game.state = STATES.TITLE;
        }
        return false;
    });
    document.addEventListener("contextmenu", function(e) {
        e.preventDefault();
        return false;
    });
    document.addEventListener("mousedown", function(e) {
        e.preventDefault();
        if (e.button == 2) {
            e.stopPropagation();
            e.stopImmediatePropagation();
            game.press("KeyE");
        }
        else if (e.button == 1) {
            e.stopPropagation();
            e.stopImmediatePropagation();
            game.press("KeyF");
        }
        else if (e.button == 0) {
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
        else if (e.button == 1) {
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();
            game.release("KeyF");
            return false;
        }
    }, true);
    // Double click --> switch to full screen + mouse pointer lock
    document.addEventListener("dblclick", async function(e) {
        if (game.state == STATES.WAITING_TO_START) {
            game.state = STATES.TITLE;
            audio.playMusic("titleScreenMusic");
            await micro.start();
        } 
        await document.getElementById("cvs").requestFullscreen();
        if (game.state == STATES.PLAYING && !document.pointerLockElement) {
            document.getElementById("cvs").requestPointerLock({ unadjustedMovement: true });
        }
    });

    document.addEventListener("wheel", function(e) {
        if (!game.state == STATES.PLAYING) {
            return;
        }
        game.wheel(e.deltaY);
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
        gui.render();

        if (now < framesMeasure + 1000) {
            framerate++;
        } else {
            gui.framerate = framerate;
            framerate = 0;
            framesMeasure = now;
        }
    }
    mainloop();

});
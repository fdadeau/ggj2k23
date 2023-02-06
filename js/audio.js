/***
 * Audio controller
 */

import { data } from "./preload.js";

export const audio = {

    ambiance: null,
    playMusic: function(which) {
        if (data[which] && data[which] instanceof HTMLAudioElement) {
            if (this.ambiance != null) {
                this.ambiance.pause();
            }
            this.ambiance = data[which];
            this.ambiance.volume = 0.4;
            this.ambiance.currentTime = 0;
            this.ambiance.loop = true;
            this.ambiance.play();
        }
    },

    sounds: {},
    playSound: function(which, channel, loop) {
        if (data[which] && data[which] instanceof HTMLAudioElement) {
            if (this.sounds[channel]) {
                this.sounds[channel].pause();
            }
            this.sounds[channel] = data[which];
            this.sounds[channel].currentTime = 0;
            this.sounds[channel].loop = loop ? loop : false;
            this.sounds[channel].play();
        }
    },


    reset: function() {
        if (this.ambiance) 
            this.ambiance.currentTime = 0;
    },

    pause: function() {
        if (this.ambiance) 
            this.ambiance.pause();
        for (let s in this.sounds) {
            this.sounds[s].pause();
        }
    },

    resume: function() {
        if (this.ambiance) this.ambiance.play();
        for (let s in this.sounds) {
            if (this.sounds[s].loop) 
                this.sounds[s].play();
        }
    }
}
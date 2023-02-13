/***
 * Audio controller
 */

import { data } from "./preload.js";

export const audio = {

    ambiance: null,
    playMusic: function(which, volume) {
        if (data[which] && data[which] instanceof HTMLAudioElement) {
            if (this.ambiance != null) {
                this.ambiance.pause();
            }
            this.ambiance = data[which];
            this.ambiance.volume = volume ? volume : 0.4;
            this.ambiance.currentTime = 0;
            this.ambiance.loop = true;
            this.ambiance.play();
        }
    },

    sounds: {},
    playSound: function(which, channel, volume, loop) {
        if (data[which] && data[which] instanceof HTMLAudioElement) {
            if (this.audioIsPlaying(channel)) {
                this.sounds[channel].pause();
            }
            this.sounds[channel] = data[which];
            this.sounds[channel].volume = volume ? volume : 0.5;
            this.sounds[channel].currentTime = 0;
            this.sounds[channel].loop = loop ? loop : false;
            this.sounds[channel].play();
        }
    },

    audioIsPlaying: function(channel) {
        return this.sounds[channel] && !this.sounds[channel].paused && this.sounds[channel].currentTime > 0;
    },


    reset: function() {
        this.pause();
        if (this.ambiance) {
            this.ambiance.currentTime = 0;
        }
        this.sounds = {};
    },

    pause: function(s) {
        if (s !== undefined) {
            if (this.audioIsPlaying(s)) {
                this.sounds[s].pause();
            }
            return;
        }
        if (this.ambiance) 
            this.ambiance.pause();
        for (let s in this.sounds) {
            if (this.audioIsPlaying(s)) {
                this.sounds[s].pause();
            }
        }
    },

    resume: function(s) {
        if (s !== undefined && this.sounds[s]) {
            this.sounds[s].play();
            return;
        }
        if (this.ambiance) this.ambiance.play();
        for (let s in this.sounds) {
            if (this.sounds[s].loop) {
                this.sounds[s].play();
            }
        }
    }
}
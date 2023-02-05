

export class MicrophoneController {

    constructor() {

        this.audioContext;
        this.analyser;
        this.on = false;

    }

    async start() {
        this.audioContext = new AudioContext();
        // Attempt to get audio input
        try {
            const stream = await navigator.mediaDevices.getUserMedia(
                {
                    "audio": {
                        "mandatory": {
                            "googEchoCancellation": "false",
                            "googAutoGainControl": "false",
                            "googNoiseSuppression": "false",
                            "googHighpassFilter": "false"
                        },
                        "optional": []
                    },
                });
            
            // Create an AudioNode from the stream.
            this.mediaStreamSource = this.audioContext.createMediaStreamSource(stream);
            // Connect it to the destination.
            this.analyser = this.audioContext.createAnalyser();
            this.analyser.fftSize = 2048;
            this.mediaStreamSource.connect( this.analyser );
            
        }
        catch(err) {
            // always check for errors at the end.
            console.error(`${err.name}: ${err.message}`);
        };
    }


    update(game) {

        if (!this.analyser) {
            return;
        }

        const bufferLength = this.analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        this.analyser.getByteTimeDomainData(dataArray);
    
        let total = 0;
    
        for (let i = 0; i < bufferLength; i++) {
            const v = dataArray[i] / 128.0;
            const y = (v * 160) / 2;
            total += (y > 100) ? 1 : 0; 
        }
        let moyenne = total / bufferLength;

        if (moyenne >= 0.3 && !this.on) {
            game.press("KeyF");
        }
        else if (moyenne < 0.3 && this.on) {
            game.release("KeyF");
        }
        this.on = (moyenne >= 0.3);
        //console.log(moyenne);
    }

}
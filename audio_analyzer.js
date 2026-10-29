class AudioAnalyzer{
    constructor(song){
        this.song = song;
        this.ifPlaying;

        this.fft = new p5.FFT(0.5, 512);
        this.fft.setInput(this.song);
        this.amplitude = new p5.Amplitude();
        this.amplitude.setInput(this.song);
    }

    analyzeVolume(){
        if (this.ifPlaying){
            return this.amplitude.getLevel();
        }
    }
}
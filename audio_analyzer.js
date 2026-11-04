class AudioAnalyzer{
    constructor(song){
        this.song = song;
        this.ifPlaying;

        this.fft = new p5.FFT(0.5, 512);
        this.fft.setInput(this.song);
        this.amplitude = new p5.Amplitude();
        this.amplitude.setInput(this.song);

        this.lowEnergy = 0;
        this.highEnergy = 0;

        this.peakDetect = new p5.PeakDetect(20, 140, 0.9, 30);
    }

    // Get volumn data
    analyzeVolume(){
        if (this.ifPlaying){
            return this.amplitude.getLevel();
        }
    }

    // Get energy data and beats
    analyzeFrequencyBand(){
        this.fft.analyze();

        this.lowEnergy = this.fft.getEnergy(20, 140);
        this.highEnergy = this.fft.getEnergy(141, 14000);

        this.peakDetect.update(this.fft);
    }

    
}
import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { Music } from "../utils/music";

@Injectable({
    providedIn: "root",
})
export class MusicService {
    private musicSubject = new Subject<Music>();

    public music$ = this.musicSubject.asObservable();

    public audioContext = new AudioContext();
    public source!: MediaElementAudioSourceNode;

    public bassAnalyser = this.audioContext.createAnalyser();
    public midAnalyser = this.audioContext.createAnalyser();
    public trebleAnalyser = this.audioContext.createAnalyser();

    private lowPassFilter = this.audioContext.createBiquadFilter();
    private bandPassFilter = this.audioContext.createBiquadFilter();
    private highPassFilter = this.audioContext.createBiquadFilter();

    constructor() {
        this.lowPassFilter.type = "lowpass";
        this.lowPassFilter.frequency.value = 250; // Cutoff frequency for bass
        this.lowPassFilter.Q.value = 0.5;

        this.bandPassFilter.type = "bandpass";
        this.bandPassFilter.frequency.value = 4000; // Center frequency for midrange
        this.bandPassFilter.Q.value = 1; // Q value determines the width of the band

        this.highPassFilter.type = "highpass";
        this.highPassFilter.frequency.value = 14000; // Cutoff frequency for treble
        this.highPassFilter.Q.value = 0.5;
    }

    changeMusic(music: Music) {
        this.musicSubject.next(music);
    }

    initAnalyzers(audioElement: HTMLAudioElement) {
        this.source = this.audioContext.createMediaElementSource(audioElement);
        this.source.connect(this.audioContext.destination);

        this.source.connect(this.lowPassFilter);
        this.lowPassFilter.connect(this.bassAnalyser);

        this.source.connect(this.bandPassFilter);
        this.bandPassFilter.connect(this.midAnalyser);

        this.source.connect(this.highPassFilter);
        this.highPassFilter.connect(this.trebleAnalyser);

        this.source.connect(this.audioContext.destination);
    }
}

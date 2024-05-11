import {
    AfterViewInit,
    Component,
    ElementRef,
    OnInit,
    ViewChild,
} from "@angular/core";
import { MusicService } from "../../shared/services/music.service";
import { Music } from "../../shared/utils/music";

@Component({
    selector: "app-music-player",
    templateUrl: "./music-player.component.html",
    styleUrl: "./music-player.component.scss",
})
export class MusicPlayerComponent implements OnInit, AfterViewInit {
    @ViewChild("audio") audioRef: ElementRef | undefined;
    @ViewChild("slider") sliderRef: ElementRef | undefined;
    isPlaying: boolean = false;
    _volume: number = 1.0;
    _loop: boolean = false;
    music: Music = {
        name: "",
        rating: 0,
        uid: "",
        musicId: "",
        tags: [],
        uploadDate: new Date(),
    };

    constructor(readonly musicService: MusicService) {}

    ngAfterViewInit() {
        if (this.audioRef?.nativeElement) {
            this.audioRef.nativeElement.crossOrigin = "anonymous";
        }

        this.musicService.initAnalyzers(this.audioRef!.nativeElement);
    }

    get audio(): HTMLAudioElement | undefined {
        return this.audioRef?.nativeElement;
    }

    get slider() {
        return this.sliderRef?.nativeElement;
    }

    play() {
        if (!this.audio?.src) {
            return;
        }
        this.audio?.play().then(() => (this.isPlaying = true));
        this.musicService.audioContext.resume();
    }

    pause() {
        this.isPlaying = false;
        this.audio?.pause();
    }

    loop() {
        this._loop = !this._loop;
    }

    get currentTime() {
        return this.audio?.currentTime;
    }

    set currentTime(time) {
        if (this.audio && time) {
            this.audio.currentTime = time;
            this.pause();
        }
    }

    get duration() {
        return this.audio?.duration;
    }

    ngOnInit(): void {
        this.musicService.music$.subscribe((music) => {
            this.music = music;
            if (this.audio) {
                this.pause();
                this.audio.src = music.audio!;
            }
        });
    }

    updateTime() {
        if (this.slider) {
            this.slider.value += 1;
        }
    }

    togglePlayState() {
        if (this.isPlaying) {
            this.pause();
        } else {
            this.play();
        }
    }

    toggleMute() {
        if (this.volume) {
            this.volume = 0.0;
        } else {
            this.volume = this._volume;
        }
    }

    set volume(volume: number) {
        if (this.audio) {
            if (volume !== 0) {
                this._volume = volume;
            }
            this.audio.volume = volume;
        }
    }
    get volume(): number | undefined {
        return this.audio?.volume;
    }

    atEnd() {
        console.log("ended");
    }

    sliderInputDone() {
        this.play();
    }
}

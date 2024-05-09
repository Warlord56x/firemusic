import {
    AfterViewInit,
    Component,
    ElementRef,
    OnInit,
    ViewChild,
} from "@angular/core";
import { MusicService } from "../../shared/services/music.service";
import { Music } from "../../shared/utils/music";
import { Meta } from "@angular/platform-browser";

@Component({
    selector: "app-music-player",
    templateUrl: "./music-player.component.html",
    styleUrl: "./music-player.component.scss",
})
export class MusicPlayerComponent implements OnInit, AfterViewInit {
    @ViewChild("audio") audioRef: ElementRef | undefined;
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

    ngOnInit(): void {
        this.musicService.music$.subscribe((music) => {
            this.music = music;
            if (this.audio) {
                this.pause();
                this.audio.src = music.audio!;
            }
        });
    }

    get audio(): HTMLAudioElement | undefined {
        return this.audioRef?.nativeElement;
    }

    ngAfterViewInit() {
        if (this.audio) {
            this.audio.crossOrigin = "anonymous";
        }

        navigator.mediaSession.metadata = new MediaMetadata({
            title: this.music.name,
            artist: this.music.author || "Anonymous",
            artwork: [{ src: this.music.cover || "assets/img/fm_logo.png" }],
            album: this.music.album || "Anonymous",
        });

        this.musicService.initAnalyzers(this.audio!);
    }

    shortenTitle(title: string, maxLength: number): string | undefined {
        if (title!.length > maxLength) {
            return title?.slice(0, maxLength) + "...";
        }
        return title;
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

    timeUpdate() {
        navigator.mediaSession.setPositionState({
            position: this.audio?.currentTime,
            duration: this.audio?.duration || 0,
        });
    }

    atEnd() {
        console.log("ended");
    }

    sliderInputDone() {
        this.play();
    }
}

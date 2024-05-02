import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { MatSlider, MatSliderThumb } from "@angular/material/slider";
import { FormsModule } from "@angular/forms";
import { FlexLayoutModule } from "@angular/flex-layout";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatIconButton } from "@angular/material/button";
import { MatIcon } from "@angular/material/icon";
import { CommonModule, NgOptimizedImage } from "@angular/common";
import { MusicService } from "../../shared/services/music.service";
import { Music } from "../../shared/utils/music";

@Component({
    selector: "app-music-player",
    standalone: true,
    imports: [
        CommonModule,
        MatSlider,
        FormsModule,
        MatSliderThumb,
        FlexLayoutModule,
        MatToolbarModule,
        MatIconButton,
        MatIcon,
        NgOptimizedImage,
    ],
    templateUrl: "./music-player.component.html",
    styleUrl: "./music-player.component.scss",
})
export class MusicPlayerComponent implements OnInit {
    @ViewChild("audio") audioRef: ElementRef | undefined;
    @ViewChild("slider") sliderRef: ElementRef | undefined;
    isPlaying: boolean = false;
    _volume: number = 1.0;
    _loop: boolean = false;
    music: Music = { name: "", rating: 0, uid: "", musicId: "" };

    constructor(readonly musicService: MusicService) {}

    shortenTitle(title: string, maxLength: number): string | undefined {
        if (title!.length > maxLength) {
            return title?.slice(0, maxLength) + "...";
        }
        return title;
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

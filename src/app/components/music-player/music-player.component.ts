import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { MatSlider, MatSliderThumb } from '@angular/material/slider';
import { FormsModule } from '@angular/forms';
import { StorageService } from '../../shared/services/storage.service';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatToolbar } from '@angular/material/toolbar';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-music-player',
    standalone: true,
    imports: [
        CommonModule,
        MatSlider,
        FormsModule,
        MatSliderThumb,
        FlexLayoutModule,
        MatToolbar,
        MatIconButton,
        MatIcon,
    ],
    templateUrl: './music-player.component.html',
    styleUrl: './music-player.component.scss',
})
export class MusicPlayerComponent implements OnInit {
    @Input({ required: true }) audioPath!: string;
    @ViewChild('audio') audioRef: ElementRef | undefined;
    @ViewChild('slider') sliderRef: ElementRef | undefined;
    isPlaying: boolean = false;
    errorMsg: string = '';
    _volume: number = 1.0;
    _loop: boolean = false;

    constructor(protected storageService: StorageService) {}

    get audio(): HTMLAudioElement | undefined {
        return this.audioRef?.nativeElement;
    }

    get slider() {
        return this.sliderRef?.nativeElement;
    }

    play() {
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
        }
    }

    get duration() {
        return this.audio?.duration;
    }

    ngOnInit(): void {
        if (this.audioPath === '') {
            this.errorMsg = 'No audio to play';
            return;
        }
        this.storageService.getAudio(this.audioPath).then((data) => {
            if (this.audio) {
                this.audio.src = data.url;
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
        console.log('ended');
    }
}

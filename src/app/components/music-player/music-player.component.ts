import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { MatSlider, MatSliderThumb } from '@angular/material/slider';
import { FormsModule } from '@angular/forms';
import { StorageService } from '../../shared/services/storage.service';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { IAudioMetadata } from 'music-metadata-browser';

@Component({
    selector: 'app-music-player',
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
    metadata: IAudioMetadata | undefined;
    cover: string | undefined;

    constructor(readonly storageService: StorageService) {}

    getLastPartOfUrl(url: string, maxLength: number): string | undefined {
        let lastPart = url.split('/').pop();

        if (lastPart?.includes('.')) {
            lastPart = lastPart.split('.').slice(0, -1).join('.');
        }

        if (lastPart!.length > maxLength) {
            return lastPart?.slice(0, maxLength) + '...';
        }

        return lastPart;
    }

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
            this.pause();
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
            this.metadata = data.metadata;
            this.cover = data.cover;

            navigator.mediaSession.metadata = {
                artwork: [
                    { src: data.cover ? data.cover : 'assets/img/fm_logo.png' },
                ],
                album: data.metadata.common.album!,
                artist: data.metadata.common.artist!,
                title: data.metadata.common.title!,
            };
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

    sliderInputDone() {
        this.play();
    }
}

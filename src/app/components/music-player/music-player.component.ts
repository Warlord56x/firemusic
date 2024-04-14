import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AuthService } from '../../shared/services/auth.service';
import { MatIcon } from '@angular/material/icon';
import { MatSlider, MatSliderThumb } from '@angular/material/slider';
import { MatIconButton } from '@angular/material/button';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-music-player',
    standalone: true,
    imports: [MatIcon, MatSlider, MatIconButton, FormsModule, MatSliderThumb],
    templateUrl: './music-player.component.html',
    styleUrl: './music-player.component.scss',
})
export class MusicPlayerComponent implements OnInit {
    constructor(protected authService: AuthService) {}
    @ViewChild('audio') audioRef: ElementRef | undefined;
    @ViewChild('slider') sliderRef: ElementRef | undefined;

    get audio(): HTMLAudioElement | null {
        return this.audioRef?.nativeElement;
    }

    get slider() {
        return this.sliderRef?.nativeElement;
    }

    play() {
        this.audio?.play();
    }

    pause() {
        this.audio?.pause();
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
        this.authService.testAudio().then((url) => {
            if (this.audio) {
                this.audio.src = url;
            }
        });
    }

    updateTime() {
        if (this.slider) {
            this.slider.value += 1;
        }
    }
}

import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../shared/services/auth.service';

@Component({
    selector: 'app-music-player',
    standalone: true,
    imports: [],
    templateUrl: './music-player.component.html',
    styleUrl: './music-player.component.scss',
})
export class MusicPlayerComponent implements OnInit {
    constructor(protected authService: AuthService) {}

    audioUrl: string = '';

    ngOnInit(): void {
        this.authService.testAudio().then((str) => {
            this.audioUrl = str;
        });
    }
}

import { Component } from '@angular/core';
import { StorageService } from '../../shared/services/storage.service';
import { FlexLayoutModule } from '@angular/flex-layout';
import { AsyncPipe, NgForOf, NgIf, NgOptimizedImage } from '@angular/common';
import { MatListModule } from '@angular/material/list';
import { MusicService } from '../../shared/services/music.service';
import { Music } from '../../shared/utils/music';

@Component({
    selector: 'app-search-list',
    standalone: true,
    imports: [
        MatListModule,
        FlexLayoutModule,
        NgForOf,
        AsyncPipe,
        NgIf,
        NgOptimizedImage,
    ],
    templateUrl: './search-list.component.html',
    styleUrl: './search-list.component.scss',
})
export class SearchListComponent {
    constructor(
        readonly storageService: StorageService,
        readonly musicService: MusicService,
    ) {
        storageService.searchQuery('');
    }

    play(m: Music) {
        this.musicService.changeMusic(m);
    }
}

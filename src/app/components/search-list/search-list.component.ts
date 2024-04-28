import { Component, OnDestroy, OnInit } from '@angular/core';
import { StorageService } from '../../shared/services/storage.service';
import { FlexLayoutModule } from '@angular/flex-layout';
import { AsyncPipe, NgForOf, NgIf, NgOptimizedImage } from '@angular/common';
import { MatListModule } from '@angular/material/list';
import { MusicService } from '../../shared/services/music.service';
import { Music } from '../../shared/utils/music';
import { MatPaginator, PageEvent } from '@angular/material/paginator';

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
        MatPaginator,
    ],
    templateUrl: './search-list.component.html',
    styleUrl: './search-list.component.scss',
})
export class SearchListComponent implements OnDestroy, OnInit {
    constructor(
        readonly storageService: StorageService,
        readonly musicService: MusicService,
    ) {
        storageService.searchQuery('');
    }

    play(m: Music) {
        this.musicService.changeMusic(m);
    }

    pageChange(event: PageEvent) {
        console.log(event);
    }

    ngOnInit(): void {
        this.storageService.queryResult$?.subscribe((result) => {
            console.log(result);
        });
    }

    ngOnDestroy(): void {}
}

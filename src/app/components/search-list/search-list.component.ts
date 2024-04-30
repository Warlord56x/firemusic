import { Component, OnDestroy, OnInit } from "@angular/core";
import { FlexLayoutModule } from "@angular/flex-layout";
import { AsyncPipe, NgForOf, NgIf, NgOptimizedImage } from "@angular/common";
import { MatListModule } from "@angular/material/list";
import { MusicService } from "../../shared/services/music.service";
import { Music } from "../../shared/utils/music";
import { MatPaginator, PageEvent } from "@angular/material/paginator";
import { DatabaseService } from "../../shared/services/database.service";

@Component({
    selector: "app-search-list",
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
    templateUrl: "./search-list.component.html",
    styleUrl: "./search-list.component.scss",
})
export class SearchListComponent implements OnDestroy, OnInit {
    constructor(
        readonly databaseService: DatabaseService,
        readonly musicService: MusicService,
    ) {
        databaseService.searchQuery("");
    }

    play(m: Music) {
        this.musicService.changeMusic(m);
    }

    pageChange(event: PageEvent) {
        console.log(event);
    }

    ngOnInit(): void {
        this.databaseService.queryResult$?.subscribe((result) => {
            console.log(result);
        });
    }

    ngOnDestroy(): void {}
}

import { Component, OnDestroy, OnInit } from "@angular/core";
import { FlexLayoutModule } from "@angular/flex-layout";
import { AsyncPipe, NgForOf, NgIf, NgOptimizedImage } from "@angular/common";
import { MatListModule } from "@angular/material/list";
import { MusicService } from "../../shared/services/music.service";
import { Music } from "../../shared/utils/music";
import { MatPaginator, PageEvent } from "@angular/material/paginator";
import { DatabaseService } from "../../shared/services/database.service";
import { Subscription } from "rxjs";

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
    private subscription: Subscription | undefined;
    protected searchList: Music[] = [];

    protected pageSize: number = 10;
    protected pageIndex: number = 0;

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
        this.pageSize = event.pageSize;
        this.pageIndex = event.pageIndex;
        console.log(
            this.pageIndex * this.pageSize,
            (this.pageIndex + 1) * this.pageSize,
        );
    }

    ngOnInit(): void {
        this.subscription = this.databaseService.queryResult$?.subscribe(
            (result) => {
                this.searchList = result;
            },
        );
    }

    ngOnDestroy(): void {
        this.subscription?.unsubscribe();
    }
}

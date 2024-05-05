import { Component, Input, OnDestroy, OnInit } from "@angular/core";
import { MusicService } from "../../shared/services/music.service";
import { Music } from "../../shared/utils/music";
import { PageEvent } from "@angular/material/paginator";
import { DatabaseService } from "../../shared/services/database.service";
import { Subscription } from "rxjs";

@Component({
    selector: "app-search-list",
    templateUrl: "./search-list.component.html",
    styleUrl: "./search-list.component.scss",
})
export class SearchListComponent implements OnDestroy, OnInit {
    @Input()
    set query(queryWord: string) {
        this.databaseService.searchQuery(queryWord);
    }

    private subscription: Subscription | undefined;
    protected searchList: Music[] = [];

    protected pageSize: number = 10;
    protected pageIndex: number = 0;

    set nameQuery(nameQuery: string | null) {
        this.databaseService.searchQuery(nameQuery);
    }

    get nameQuery() {
        return this.databaseService.searchOptions.name;
    }

    set authorQuery(authorQuery: string | null) {
        this.databaseService.searchAuthor(authorQuery);
    }

    get authorQuery() {
        return this.databaseService.searchOptions.author;
    }

    set albumQuery(albumQuery: string | null) {
        this.databaseService.searchAlbum(albumQuery);
    }

    get albumQuery() {
        return this.databaseService.searchOptions.album;
    }

    constructor(
        private databaseService: DatabaseService,
        private musicService: MusicService,
    ) {}

    play(m: Music) {
        this.musicService.changeMusic(m);
    }

    pageChange(event: PageEvent) {
        this.pageSize = event.pageSize;
        this.pageIndex = event.pageIndex;
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

    tagsChange(tags: string[]) {
        this.databaseService.searchTags(tags);
    }
}

import { Component, Input, OnDestroy, OnInit } from "@angular/core";
import { FlexLayoutModule } from "@angular/flex-layout";
import { AsyncPipe, NgForOf, NgIf, NgOptimizedImage } from "@angular/common";
import { MatListModule } from "@angular/material/list";
import { MusicService } from "../../shared/services/music.service";
import { Music } from "../../shared/utils/music";
import { MatPaginator, PageEvent } from "@angular/material/paginator";
import { DatabaseService } from "../../shared/services/database.service";
import { Subscription } from "rxjs";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInput } from "@angular/material/input";
import { MatCardModule } from "@angular/material/card";
import { MatCheckbox } from "@angular/material/checkbox";
import { MatChipsModule } from "@angular/material/chips";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import {
    MatAutocomplete,
    MatAutocompleteTrigger,
    MatOption,
} from "@angular/material/autocomplete";
import { MatIcon } from "@angular/material/icon";
import { TagChipInputComponent } from "../shared/tag-chipinput/tag-chip-input.component";

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
        MatFormFieldModule,
        MatInput,
        MatCardModule,
        MatCheckbox,
        MatChipsModule,
        ReactiveFormsModule,
        MatAutocompleteTrigger,
        MatAutocomplete,
        MatOption,
        MatIcon,
        TagChipInputComponent,
        FormsModule,
    ],
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

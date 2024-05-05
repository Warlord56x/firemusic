import { Component, Input, OnInit } from "@angular/core";
import { DatabaseService } from "../../shared/services/database.service";
import { AuthService } from "../../shared/services/auth.service";
import { Music } from "../../shared/utils/music";
import { PageEvent } from "@angular/material/paginator";
import { MusicService } from "../../shared/services/music.service";
import { StorageService } from "../../shared/services/storage.service";

@Component({
    selector: "app-dashboard",
    templateUrl: "./dashboard.component.html",
    styleUrl: "./dashboard.component.scss",
})
export class DashboardComponent implements OnInit {
    @Input({
        transform: (value: string): number =>
            ({ mymusics: 0, upload: 1, profile: 2 })[value] || 0,
    })
    tab: number = 0;

    musics: Music[] | undefined;
    protected pageSize: number = 10;
    protected pageIndex: number = 0;

    constructor(
        protected storageService: StorageService,
        private databaseService: DatabaseService,
        private authService: AuthService,
        private musicService: MusicService,
    ) {}

    play(m: Music) {
        this.musicService.changeMusic(m);
    }

    ngOnInit(): void {
        this.getCards().then((res) => {
            this.musics = res;
        });
    }

    async getCards() {
        return await this.databaseService.getUserMusics(
            this.authService.user!.uid,
        );
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

    protected readonly Array = Array;
}

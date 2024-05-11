import { Component, OnInit } from "@angular/core";
import { DatabaseService } from "../../shared/services/database.service";
import { MusicService } from "../../shared/services/music.service";
import { PageEvent } from "@angular/material/paginator";
import { Album } from "../../shared/utils/album";
import { AuthService } from "../../shared/services/auth.service";
import { Music } from "../../shared/utils/music";

@Component({
    selector: "app-album-list",
    templateUrl: "./album-list.component.html",
    styleUrl: "./album-list.component.scss",
})
export class AlbumListComponent {
    protected _albums: Album[] = [];
    protected albumMusics: [{ uid: string; title: string; music: Music }] = [
        {
            title: "",
            uid: "",
            music: {
                name: "",
                rating: 0,
                uid: "",
                musicId: "",
                tags: [],
                uploadDate: new Date(),
            },
        },
    ];
    protected pageSize: number = 10;
    protected pageIndex: number = 0;

    constructor(
        protected databaseService: DatabaseService,
        private musicService: MusicService,
        private authService: AuthService,
    ) {
        this.albumMusics.pop();
        this.databaseService
            .getUserAlbums(this.authService.user!.uid)
            .then((result) => {
                this.albums = result;
            });
    }

    get albums() {
        return this._albums;
    }

    set albums(albums: Album[]) {
        this._albums = albums;
        for (const album of albums) {
            this.databaseService.getMusicsFrom(album).then((result) => {
                for (const music of result) {
                    this.albumMusics.push({
                        title: album.title,
                        uid: album.uid,
                        music: music,
                    });
                }
            });
        }
    }

    play(music: Music) {
        this.musicService.changeMusic(music);
    }

    pageChange(event: PageEvent) {
        this.pageSize = event.pageSize;
        this.pageIndex = event.pageIndex;
    }
}

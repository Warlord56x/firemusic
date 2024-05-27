import { Component } from "@angular/core";
import { Album } from "../../shared/utils/album";
import { Music } from "../../shared/utils/music";
import { DatabaseService } from "../../shared/services/database.service";
import { MusicService } from "../../shared/services/music.service";
import { AuthService } from "../../shared/services/auth.service";
import { PageEvent } from "@angular/material/paginator";
import { Playlist } from "../../shared/utils/playlist";

@Component({
    selector: "app-playlists",
    templateUrl: "./playlists.component.html",
    styleUrl: "./playlists.component.scss",
})
export class PlaylistsComponent {
    protected pageSize: number = 10;
    protected pageIndex: number = 0;

    protected playlists: Playlist[] | undefined;
    protected playlistMusics: [{ uid: string; title: string; music: Music }] = [
        {
            title: "",
            uid: "",
            music: {
                name: "",
                author: "",
                rating: 0,
                uid: "",
                musicId: "",
                tags: [],
                uploadDate: new Date(),
            },
        },
    ];

    constructor(
        protected databaseService: DatabaseService,
        private musicService: MusicService,
        private authService: AuthService,
    ) {
        this.init();
    }

    async init() {
        this.playlistMusics.pop();
        this.playlists = await this.databaseService.getUserPlaylists(
            this.authService.user!.uid,
        );
        for (const playlist of this.playlists) {
            const musics = await this.databaseService.getMusicsFrom(playlist);
            console.log(musics);
            for (const music of musics) {
                this.playlistMusics.push({
                    title: playlist.title,
                    uid: playlist.uid,
                    music,
                });
            }
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

import { Injectable } from "@angular/core";
import { Music } from "../utils/music";
import { PlaylistSelectDialogComponent } from "../../components/shared/playlist-select-dialog/playlist-select-dialog.component";
import { take } from "rxjs";
import { Playlist } from "../utils/playlist";
import { AuthService } from "./auth.service";
import { DatabaseService } from "./database.service";
import { MatDialog } from "@angular/material/dialog";
import { AlbumSelectDialogComponent } from "../../components/shared/album-select-dialog/album-select-dialog.component";
import { Album } from "../utils/album";

@Injectable({
    providedIn: "root",
})
export class CustomDialogService {
    constructor(
        private dialog: MatDialog,
        private authService: AuthService,
        private databaseService: DatabaseService,
    ) {}

    async openAlbumDialog(music: Music) {
        const matDialogRef = this.dialog.open(AlbumSelectDialogComponent, {
            data: {
                title: `Add ${music.name} to an album`,
                subject: "",
                nameOfAction: "Add",
                optionalData: await this.databaseService.getUserAlbums(
                    this.authService.user!.uid,
                ),
            },
        });
        matDialogRef
            .afterClosed()
            .pipe(take(1))
            .subscribe((res: Album) => {
                if (res === undefined) {
                    return;
                }
                const album: Partial<Album> = {
                    author: this.authService.user!.displayName + "",
                    title: res.title,
                    description: res.description,
                    uid: this.authService.user!.uid,
                };
                this.databaseService.addTo(album, music);
            });
    }

    async openPlaylistDialog(music: Music) {
        const matDialogRef = this.dialog.open(PlaylistSelectDialogComponent, {
            data: {
                title: `Add ${music.name} to a Playlist`,
                subject: "",
                nameOfAction: "Add",
                optionalData: await this.databaseService.getUserPlaylists(
                    this.authService.user!.uid,
                ),
            },
        });
        matDialogRef
            .afterClosed()
            .pipe(take(1))
            .subscribe((res: string) => {
                if (res === undefined) {
                    return;
                }
                const playlist: Partial<Playlist> = {
                    author: this.authService.user!.displayName + "",
                    title: res,
                    uid: this.authService.user!.uid,
                };
                this.databaseService.addTo(playlist, music);
            });
    }
}

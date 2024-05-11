import { Component, Inject } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { DialogData } from "../../../shared/utils/dialogData";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Playlist } from "../../../shared/utils/playlist";

@Component({
    selector: "app-playlist-select-dialog",
    templateUrl: "./playlist-select-dialog.component.html",
    styleUrl: "./playlist-select-dialog.component.scss",
})
export class PlaylistSelectDialogComponent {
    constructor(
        public dialogRef: MatDialogRef<PlaylistSelectDialogComponent>,
        @Inject(MAT_DIALOG_DATA)
        protected data: DialogData,
        private formBuilder: FormBuilder,
    ) {}

    selectPlaylistForm: FormGroup = this.formBuilder.group({
        playlist: ["", [Validators.required]],
    });
    playlists: Playlist[] = this.data.optionalData;

    submitSelection() {
        if (this.selectPlaylistForm.valid) {
            const playlist: string = this.selectPlaylistForm.value.playlist;
            this.dialogRef.close(playlist);
        }
    }
}

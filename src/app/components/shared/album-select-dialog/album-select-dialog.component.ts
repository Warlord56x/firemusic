import { Component, Inject } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { DialogData } from "../../../shared/utils/dialogData";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Album } from "../../../shared/utils/album";

@Component({
    selector: "app-album-select-dialog",
    templateUrl: "./album-select-dialog.component.html",
    styleUrl: "./album-select-dialog.component.scss",
})
export class AlbumSelectDialogComponent {
    constructor(
        public dialogRef: MatDialogRef<AlbumSelectDialogComponent>,
        @Inject(MAT_DIALOG_DATA)
        protected data: DialogData,
        private formBuilder: FormBuilder,
    ) {}

    selectAlbumForm: FormGroup = this.formBuilder.group({
        album: [{}, [Validators.required]],
    });
    albums: Album[] = this.data.optionalData;

    submitSelection() {
        if (this.selectAlbumForm.valid) {
            const album = this.selectAlbumForm.value.album;
            this.dialogRef.close(album);
        }
    }
}

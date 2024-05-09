import { Component, Inject } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { DialogData } from "../../../shared/utils/dialogData";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Music } from "../../../shared/utils/music";

@Component({
    selector: "app-modify-dialog",
    templateUrl: "./modify-dialog.component.html",
    styleUrl: "./modify-dialog.component.scss",
})
export class ModifyDialogComponent {
    protected musicData: Music = this.data.optionalData;
    protected modifyForm: FormGroup = this.formBuilder.group({
        name: [this.musicData.name, [Validators.pattern("^[A-Za-z0-9_ ]*$")]],
        description: [this.musicData.description],
    });

    constructor(
        public dialogRef: MatDialogRef<ModifyDialogComponent>,
        @Inject(MAT_DIALOG_DATA)
        protected data: DialogData,
        private formBuilder: FormBuilder,
    ) {}

    tagsChange(tags: string[]) {
        this.musicData.tags = tags;
    }

    submitModifications() {
        if (this.modifyForm.valid) {
            this.musicData.name = this.modifyForm.value.name;
            this.musicData.description = this.modifyForm.value.description;
            this.dialogRef.close(this.musicData);
        }
    }
}

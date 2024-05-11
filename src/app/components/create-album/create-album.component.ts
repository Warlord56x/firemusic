import { Component } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { DatabaseService } from "../../shared/services/database.service";
import { AuthService } from "../../shared/services/auth.service";

@Component({
    selector: "app-create-album",
    templateUrl: "./create-album.component.html",
    styleUrl: "./create-album.component.scss",
})
export class CreateAlbumComponent {
    constructor(
        private formBuilder: FormBuilder,
        private databaseService: DatabaseService,
        private authService: AuthService,
    ) {}
    albumForm: FormGroup = this.formBuilder.group({
        title: [
            "",
            [Validators.required, Validators.pattern("^[A-Za-z0-9_]*$")],
        ],
        description: ["", [Validators.maxLength(400)]],
    });
    taskDone: boolean = false;

    onSubmit() {
        if (this.albumForm.valid) {
            this.databaseService
                .uploadAlbum({
                    author: this.authService.user!.uid,
                    title: this.albumForm.value.title,
                    description: this.albumForm.value.description,
                })
                .then(() => {
                    this.taskDone = true;
                });
        }
    }
}

import { Component } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { AuthService } from "../../shared/services/auth.service";
import { DatabaseService } from "../../shared/services/database.service";

@Component({
    selector: "app-profile",
    templateUrl: "./profile.component.html",
    styleUrl: "./profile.component.scss",
})
export class ProfileComponent {
    profileForm: FormGroup;

    constructor(
        readonly authService: AuthService,
        readonly databaseService: DatabaseService,
        private formBuilder: FormBuilder,
    ) {
        this.profileForm = this.formBuilder.group({
            name: ["", [Validators.pattern("^[A-Za-z0-9_]*$")]],
        });
    }

    onSubmit() {
        const profile = {
            displayName: this.profileForm.value.name,
        };
        this.authService.updateProfile(profile);
        this.databaseService.updateUser(profile);
    }
}

import { Component } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { AuthService } from "../../shared/services/auth.service";

@Component({
    selector: "app-sign-up",
    templateUrl: "./sign-up.component.html",
    styleUrl: "../../shared/styles/sign-styles.scss",
})
export class SignUpComponent {
    signupForm: FormGroup;

    constructor(
        private authService: AuthService,
        private formBuilder: FormBuilder,
    ) {
        this.signupForm = this.formBuilder.group({
            name: [
                "",
                [Validators.required, Validators.pattern("^[A-Za-z0-9_]*$")],
            ],
            email: ["", [Validators.required, Validators.email]],
            password: ["", [Validators.required, Validators.minLength(8)]],
            confirmPassword: ["", [Validators.required]],
        });
    }

    onSubmit() {
        if (this.signupForm.valid) {
            this.authService.signUp(
                this.signupForm.value.name,
                this.signupForm.value.email,
                this.signupForm.value.password,
            );
        }
    }
}

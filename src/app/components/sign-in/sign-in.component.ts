import { Component } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { AuthService } from "../../shared/services/auth.service";

@Component({
    selector: "app-sign-in",
    templateUrl: "./sign-in.component.html",
    styleUrl: "../../shared/styles/sign-styles.scss",
})
export class SignInComponent {
    signupForm: FormGroup = new FormBuilder().group({
        email: ["", [Validators.required, Validators.email]],
        password: ["", [Validators.required, Validators.minLength(8)]],
    });
    errorMessage: string = "";

    private err: any = {
        "auth/invalid-email": "Invalid email",
        "auth/user-disabled": "Invalid password",
        "auth/wrong-password": "Invalid password",
        "auth/user-not-found": "User not found",
        "auth/invalid-credential": "Invalid credentials",
    };

    constructor(private authService: AuthService) {}

    onSubmit() {
        if (this.signupForm.valid) {
            this.authService
                .signIn(
                    this.signupForm.value.email,
                    this.signupForm.value.password,
                )
                .catch((error: any) => {
                    this.errorMessage = this.err[error.code];
                });
        } else {
            this.errorMessage = "Invalid format";
        }
    }
}

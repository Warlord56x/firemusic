import { Component } from "@angular/core";
import { MatFormFieldModule } from "@angular/material/form-field";
import {
    FormBuilder,
    FormGroup,
    FormsModule,
    ReactiveFormsModule,
    Validators,
} from "@angular/forms";
import { MatInputModule } from "@angular/material/input";
import { MatButton } from "@angular/material/button";
import { FlexLayoutModule } from "@angular/flex-layout";
import { AuthService } from "../../shared/services/auth.service";
import { MatIcon } from "@angular/material/icon";
import { RouterLink } from "@angular/router";

@Component({
    selector: "app-sign-up",
    standalone: true,
    imports: [
        FlexLayoutModule,
        ReactiveFormsModule,
        FormsModule,
        MatFormFieldModule,
        MatInputModule,
        ReactiveFormsModule,
        MatButton,
        MatIcon,
        RouterLink,
    ],
    templateUrl: "./sign-up.component.html",
    styleUrl: "../../shared/styles/sign-styles.scss",
})
export class SignupComponent {
    signupForm: FormGroup;

    constructor(
        private authService: AuthService,
        private formBuilder: FormBuilder,
    ) {
        this.signupForm = this.formBuilder.group({
            name: [
                "",
                Validators.required,
                Validators.pattern("^[A-Za-z0-9_]*$"),
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

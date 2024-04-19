import { Component } from '@angular/core';
import { FlexModule } from '@angular/flex-layout';
import { MatButton } from '@angular/material/button';
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import {
    FormBuilder,
    FormGroup,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { AuthService } from '../../shared/services/auth.service';
import { MatIcon } from '@angular/material/icon';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-sign-in',
    standalone: true,
    imports: [
        FlexModule,
        MatButton,
        MatError,
        MatFormField,
        MatInput,
        MatLabel,
        ReactiveFormsModule,
        MatIcon,
        RouterLink,
    ],
    templateUrl: './sign-in.component.html',
    styleUrl: './sign-in.component.scss',
})
export class SignInComponent {
    signupForm: FormGroup = new FormBuilder().group({
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(8)]],
    });
    errorMessage: string = '';

    private err: any = {
        'auth/invalid-email': 'Invalid email',
        'auth/user-disabled': 'Invalid password',
        'auth/wrong-password': 'Invalid password',
        'auth/user-not-found': 'User not found',
        'auth/invalid-credential': 'Invalid credentials',
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
            this.errorMessage = 'Invalid format';
        }
    }
}

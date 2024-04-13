import { Component } from '@angular/core';
import { FlexModule } from '@angular/flex-layout';
import { AuthService } from '../../shared/services/auth.service';
import { MatButton } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { NgIf } from '@angular/common';

@Component({
    selector: 'app-verify-email',
    standalone: true,
    imports: [FlexModule, MatButton, RouterLink, NgIf],
    templateUrl: './verify-email.component.html',
    styleUrl: './verify-email.component.scss',
})
export class VerifyEmailComponent {
    constructor(protected authService: AuthService) {}
}

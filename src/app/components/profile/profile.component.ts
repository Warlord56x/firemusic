import { Component } from '@angular/core';
import { FlexModule } from '@angular/flex-layout';
import { MatButton } from '@angular/material/button';
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import {
    FormBuilder,
    FormGroup,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../shared/services/auth.service';
import { MatList, MatListItem } from '@angular/material/list';
import { DatabaseService } from '../../shared/services/database.service';

@Component({
    selector: 'app-profile',
    standalone: true,
    imports: [
        FlexModule,
        MatButton,
        MatError,
        MatFormField,
        MatIcon,
        MatInput,
        MatLabel,
        ReactiveFormsModule,
        RouterLink,
        MatList,
        MatListItem,
    ],
    templateUrl: './profile.component.html',
    styleUrl: './profile.component.scss',
})
export class ProfileComponent {
    profileForm: FormGroup;

    constructor(
        readonly authService: AuthService,
        readonly databaseService: DatabaseService,
        private formBuilder: FormBuilder,
    ) {
        this.profileForm = this.formBuilder.group({
            name: ['', [Validators.pattern('^[A-Za-z0-9_]*$')]],
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

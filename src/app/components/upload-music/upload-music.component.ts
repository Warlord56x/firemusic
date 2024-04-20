import { Component, ElementRef, ViewChild } from '@angular/core';
import { StorageService } from '../../shared/services/storage.service';
import {
    FormBuilder,
    FormGroup,
    FormsModule,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButton } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { RouterLink } from '@angular/router';
import { MatIcon } from '@angular/material/icon';
import { NgOptimizedImage } from '@angular/common';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import { AuthService } from '../../shared/services/auth.service';

@Component({
    selector: 'app-upload-music',
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
        NgOptimizedImage,
        MatSlideToggle,
    ],
    templateUrl: './upload-music.component.html',
    styleUrl: './upload-music.component.scss',
})
export class UploadMusicComponent {
    @ViewChild('img') img: ElementRef | undefined;
    @ViewChild('musicName') musicName: ElementRef | undefined;
    musicForm: FormGroup;

    imgFile: File | undefined;
    audioFile: File | undefined;

    constructor(
        readonly storageService: StorageService,
        readonly formBuilder: FormBuilder,
        readonly authService: AuthService,
    ) {
        this.musicForm = this.formBuilder.group({
            name: [
                '',
                [Validators.required, Validators.pattern('^[A-Za-z0-9_]*$')],
            ],
            album: ['', []],
            public: ['', []],
        });
    }

    updateImage(event: any) {
        event.preventDefault();
        this.imgFile = event.target.files[0];
        this.img!.nativeElement.src = URL.createObjectURL(
            event.target.files[0],
        );
    }

    onSubmit() {
        console.log('submitted');
        if (this.musicForm.valid && this.audioFile) {
            this.storageService.uploadMusic(this.audioFile, this.imgFile, {
                name: this.musicForm.value.name,
                author: this.authService.user?.displayName,
                album: this.musicForm.value.album,
            });
        }
    }

    updateMusic(event: any) {
        event.preventDefault();
        this.audioFile = event.target.files[0];
        this.musicName!.nativeElement.value = this.audioFile?.name
            .split('.')
            .shift();
    }
}

import { Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
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
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { Subscription } from 'rxjs';

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
        MatProgressSpinner,
    ],
    templateUrl: './upload-music.component.html',
    styleUrl: './upload-music.component.scss',
})
export class UploadMusicComponent implements OnDestroy {
    @ViewChild('img') img: ElementRef | undefined;
    @ViewChild('musicName') musicName: ElementRef | undefined;
    musicForm: FormGroup;

    imgFile: File | undefined;
    audioFile: File | undefined;

    taskProgress: number = 0;

    percentSubscribe: Subscription | undefined;

    constructor(
        readonly storageService: StorageService,
        readonly formBuilder: FormBuilder,
        readonly authService: AuthService,
    ) {
        this.musicForm = this.formBuilder.group({
            name: [
                '',
                [Validators.required, Validators.pattern('^[A-Za-z0-9_ ]*$')],
            ],
            album: ['', []],
        });
    }

    updateImage(event: any) {
        event.preventDefault();
        this.imgFile = event.target.files[0];
        this.img!.nativeElement.src = URL.createObjectURL(
            event.target.files[0],
        );
    }

    updateMusic(event: any) {
        event.preventDefault();
        this.audioFile = event.target.files[0];
        this.musicForm.setValue({
            name: this.audioFile?.name.split('.').shift(),
            album: '',
        });
    }

    progress() {
        if (this.taskProgress === 100.0) {
            this.percentSubscribe?.unsubscribe();
        }
        return this.taskProgress;
    }

    async onSubmit() {
        if (this.musicForm.valid && this.audioFile) {
            const uploadTask = this.storageService.uploadMusic(
                this.audioFile,
                this.imgFile,
                {
                    name: this.musicForm.value.name,
                    author: this.authService.user?.displayName,
                    album: this.musicForm.value.album,
                    rating: 0,
                },
            );
            this.percentSubscribe = uploadTask
                .percentageChanges()
                .subscribe((next: number | undefined) => {
                    if (next) {
                        this.taskProgress = next;
                    }
                });
        }
    }

    ngOnDestroy(): void {
        this.percentSubscribe?.unsubscribe();
    }
}

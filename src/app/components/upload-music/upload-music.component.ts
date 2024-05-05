import { Component, ElementRef, OnDestroy, ViewChild } from "@angular/core";
import { StorageService } from "../../shared/services/storage.service";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { AuthService } from "../../shared/services/auth.service";
import { Subscription } from "rxjs";
import { SupportedTypes } from "../../shared/directives/dnd.directive";

@Component({
    selector: "app-upload-music",
    templateUrl: "./upload-music.component.html",
    styleUrl: "./upload-music.component.scss",
})
export class UploadMusicComponent implements OnDestroy {
    @ViewChild("img") img: ElementRef | undefined;
    @ViewChild("imgInput") imgInput: ElementRef | undefined;
    @ViewChild("audioInput") audioInput: ElementRef | undefined;
    musicForm: FormGroup;
    tags: string[] = [];

    imgFile: File | undefined;
    audioFile: File | undefined;

    taskProgress: number = 0;
    taskDone: boolean = false;

    percentSubscribe: Subscription | undefined;

    protected readonly SupportedTypes = SupportedTypes;
    protected musicName = "";

    constructor(
        readonly storageService: StorageService,
        readonly formBuilder: FormBuilder,
        readonly authService: AuthService,
    ) {
        this.musicForm = this.formBuilder.group({
            name: [
                "",
                [Validators.required, Validators.pattern("^[A-Za-z0-9_ ]*$")],
            ],
            album: ["", []],
            description: ["", []],
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
        this.music = this.audioFile?.name.split(".").shift();
    }

    set music(name: string | undefined) {
        this.musicForm.setValue({
            name: name,
            album: "",
            description: "",
        });
        this.musicName = this.musicForm.value.name;
    }

    progress() {
        return this.taskProgress;
    }

    async onSubmit() {
        console.log("submit");
        this.taskDone = false;
        if (this.musicForm.valid && this.audioFile) {
            const uploadTask = this.storageService.uploadMusic(
                this.audioFile,
                this.imgFile,
                {
                    name: this.musicForm.value.name,
                    author: this.authService.user?.displayName,
                    album: this.musicForm.value.album,
                    description: this.musicForm.value.description,
                    rating: 0,
                    uid: this.authService.user!.uid,
                    musicId: this.storageService.generateId(),
                    tags: [...new Set(this.tags)],
                    uploadDate: new Date(),
                },
            );
            this.percentSubscribe = uploadTask.percentageChanges().subscribe({
                next: (next: number | undefined) => {
                    if (next) {
                        this.taskProgress = next;
                    }
                },
                complete: () => {
                    this.taskDone = true;
                    this.percentSubscribe?.unsubscribe();
                    this.audioInput!.nativeElement.value = "";
                    this.imgInput!.nativeElement.value = "";
                    this.img!.nativeElement.src = "assets/img/fm_logo.png";
                    this.musicForm.reset();
                },
            });
        }
    }

    tagsChange(tags: string[]) {
        this.tags = tags;
    }

    ngOnDestroy(): void {
        this.percentSubscribe?.unsubscribe();
    }

    fileAudioUploadEvent(event: File | ErrorEvent) {
        if (event instanceof ErrorEvent) {
            window.alert(event.message);
        } else {
            this.music = event?.name.split(".").shift();
        }
    }

    fileImageUploadEvent(event: File | ErrorEvent) {
        if (event instanceof ErrorEvent) {
            window.alert(event.message);
        } else {
            this.img!.nativeElement.src = URL.createObjectURL(event);
        }
    }
}

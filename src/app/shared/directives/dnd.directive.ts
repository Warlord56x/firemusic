import {
    Directive,
    EventEmitter,
    HostBinding,
    HostListener,
    Input,
    Output,
} from "@angular/core";

export enum SupportedTypes {
    AUDIO,
    IMAGE,
}

@Directive({
    selector: "[fileDnd], fileDnd",
    standalone: true,
})
export class DndDirective {
    @HostBinding("class.fileOver") fileOver: boolean = false;
    @Output() fileDropped = new EventEmitter<File | ErrorEvent>();

    @Input({ transform: () => SupportedTypes }) type = SupportedTypes.AUDIO;

    @Input() fileDnd: SupportedTypes = SupportedTypes.AUDIO;

    private types = [
        ["audio/mpeg", "audio/wav", "audio/ogg"],
        ["image/png", "image/jpeg", "image/svg+xml", "image/tiff"],
    ];

    isTypeCorrect(file: File): boolean {
        const audioFileTypes = this.types[this.type];
        return audioFileTypes.includes(file.type);
    }

    @HostListener("dragover", ["$event"]) onDragOver(event: DragEvent) {
        event.preventDefault();
        event.stopPropagation();
        this.fileOver = true;
    }

    @HostListener("dragleave", ["$event"]) public onDragLeave(
        event: DragEvent,
    ) {
        event.preventDefault();
        event.stopPropagation();
        this.fileOver = false;
    }

    @HostListener("drop", ["$event"]) public ondrop(event: DragEvent) {
        event.preventDefault();
        event.stopPropagation();
        this.fileOver = false;
        const file = event.dataTransfer?.files[0];
        if (file) {
            if (!this.isTypeCorrect(file)) {
                this.fileDropped.emit(
                    new ErrorEvent("fileType", {
                        error: file,
                        message: `Not a supported ${this.type} file!`,
                    }),
                );
                return;
            }
            this.fileDropped.emit(file);
        }
    }
}

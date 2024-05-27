import {
    Component,
    ElementRef,
    Input,
    OnInit,
    ViewChild,
    viewChild,
} from "@angular/core";
import { DatabaseService } from "../../shared/services/database.service";
import { AuthService } from "../../shared/services/auth.service";
import { Music } from "../../shared/utils/music";
import { PageEvent } from "@angular/material/paginator";
import { MusicService } from "../../shared/services/music.service";
import { StorageService } from "../../shared/services/storage.service";
import { ConfirmationDialogComponent } from "../shared/confirmation-dialog/confirmation-dialog.component";
import { MatDialog } from "@angular/material/dialog";
import { take } from "rxjs";
import { ModifyDialogComponent } from "../shared/modify-dialog/modify-dialog.component";
import { CustomDialogService } from "../../shared/services/custom-dialog.service";

@Component({
    selector: "app-dashboard",
    templateUrl: "./dashboard.component.html",
    styleUrl: "./dashboard.component.scss",
})
export class DashboardComponent implements OnInit {
    @ViewChild("paginator") paginator!: ElementRef<HTMLDivElement>;
    @Input({
        transform: (value: string): number =>
            ({ mymusics: 0, upload: 1, createalbum: 2, profile: 3 })[value] ||
            0,
    })
    tab: number = 0;

    protected readonly Array = Array;

    musics: Music[] | undefined;
    protected pageSize: number = 10;
    protected pageIndex: number = 0;

    constructor(
        protected storageService: StorageService,
        private databaseService: DatabaseService,
        private authService: AuthService,
        private musicService: MusicService,
        private dialog: MatDialog,
        protected customDialogService: CustomDialogService,
    ) {}

    play(m: Music) {
        this.musicService.changeMusic(m);
    }

    ngOnInit(): void {
        this.getCards().then((res) => {
            this.musics = res;
        });
    }

    async getCards() {
        return await this.databaseService.getUserMusics(
            this.authService.user!.uid,
        );
    }

    tabChange(tab: number) {
        const element = this.paginator.nativeElement;
        element.style.display = tab > 0 ? "none" : "flex";
    }

    pageChange(event: PageEvent) {
        this.pageSize = event.pageSize;
        this.pageIndex = event.pageIndex;
    }

    openModifyDialog(music: Music) {
        const matDialogRef = this.dialog.open(ModifyDialogComponent, {
            data: {
                title: `Modify ${music.name}`,
                subject: ``,
                nameOfAction: "Modify",
                optionalData: music,
            },
        });
        matDialogRef
            .afterClosed()
            .pipe(take(1))
            .subscribe((res: Music) => {
                this.storageService
                    .updateMusic(res)
                    .then(() => console.log("success"));
                this.getCards().then((res) => {
                    this.musics = res;
                });
            });
    }

    openRemoveDialog(music: Music) {
        const matDialogRef = this.dialog.open(ConfirmationDialogComponent, {
            data: {
                title: "Confirm Deletion",
                subject: `Are you sure you want to delete the music named: "${music.name}"`,
                nameOfAction: "Delete",
            },
        });
        matDialogRef
            .afterClosed()
            .pipe(take(1))
            .subscribe((res: boolean) => {
                if (res === undefined) {
                    return;
                }
                if (res) {
                    this.storageService.deleteMusic(music);
                    this.getCards().then((res) => {
                        this.musics = res;
                    });
                }
            });
    }
}

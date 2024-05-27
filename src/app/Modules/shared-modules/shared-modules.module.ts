import { NgModule } from "@angular/core";
import { CommonModule, NgOptimizedImage } from "@angular/common";
import { UploadMusicComponent } from "../../components/upload-music/upload-music.component";
import { FlexLayoutModule } from "@angular/flex-layout";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatStepperModule } from "@angular/material/stepper";
import { DndDirective } from "../../shared/directives/dnd.directive";
import { MatFormFieldModule } from "@angular/material/form-field";
import { TagChipInputComponent } from "../../components/shared/tag-chip-input/tag-chip-input.component";
import { MatAnchor, MatButtonModule } from "@angular/material/button";
import { MatInputModule } from "@angular/material/input";
import { MatIconModule } from "@angular/material/icon";
import { MatProgressSpinner } from "@angular/material/progress-spinner";
import { SignInComponent } from "../../components/sign-in/sign-in.component";
import { SignUpComponent } from "../../components/sign-up/sign-up.component";
import { RouterLink } from "@angular/router";
import { VerifyEmailComponent } from "../../components/verify-email/verify-email.component";
import { ThreeComponent } from "../../components/three/three.component";
import { DashboardComponent } from "../../components/dashboard/dashboard.component";
import { MatTabBody, MatTabsModule } from "@angular/material/tabs";
import { MatCardModule } from "@angular/material/card";
import { MatMenuModule } from "@angular/material/menu";
import { MatPaginatorModule } from "@angular/material/paginator";
import { SearchListComponent } from "../../components/search-list/search-list.component";
import { HomeComponent } from "../../components/home/home.component";
import { MusicPlayerComponent } from "../../components/music-player/music-player.component";
import { ForgotPasswordComponent } from "../../components/forgot-password/forgot-password.component";
import { WildCardComponent } from "../../components/404/404.component";
import { ProfileComponent } from "../../components/profile/profile.component";
import {
    MatListItem,
    MatListModule,
    MatSelectionList,
} from "@angular/material/list";
import { MatChipsModule } from "@angular/material/chips";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { MatOptionModule } from "@angular/material/core";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatSliderModule } from "@angular/material/slider";
import { ErrorDialogComponent } from "../../components/shared/error-dialog/error-dialog.component";
import {
    MatDialogActions,
    MatDialogClose,
    MatDialogContent,
    MatDialogTitle,
} from "@angular/material/dialog";
import { ConfirmationDialogComponent } from "../../components/shared/confirmation-dialog/confirmation-dialog.component";
import { ModifyDialogComponent } from "../../components/shared/modify-dialog/modify-dialog.component";
import { TruncatePipe } from "../../shared/pipes/truncate.pipe";
import { CreateAlbumComponent } from "../../components/create-album/create-album.component";
import { AlbumSelectDialogComponent } from "../../components/shared/album-select-dialog/album-select-dialog.component";
import { MatSelect } from "@angular/material/select";
import { AlbumListComponent } from "../../components/album-list/album-list.component";
import { PlaylistsComponent } from "../../components/playlists/playlists.component";
import {
    MatExpansionModule,
    MatExpansionPanel,
    MatExpansionPanelDescription,
    MatExpansionPanelTitle,
} from "@angular/material/expansion";
import { PlaylistSelectDialogComponent } from "../../components/shared/playlist-select-dialog/playlist-select-dialog.component";

@NgModule({
    declarations: [
        PlaylistSelectDialogComponent,
        UploadMusicComponent,
        SignInComponent,
        SignUpComponent,
        VerifyEmailComponent,
        ThreeComponent,
        DashboardComponent,
        SearchListComponent,
        ProfileComponent,
        HomeComponent,
        MusicPlayerComponent,
        ForgotPasswordComponent,
        WildCardComponent,
        TagChipInputComponent,
        ErrorDialogComponent,
        ConfirmationDialogComponent,
        ModifyDialogComponent,
        CreateAlbumComponent,
        AlbumSelectDialogComponent,
        AlbumListComponent,
        PlaylistsComponent,
    ],
    imports: [
        CommonModule,
        FlexLayoutModule,
        ReactiveFormsModule,
        MatStepperModule,
        DndDirective,
        MatFormFieldModule,
        MatAnchor,
        MatInputModule,
        NgOptimizedImage,
        MatProgressSpinner,
        MatButtonModule,
        RouterLink,
        MatTabsModule,
        MatCardModule,
        MatIconModule,
        MatMenuModule,
        MatPaginatorModule,
        MatSelectionList,
        MatListItem,
        FormsModule,
        MatChipsModule,
        MatAutocompleteModule,
        MatOptionModule,
        MatListModule,
        MatToolbarModule,
        MatSliderModule,
        MatDialogActions,
        MatDialogClose,
        MatDialogContent,
        MatDialogTitle,
        TruncatePipe,
        MatSelect,
        MatExpansionModule,
        MatExpansionPanel,
        MatExpansionPanelTitle,
        MatExpansionPanelDescription,
        MatTabBody,
    ],
    exports: [
        PlaylistSelectDialogComponent,
        AlbumSelectDialogComponent,
        UploadMusicComponent,
        TagChipInputComponent,
        MusicPlayerComponent,
        ErrorDialogComponent,
        ConfirmationDialogComponent,
        ModifyDialogComponent,
        CreateAlbumComponent,
        AlbumListComponent,
        PlaylistsComponent,
        ThreeComponent,
    ],
})
export class SharedModulesModule {}

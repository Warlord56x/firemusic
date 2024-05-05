import { NgModule } from "@angular/core";
import { CommonModule, NgOptimizedImage } from "@angular/common";
import { UploadMusicComponent } from "../../components/upload-music/upload-music.component";
import { FlexLayoutModule } from "@angular/flex-layout";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatStepperModule } from "@angular/material/stepper";
import { DndDirective } from "../../shared/directives/dnd.directive";
import { MatFormFieldModule } from "@angular/material/form-field";
import { TagChipInputComponent } from "../../components/shared/tag-chipinput/tag-chip-input.component";
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
import { MatTabsModule } from "@angular/material/tabs";
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

@NgModule({
    declarations: [
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
    ],
    exports: [
        UploadMusicComponent,
        TagChipInputComponent,
        MusicPlayerComponent,
    ],
})
export class SharedModulesModule {}

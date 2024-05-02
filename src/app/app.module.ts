import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { RouterOutlet } from "@angular/router";
import { MatButtonModule } from "@angular/material/button";
import { HttpClientModule } from "@angular/common/http";
import { MatSidenavModule } from "@angular/material/sidenav";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatMenuModule } from "@angular/material/menu";
import { FlexLayoutModule } from "@angular/flex-layout";
import { MatIcon, MatIconModule } from "@angular/material/icon";
import { MatListItem, MatNavList, MatListModule } from "@angular/material/list";
import { CommonModule } from "@angular/common";
import { AngularFireModule } from "@angular/fire/compat";
import { environment } from "../environments/environment";
import { AngularFireAuthModule } from "@angular/fire/compat/auth";
import { AngularFirestoreModule } from "@angular/fire/compat/firestore";
import { AngularFireStorageModule } from "@angular/fire/compat/storage";
import { AngularFireDatabaseModule } from "@angular/fire/compat/database";
import { DashboardComponent } from "./components/dashboard/dashboard.component";
import { DragDropModule } from "@angular/cdk/drag-drop";
import { MusicPlayerComponent } from "./components/music-player/music-player.component";
import {
    MatFormField,
    MatPrefix,
    MatSuffix,
} from "@angular/material/form-field";
import { MatInput } from "@angular/material/input";
import { FormsModule } from "@angular/forms";
import { MatGridListModule } from "@angular/material/grid-list";
import { MatCard, MatCardModule } from "@angular/material/card";
import { MatTabsModule } from "@angular/material/tabs";
import { UploadMusicComponent } from "./components/upload-music/upload-music.component";
import { MatPaginator } from "@angular/material/paginator";

@NgModule({
    declarations: [AppComponent, DashboardComponent],
    imports: [
        AngularFireModule.initializeApp(environment.firebase),
        AngularFireAuthModule,
        AngularFirestoreModule,
        AngularFireStorageModule,
        AngularFireDatabaseModule,
        CommonModule,
        BrowserModule,
        BrowserAnimationsModule,
        AppRoutingModule,
        RouterOutlet,
        MatButtonModule,
        FlexLayoutModule,
        MatIcon,
        MatNavList,
        MatListItem,
        HttpClientModule,
        MatMenuModule,
        MatIconModule,
        MatToolbarModule,
        MatSidenavModule,
        MatListModule,
        MatCard,
        MatCardModule,
        DragDropModule,
        MusicPlayerComponent,
        MatInput,
        FormsModule,
        MatFormField,
        MatPrefix,
        MatGridListModule,
        MatCardModule,
        MatSuffix,
        MatTabsModule,
        UploadMusicComponent,
        MatPaginator,
    ],
    providers: [],
    bootstrap: [AppComponent],
})
export class AppModule {}

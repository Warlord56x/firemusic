import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { AppComponent } from "./app.component";
import { CommonModule } from "@angular/common";
import { AngularFireModule } from "@angular/fire/compat";
import { environment } from "../environments/environment";
import { AngularFireAuthModule } from "@angular/fire/compat/auth";
import { AngularFirestoreModule } from "@angular/fire/compat/firestore";
import { AngularFireStorageModule } from "@angular/fire/compat/storage";
import { AngularFireDatabaseModule } from "@angular/fire/compat/database";
import { SharedModulesModule } from "./Modules/shared-modules/shared-modules.module";
import { MatIcon } from "@angular/material/icon";
import {
    MatListItem,
    MatListItemIcon,
    MatNavList,
} from "@angular/material/list";
import { RouterLink, RouterOutlet } from "@angular/router";
import { MatSidenav, MatSidenavModule } from "@angular/material/sidenav";
import { FlexLayoutModule } from "@angular/flex-layout";
import { MatDivider } from "@angular/material/divider";
import { MatToolbar } from "@angular/material/toolbar";
import { MatIconButton } from "@angular/material/button";
import { MatFormField, MatSuffix } from "@angular/material/form-field";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { HttpClientModule } from "@angular/common/http";
import { AppRoutingModule } from "./app-routing.module";
import { MatInput } from "@angular/material/input";

@NgModule({
    declarations: [AppComponent],
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
        HttpClientModule,
        SharedModulesModule,
        MatIcon,
        MatNavList,
        MatListItemIcon,
        MatListItem,
        RouterLink,
        MatSidenavModule,
        FlexLayoutModule,
        MatDivider,
        MatIconButton,
        MatFormField,
        RouterOutlet,
        MatInput,
        MatSuffix,
        MatToolbar,
        MatSidenav,
    ],
    providers: [],
    bootstrap: [AppComponent],
})
export class AppModule {}

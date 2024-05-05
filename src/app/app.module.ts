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
import { MatListItem, MatNavList } from "@angular/material/list";
import { RouterLink, RouterOutlet } from "@angular/router";
import { MatSidenav, MatSidenavContainer } from "@angular/material/sidenav";
import { FlexLayoutModule } from "@angular/flex-layout";
import { MatDivider } from "@angular/material/divider";
import { MatToolbar } from "@angular/material/toolbar";
import { MatIconButton } from "@angular/material/button";
import { MatFormField } from "@angular/material/form-field";

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
        SharedModulesModule,
        MatIcon,
        MatNavList,
        MatListItem,
        RouterLink,
        MatSidenav,
        MatSidenavContainer,
        FlexLayoutModule,
        MatDivider,
        MatToolbar,
        MatIconButton,
        MatFormField,
        RouterOutlet,
    ],
    providers: [],
    bootstrap: [AppComponent],
})
export class AppModule {}

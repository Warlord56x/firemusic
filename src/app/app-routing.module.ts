import { NgModule } from "@angular/core";
import {
    RouterModule,
    Routes,
    withComponentInputBinding,
} from "@angular/router";
import { ThreeComponent } from "./components/three/three.component";
import { SignupComponent } from "./components/sign-up/sign-up.component";
import { DashboardComponent } from "./components/dashboard/dashboard.component";
import { SignInComponent } from "./components/sign-in/sign-in.component";
import { VerifyEmailComponent } from "./components/verify-email/verify-email.component";

import { AngularFireAuthGuard } from "@angular/fire/compat/auth-guard";
import { HomeComponent } from "./components/home/home.component";
import { ProfileComponent } from "./components/profile/profile.component";
import { WildCardComponent } from "./components/404/404.component";
import { SearchListComponent } from "./components/search-list/search-list.component";

const routes: Routes = [
    { path: "", pathMatch: "full", component: HomeComponent },
    { path: "three", component: ThreeComponent },
    { path: "sign-up", component: SignupComponent },
    { path: "sign-in", component: SignInComponent },
    { path: "verify-email", component: VerifyEmailComponent },
    { path: "home", component: HomeComponent },
    { path: "search", component: SearchListComponent },
    { path: "search/:query", component: SearchListComponent },
    {
        path: "profile",
        component: ProfileComponent,
        canActivate: [AngularFireAuthGuard],
    },
    {
        path: "dashboard",
        component: DashboardComponent,
        canActivate: [AngularFireAuthGuard],
    },
    { path: "**", component: WildCardComponent },
];

@NgModule({
    imports: [RouterModule.forRoot(routes, { bindToComponentInputs: true })],
    exports: [RouterModule],
})
export class AppRoutingModule {}

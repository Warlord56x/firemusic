import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ThreeComponent } from './components/three/three.component';
import { SignupComponent } from './components/sign-up/sign-up.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { SignInComponent } from './components/sign-in/sign-in.component';
import { VerifyEmailComponent } from './components/verify-email/verify-email.component';

import { AngularFireAuthGuard } from '@angular/fire/compat/auth-guard';
import { DragComponent } from './components/drag/drag.component';
import { HomeComponent } from './components/home/home.component';

const routes: Routes = [
    { path: '', pathMatch: 'full', component: HomeComponent },
    { path: 'three', component: ThreeComponent },
    { path: 'sign-up', component: SignupComponent },
    { path: 'sign-in', component: SignInComponent },
    { path: 'verify-email', component: VerifyEmailComponent },
    { path: 'drag', component: DragComponent },
    { path: 'home', component: HomeComponent },
    {
        path: 'dashboard',
        component: DashboardComponent,
        canActivate: [AngularFireAuthGuard],
    },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class AppRoutingModule {}

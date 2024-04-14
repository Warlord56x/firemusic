import { Injectable } from '@angular/core';
import * as auth from 'firebase/auth';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import firebase from 'firebase/compat';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import User = firebase.User;
import { firstValueFrom } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    constructor(
        public fireAuth: AngularFireAuth, // Inject Firebase auth service
        private router: Router,
        private fireStore: AngularFireStorage,
    ) {
        /* Saving user data in localstorage when
        logged in and setting up null when logged out */
        this.fireAuth.authState.subscribe((user) => {
            if (user) {
                localStorage.setItem('user', JSON.stringify(user)!);
                //JSON.parse(localStorage.getItem('user')!);
            } else {
                localStorage.setItem('user', 'null');
                //JSON.parse(localStorage.getItem('user')!);
            }
            this._user = user!;
        });
    }

    private _user: User | null = null;

    get user(): User | null {
        return this._user || null;
    }

    async testAudio(): Promise<string> {
        const audioRef = this.fireStore.ref('/Project_37.mp3');
        return await firstValueFrom(audioRef.getDownloadURL());
    }

    // Sign in with email/password
    async signIn(email: string, password: string) {
        return await this.fireAuth
            .signInWithEmailAndPassword(email, password)
            .then(() => {
                this.fireAuth.authState.subscribe((user) => {
                    if (user) {
                        this.router.navigate(['dashboard']);
                    }
                });
            });
    }
    // Sign up with email/password
    async signUp(email: string, password: string) {
        return this.fireAuth
            .createUserWithEmailAndPassword(email, password)
            .then(() => {
                /* Call the SendVerificationMail() function when new user sign
                up and returns promise */
                this.sendVerificationMail();
            })
            .catch((error) => {
                window.alert(error.message);
            });
    }
    // Send email verfificaiton when new user sign up
    async sendVerificationMail() {
        return this.fireAuth.currentUser.then((u: User | null) => {
            u?.sendEmailVerification();
            this.router.navigate(['verify-email']);
        });
    }
    // Reset Forgot password
    async forgotPassword(passwordResetEmail: string) {
        return this.fireAuth
            .sendPasswordResetEmail(passwordResetEmail)
            .then(() => {
                window.alert('Password reset email sent, check your inbox.');
            })
            .catch((error) => {
                window.alert(error);
            });
    }
    // Returns true when user is logged in
    get isLoggedIn(): boolean {
        this._user = JSON.parse(localStorage.getItem('user')!);
        return this._user !== null;
    }
    // Sign in with Google
    async GoogleAuth() {
        return this.authLogin(new auth.GoogleAuthProvider()).then(() => {
            this.router.navigate(['dashboard']);
        });
    }
    // Auth logic to run auth providers
    async authLogin(provider: any) {
        return this.fireAuth
            .signInWithPopup(provider)
            .then(() => {
                this.router.navigate(['dashboard']);
            })
            .catch((error) => {
                window.alert(error);
            });
    }

    // Sign out
    async signOut() {
        return this.fireAuth.signOut().then(() => {
            this.router.navigate(['sign-in']);
            this.fireAuth.signOut();
        });
    }
}

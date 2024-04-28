import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Profile } from '../utils/profile';

@Injectable({
    providedIn: 'root',
})
export class DatabaseService {
    constructor(private fireStore: AngularFirestore) {}

    async addUser(user: Profile) {
        return this.fireStore.collection<Profile>('users').add(user);
    }

    async updateUser(user: Profile) {
        return this.addUser(user);
    }
}

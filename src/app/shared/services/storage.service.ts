import { Injectable } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { firstValueFrom } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class StorageService {
    constructor(private fireStore: AngularFireStorage) {}

    async getAudio(path: string): Promise<{ url: string; metadata: any }> {
        const audioRef = this.fireStore.ref(`/${path}`);

        return {
            url: await firstValueFrom(audioRef.getDownloadURL()),
            metadata: await firstValueFrom(audioRef.getMetadata()),
        };
    }
}

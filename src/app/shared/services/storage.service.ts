import { Injectable } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { firstValueFrom } from 'rxjs';
import * as mm from 'music-metadata-browser';
import { IPicture } from 'music-metadata-browser';

@Injectable({
    providedIn: 'root',
})
export class StorageService {
    constructor(private fireStore: AngularFireStorage) {}

    async getAudio(path: string): Promise<{
        url: string;
        metadata: mm.IAudioMetadata;
        cover: string | undefined;
    }> {
        const audioRef = this.fireStore.ref(`/${path}`);
        const fullPath = await firstValueFrom(audioRef.getDownloadURL());

        const metadata = await mm.fetchFromUrl(fullPath);
        const _cover = mm.selectCover(metadata.common.picture);
        let cover;
        if (_cover) {
            cover = `data:image/jpeg;base64,${Buffer.from(_cover.data).toString('base64')}`;
        }

        return { url: fullPath, metadata: metadata, cover: cover };
    }
}

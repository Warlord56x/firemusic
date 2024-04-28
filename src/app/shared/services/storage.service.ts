import { Injectable } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { BehaviorSubject, combineLatest, Observable, switchMap } from 'rxjs';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Music } from '../utils/music';
import { AuthService } from './auth.service';
import firebase from 'firebase/compat';

@Injectable({
    providedIn: 'root',
})
export class StorageService {
    public queryResult$: Observable<Music[]>;

    nameFilter$: BehaviorSubject<string | null>;
    authorFilter$: BehaviorSubject<string | null>;
    albumFilter$: BehaviorSubject<string | null>;

    musicCollection = this.fireStore.collection('music');

    constructor(
        private fireStorage: AngularFireStorage,
        private fireStore: AngularFirestore,
        private auth: AuthService,
    ) {
        this.nameFilter$ = new BehaviorSubject<string | null>(null);
        this.authorFilter$ = new BehaviorSubject<string | null>(null);
        this.albumFilter$ = new BehaviorSubject<string | null>(null);

        this.queryResult$ = combineLatest([
            this.nameFilter$,
            this.authorFilter$,
            this.albumFilter$,
        ]).pipe(
            switchMap(([name, author, album]) =>
                this.fireStore
                    .collection<Music>('music', (ref) => {
                        let query: firebase.firestore.Query = ref;
                        if (name) {
                            query = query.where('name', '>=', name);
                        }
                        if (author) {
                            query = query.where('author', '>=', author);
                        }
                        if (album) {
                            query = query.where('album', '>=', album);
                        }
                        return query;
                    })
                    .valueChanges(),
            ),
        );
    }

    searchQuery(queryWord: string) {
        this.nameFilter$?.next(queryWord);
    }

    uploadMusic(audio: File, image: File | undefined, data: Music) {
        const task = this.fireStorage.upload(
            `/public/${this.auth.user?.uid}/music/${audio.name}/${audio.name}`,
            audio,
        );

        task.then(async (audioUrl) => {
            data.audio = await audioUrl.ref.getDownloadURL();
            data.uid = this.auth.user?.uid;
            if (image) {
                this.fireStorage
                    .upload(
                        `/public/${this.auth.user?.uid}/img/${audio.name}/${image.name}`,
                        image,
                    )
                    .then(async (imgUrl) => {
                        data.cover = await imgUrl.ref.getDownloadURL();
                        await this.musicCollection.add(data);
                    });
            } else {
                await this.musicCollection.add(data);
            }
        });

        return task;
    }
}

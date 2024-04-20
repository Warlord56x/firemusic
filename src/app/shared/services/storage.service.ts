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
    constructor(
        private fireStorage: AngularFireStorage,
        private fireStore: AngularFirestore,
        private auth: AuthService,
    ) {}

    public queryResult$: Observable<Music[]> | undefined;

    nameFilter$: BehaviorSubject<string | null> | undefined;
    authorFilter$: BehaviorSubject<string | null> | undefined;
    albumFilter$: BehaviorSubject<string | null> | undefined;

    musicCollection = this.fireStore.collection('music');

    searchQuery(queryWord: string) {
        this.nameFilter$ = new BehaviorSubject<string | null>(queryWord);
        this.authorFilter$ = new BehaviorSubject<string | null>(null);
        this.albumFilter$ = new BehaviorSubject<string | null>(null);

        this.queryResult$ = combineLatest([
            [this.nameFilter$],
            [this.authorFilter$],
            [this.albumFilter$],
        ]).pipe(
            switchMap(([name, author, album]) =>
                this.fireStore
                    .collection<Music>('music', (ref) => {
                        let query: firebase.firestore.Query = ref;
                        if (name.getValue()) {
                            query = query.where('name', '>=', name.getValue());
                        }
                        if (author.getValue()) {
                            query = query.where(
                                'author',
                                '>=',
                                author.getValue(),
                            );
                        }
                        if (album.getValue()) {
                            query = query.where(
                                'album',
                                '>=',
                                album.getValue(),
                            );
                        }
                        return query;
                    })
                    .valueChanges(),
            ),
        );
    }

    async uploadMusic(audio: File, image: File | undefined, data: Music) {
        return this.fireStorage
            .upload(`/public/${this.auth.user?.uid}/music/${audio.name}`, audio)
            .then(async (audioUrl) => {
                data.audio = await audioUrl.ref.getDownloadURL();
                data.uid = this.auth.user?.uid;
                if (image) {
                    this.fireStorage
                        .upload(
                            `/public/${this.auth.user?.uid}/img/${image.name}`,
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
    }
}

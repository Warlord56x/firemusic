import { Injectable, OnDestroy } from "@angular/core";
import { AngularFirestore } from "@angular/fire/compat/firestore";
import { Profile } from "../utils/profile";
import { BehaviorSubject, combineLatest, Observable, switchMap } from "rxjs";
import { Music } from "../utils/music";
import firebase from "firebase/compat";
import { Album } from "../utils/album";
import { Playlist } from "../utils/playlist";

@Injectable({
    providedIn: "root",
})
export class DatabaseService {
    public queryResult$: Observable<Music[]>;
    public tags: string[] = [];

    private nameFilter$: BehaviorSubject<string | null>;
    private authorFilter$: BehaviorSubject<string | null>;
    private albumFilter$: BehaviorSubject<string | null>;
    private tagFilter$: BehaviorSubject<string[] | null>;

    constructor(private fireStore: AngularFirestore) {
        this.nameFilter$ = new BehaviorSubject<string | null>(null);
        this.authorFilter$ = new BehaviorSubject<string | null>(null);
        this.albumFilter$ = new BehaviorSubject<string | null>(null);
        this.tagFilter$ = new BehaviorSubject<string[] | null>(null);

        this.queryResult$ = combineLatest([
            this.nameFilter$,
            this.authorFilter$,
            this.albumFilter$,
            this.tagFilter$,
        ]).pipe(
            switchMap(([name, author, album, tags]) =>
                this.fireStore
                    .collection<Music>("music", (ref) => {
                        let query: firebase.firestore.Query = ref;
                        if (name) {
                            query = query
                                .orderBy("name")
                                .startAt(name)
                                .endAt(name + "\uf8ff");
                        }

                        // TODO: Needs to build indexes to have multiple ranges (probably?), try to use the same technique as above
                        if (author) {
                            query = query.where("author", ">=", author);
                        }
                        if (album) {
                            query = query.where("album", ">=", album);
                        }
                        if (tags && tags.length > 0) {
                            query = query.where(
                                "tags",
                                "array-contains-any",
                                tags,
                            );
                        }
                        return query;
                    })
                    .valueChanges(),
            ),
        );
        this.searchQuery("");
        this.getMusicTags();
    }

    searchQuery(queryWord: string | null) {
        this.nameFilter$.next(queryWord);
    }

    searchAuthor(tags: string | null) {
        this.authorFilter$.next(tags);
    }

    searchTags(tags: string[]) {
        this.tagFilter$.next(tags);
    }

    get searchOptions() {
        return {
            name: this.nameFilter$.value,
            author: this.authorFilter$.value,
            album: this.albumFilter$.value,
            tags: this.tagFilter$.value,
        };
    }

    async uploadAlbum(album: Partial<Album>) {
        album.uid = this.fireStore.createId();
        album.musics = [];
        await this.fireStore.collection<Album>("albums").add(<Album>album);
    }

    async getUserAlbums(uid: string) {
        const albums: Album[] = [];
        await this.fireStore
            .collection<Album>("albums")
            .ref.where("author", "==", uid)
            .get()
            .then((docs) => {
                docs.forEach((doc) => {
                    albums.push(doc.data());
                });
            });
        return albums;
    }

    async getUserPlaylists(uid: string) {
        const albums: Playlist[] = [];
        await this.fireStore
            .collection<Playlist>("playlists")
            .ref.where("uid", "==", uid)
            .get()
            .then((docs) => {
                docs.forEach((doc) => {
                    albums.push(doc.data());
                });
            });
        return albums;
    }

    async addToPlaylist(playlist: Partial<Playlist>, music: Music) {
        const result = await this.fireStore
            .collection<Playlist>("playlists")
            .ref.where("title", "==", playlist.title)
            .get();

        if (result.size != 0) {
            result.forEach((doc) => {
                const updatedData = doc.data();
                updatedData.musics.push(music.musicId);
                doc.ref.update(updatedData);
            });
        } else {
            playlist.id = this.fireStore.createId();
            playlist.musics = [music.musicId];
            await this.fireStore
                .collection<Playlist>("playlists")
                .add(<Playlist>playlist);
        }
    }

    async getMusicsFrom(list: Album | Playlist) {
        const musics: Music[] = [];
        const result = await this.fireStore
            .collection<Music>("music")
            .ref.where("musicId", "in", list.musics)
            .get();
        result.forEach((doc) => {
            musics.push(doc.data());
        });
        return musics;
    }

    getMusicTags() {
        const result = this.fireStore.collection<Music>("music").get();
        result
            .forEach((docs) => {
                docs.docs.forEach((doc) => {
                    if (doc.data().tags) {
                        this.tags.push(...doc.data().tags);
                    }
                });
            })
            .then(() => {
                this.tags = [...new Set(this.tags)];
            });
        return this.tags;
    }

    async getUserMusics(uid: string | undefined) {
        const result = await this.fireStore
            .collection<Music>("music")
            .ref.where("uid", "==", uid)
            .get();
        return result.docs.map((doc) => doc.data());
    }

    async addUser(user: Profile) {
        return this.fireStore.collection<Profile>("users").add(user);
    }

    async updateUser(user: Profile) {
        const result = await this.fireStore
            .collection<Profile>("users")
            .ref.where("uid", "==", user.uid)
            .get();
        result.docs.forEach((doc) => doc.ref.update(user));
    }
}

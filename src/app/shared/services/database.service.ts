import { Injectable } from "@angular/core";
import { AngularFirestore } from "@angular/fire/compat/firestore";
import { Profile } from "../utils/profile";
import { BehaviorSubject, combineLatest, map, Observable, tap } from "rxjs";
import { Music } from "../utils/music";
import { Album } from "../utils/album";
import { Playlist } from "../utils/playlist";
import { isPlaylist, isAlbum } from "../utils/typeGuards";

@Injectable({
    providedIn: "root",
})
export class DatabaseService {
    public queryResult$: Observable<Music[]>;
    public tags: string[] = [];

    private allMusic: Music[] = [];
    private nameFilter$: BehaviorSubject<string | null>;
    private authorFilter$: BehaviorSubject<string | null>;
    private albumFilter$: BehaviorSubject<string | null>;
    private tagFilter$: BehaviorSubject<string[] | null>;

    constructor(private fireStore: AngularFirestore) {
        this.nameFilter$ = new BehaviorSubject<string | null>(null);
        this.authorFilter$ = new BehaviorSubject<string | null>(null);
        this.albumFilter$ = new BehaviorSubject<string | null>(null);
        this.tagFilter$ = new BehaviorSubject<string[] | null>(null);

        this.fetchAllMusic();

        this.queryResult$ = combineLatest([
            this.nameFilter$,
            this.authorFilter$,
            this.albumFilter$,
            this.tagFilter$,
        ]).pipe(
            map(([name, author, album, tags]) =>
                this.filterMusic(name, author, tags),
            ),
        );
        this.getMusicTags();
    }

    private fetchAllMusic(): void {
        this.fireStore
            .collection<Music>("music")
            .valueChanges()
            .pipe(tap((music) => (this.allMusic = music)))
            .subscribe(() => {
                // Optionally trigger a filter refresh if necessary
                this.applyFilters();
            });
    }

    private filterMusic(
        name: string | null,
        author: string | null,
        tags: string[] | null,
    ): Music[] {
        return this.allMusic.filter((music) => {
            return (
                (!name ||
                    music.name.toLowerCase().includes(name.toLowerCase())) &&
                (!author ||
                    music.author
                        .toLowerCase()
                        .includes(author.toLowerCase())) &&
                (!tags ||
                    tags.length === 0 ||
                    tags.some((tag) => music.tags.includes(tag)))
            );
        });
    }

    private applyFilters(): void {
        // This triggers the filtering to re-apply
        this.queryResult$ = combineLatest([
            this.nameFilter$,
            this.authorFilter$,
            this.albumFilter$,
            this.tagFilter$,
        ]).pipe(
            map(([name, author, album, tags]) =>
                this.filterMusic(name, author, tags),
            ),
        );
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
        this.fireStore
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

    async getAlbums() {
        const albums: Album[] = [];
        this.fireStore
            .collection<Album>("albums")
            .ref.get()
            .then((albumsData) => {
                albumsData.forEach((album) => {
                    albums.push(album.data());
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

    async addTo(object: Partial<Playlist | Album>, music: Music) {
        let collectionName: string;

        if (isAlbum(object)) {
            collectionName = "albums";
        } else if (isPlaylist(object)) {
            collectionName = "playlists";
        } else {
            console.log(object);
            throw new Error("Object must be either an Album or a Playlist");
        }

        const result = await this.fireStore
            .collection<Playlist | Album>(collectionName)
            .ref.where("title", "==", object.title)
            .get();

        if (result.size != 0) {
            result.forEach((doc) => {
                const updatedData = doc.data();
                updatedData.musics.push(music.musicId);
                updatedData.musics = Array.from(new Set(updatedData.musics));
                doc.ref.update(updatedData);
            });
        } else {
            object.id = this.fireStore.createId();
            object.musics = [music.musicId];
            await this.fireStore
                .collection<Playlist | Album>(collectionName)
                .add(<Playlist | Album>object);
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

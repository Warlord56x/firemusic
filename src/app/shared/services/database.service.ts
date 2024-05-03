import { Injectable } from "@angular/core";
import { AngularFirestore } from "@angular/fire/compat/firestore";
import { Profile } from "../utils/profile";
import { BehaviorSubject, combineLatest, Observable, switchMap } from "rxjs";
import { Music } from "../utils/music";
import firebase from "firebase/compat";

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
                            query = query.where("name", ">=", name);
                        }
                        if (author) {
                            query = query.where("author", ">=", author);
                        }
                        if (album) {
                            query = query.where("album", ">=", album);
                        }
                        if (tags) {
                            query.where("tags", "array-contains-any", tags);
                        }
                        return query;
                    })
                    .valueChanges(),
            ),
        );
        this.searchQuery("");
        this.getMusicTags();
        console.log(this.tags);
    }

    searchQuery(queryWord: string | null) {
        this.nameFilter$.next(queryWord);
    }

    searchAuthor(tags: string | null) {
        this.authorFilter$.next(tags);
    }

    searchAlbum(tags: string | null) {
        this.albumFilter$.next(tags);
    }

    searchTags(tags: string[]) {
        this.tagFilter$.next(tags);
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
            .then(() => console.log(this.tags));
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

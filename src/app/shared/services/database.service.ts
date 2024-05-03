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

    nameFilter$: BehaviorSubject<string | null>;
    authorFilter$: BehaviorSubject<string | null>;
    albumFilter$: BehaviorSubject<string | null>;

    constructor(private fireStore: AngularFirestore) {
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
                        return query;
                    })
                    .valueChanges(),
            ),
        );
        this.searchQuery("");
    }

    searchQuery(queryWord: string | null) {
        this.nameFilter$?.next(queryWord);
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

import { Injectable } from "@angular/core";
import { AngularFireStorage } from "@angular/fire/compat/storage";
import { AngularFirestore } from "@angular/fire/compat/firestore";
import { Music } from "../utils/music";
import { AuthService } from "./auth.service";
import { combineLatestWith, map, Observable } from "rxjs";

@Injectable({
    providedIn: "root",
})
export class StorageService {
    musicCollection = this.fireStore.collection("music");

    constructor(
        private fireStorage: AngularFireStorage,
        private fireStore: AngularFirestore,
        private auth: AuthService,
    ) {}

    generateId() {
        return this.fireStore.createId();
    }

    uploadMusic(audio: File, image: File | undefined, data: Music) {
        const id = this.fireStore.createId();
        const task = this.fireStorage.upload(
            `/public/${this.auth.user?.uid}/music/${id}/${audio.name}`,
            audio,
        );

        task.then(async (audioUrl) => {
            data.audio = await audioUrl.ref.getDownloadURL();
            if (image) {
                this.fireStorage
                    .upload(
                        `/public/${this.auth.user?.uid}/img/${id}/${image.name}`,
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

    deleteMusic(music: Music) {
        let audioTask$ = new Observable();
        let imageTask$ = new Observable();

        const res = this.fireStore
            .collection<Music>("music")
            .ref.where("musicId", "==", music.musicId)
            .get();
        res.then((ref) => {
            ref.docs.forEach((doc) => {
                const data = doc.data();

                if (data.audio) {
                    audioTask$ = this.fireStorage
                        .refFromURL(data.audio)
                        .delete();
                }
                if (data.cover) {
                    imageTask$ = this.fireStorage
                        .refFromURL(data.cover)
                        .delete();
                }
                doc.ref.delete();
            });
        });

        return audioTask$.pipe(
            combineLatestWith(imageTask$),
            map(([task1, task2]) => (<number>task1 + <number>task2) / 2),
        );
    }
}

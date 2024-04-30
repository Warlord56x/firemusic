import { Injectable } from "@angular/core";
import { AngularFireStorage } from "@angular/fire/compat/storage";
import { AngularFirestore } from "@angular/fire/compat/firestore";
import { Music } from "../utils/music";
import { AuthService } from "./auth.service";

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

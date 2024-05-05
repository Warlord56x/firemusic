import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { Music } from "../utils/music";

@Injectable({
    providedIn: "root",
})
export class MusicService {
    private musicSubject = new Subject<Music>();
    music$ = this.musicSubject.asObservable();

    changeMusic(music: Music) {
        this.musicSubject.next(music);
    }
}

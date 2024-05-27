import { Album } from "./album";
import { Playlist } from "./playlist";

export function isPlaylist(obj: any): obj is Playlist {
    return (
        obj &&
        typeof obj.id === "string" &&
        typeof obj.uid === "string" &&
        typeof obj.title === "string" &&
        Array.isArray(obj.musics) &&
        typeof obj.author === "string" &&
        !obj.description
    );
}

export function isAlbum(obj: any): obj is Album {
    return (
        obj &&
        typeof obj.id === "string" &&
        typeof obj.uid === "string" &&
        typeof obj.title === "string" &&
        Array.isArray(obj.musics) &&
        typeof obj.author === "string" &&
        typeof obj.description === "string"
    );
}

export interface Music {
    name: string;
    author?: string | null;
    album?: string | null;
    cover?: string | null;
    audio?: string;
    rating: number;
    uid?: string;
}

export interface Music {
    name: string;
    author?: string | null;
    album?: string | null;
    cover?: string | null;
    audio?: string;
    description?: string;
    rating: number;
    uid?: string;
}

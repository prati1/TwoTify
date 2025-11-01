import type { Image } from "./users"

declare global {
    namespace Spotify {
        interface PlayerInit {
        name: string;
        getOAuthToken: (cb: (token: string) => void) => void;
        volume?: number;
        }

        interface Player {
        connect(): Promise<boolean>;
        disconnect(): void;
        addListener(event: string, cb: (...args: any[]) => void): boolean;
        removeListener(event: string, cb?: (...args: any[]) => void): boolean;
        getCurrentState(): Promise<any>;
        previousTrack(): Promise<void>;
        nextTrack(): Promise<void>;
        togglePlay(): Promise<void>;
        }
    }
    interface Window {
        Spotify: typeof Spotify,
        onSpotifyWebPlaybackSDKReady: () => void
    }
}

export interface Playlists {
    href: string,
    limit: number,
    next: string | null,
    offset: number,
    previous: string | null,
    total: number,
    items: Items[]
}

export type Items = {
    collaborative: boolean,
    description: string,
    href: string,
    id: string,
    images: Image[],
    name: string,
    owner: {
        external_urls: {
            spotify: string
        }
    },
    tracks: {
        href: string,
        total: number
    },
    public: boolean,
    snapshot_id: string,
    type: string,
    uri: string
}

export type Artist = {
    href: string,
    id: string,
    name: string,
    type: string,
    uri: string
}

export type TrackObject = {
    album: {
        album_type: string,
        total_tracks: number,
        available_markets: string[],
        external_urls: {
            spotify: string
        },
        href: string,
        id: string,
        images: Image[],
        artists: Artist[]
    },
    artists: Artist[]
    duration_ms: number,
    explicit: boolean,
    href: string,
    id: string,
    is_playable: boolean,
    name: string,
    popularity: number
    preview_url?: string,
    track_number: number,
    type: string,
    uri: string,
    is_local: boolean
}

export type ResumePoint = {
    fully_played: boolean,
    resume_position_ms: number
}

export type EpisodeObject = {
    audio_preview_url?: string,
    description: string,
    html_description: string,
    duration_ms: string,
    explicit: boolean,
    href: string,
    id: string,
    images: Image[],
    name: string,
    release_date: string,
    type: string,
    uri: string,
    resume_point: ResumePoint,
}

export type Track = {
    added_at?: string,
    is_local: boolean,
    added_by?: {
        external_urls: {
            spotify: string
        },
        href: string,
        id: string,
        type: string,
        uri: string
    },
    track: TrackObject | EpisodeObject
}

export interface PlaylistTracks {
    href: string,
    limit: number,
    next: string,
    offset: number,
    previous: string,
    total: integer,
    items: Track[]
}
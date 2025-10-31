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
interface Playlist {
    id: string,
    name: string
}

interface TracksResponse {
    next: string,
    offset: number,
    total: number,
    items: Track[]
}

interface Track {
    name: string,
    href: string,
    id: string,
    uri: string
}
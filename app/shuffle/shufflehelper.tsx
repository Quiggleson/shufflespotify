import { Dispatch, SetStateAction } from "react";

export async function getPlaylists(access_token: string, setPlaylists: Dispatch<SetStateAction<Playlist[]>>) {
    const url = 'https://api.spotify.com/v1/me/playlists';
    const payload = {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + access_token
        }
    }
    const response = await fetch(url, payload);
    const body = await response.json();
    setPlaylists(body["items"]);
}

export async function randomize(access_token: string, playlistId: string, setStatus: Dispatch<SetStateAction<string>>) {

    const uris: string[] = [];
    const fields = '?fields=next,offset,total,items(track(name,href,id,uri))'
    const limit = '&limit=50'
    let url = 'https://api.spotify.com/v1/playlists/' + playlistId + '/tracks' + fields + limit;
    while (url !== null) {
        const payload = {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + access_token
            },
        }
        const response = await fetch(url, payload);
        const body = await response.json();
        url = body['next']
        // Get list of uri's
        body['items'].forEach((item: {track: Track}) => {
            uris.push(item.track.uri);
        });
        setStatus('getting playlist ' + body['offset'] + ' out of ' + body['total']);
    }

    // shuffle uris
    let currentIndex = uris.length;

    // While there remain elements to shuffle...
    setStatus('shuffling playlist');
    while (currentIndex != 0) {

        // Pick a remaining element...
        const randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        // And swap it with the current element.
        [uris[currentIndex], uris[randomIndex]] = [
            uris[randomIndex], uris[currentIndex]];
    }

    setStatus('Deleting old order');

    // clear old songs
    // PUT one song
    const cleanuris = JSON.stringify(uris[0]).replaceAll("\"", "");
    url = "https://api.spotify.com/v1/playlists/" + playlistId + "/tracks?uris=" + cleanuris;
    const payload = {
        method: 'PUT',
        headers: {
            'Authorization': 'Bearer ' + access_token
        },
    }
    await fetch(url, payload);

    // DELETE that song
    url = "https://api.spotify.com/v1/playlists/" + playlistId + "/tracks?uris=" + cleanuris;
    const payload1 = {
        method: 'DELETE',
        headers: {
            'Authorization': 'Bearer ' + access_token
        },
        body: JSON.stringify({
            tracks: [
                { uri: uris[0] }
            ]
        }),
    }
    await fetch(url, payload1);

    const unique = Array.from(new Set(uris));

    // insert new songs
    let i = 0;
    const trackspercall = 100
    while (i < unique.length) {
        setStatus('inserting new songs ' + i + ' out of ' + unique.length);
        
        const cleanuris = 
            i + trackspercall <= unique.length ? 
            JSON.stringify(unique.slice(i, i + trackspercall))
                .replaceAll("\"", "")
                .slice(1, -1) : 
            JSON.stringify(unique.slice(i))
                .replaceAll("\"", "")
                .slice(1, -1);
        
        const url = "https://api.spotify.com/v1/playlists/" + playlistId + "/tracks?uris=" + cleanuris;
        const payload = {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + access_token
            },
        }
        await fetch(url, payload);
        i += trackspercall;
    }
    setStatus('Complete');

}
'use client';

import { getPlaylists, randomize } from "./shufflehelper";
import { redirect } from "next/navigation";
import { useState } from "react";

export default function Shuffle() {

    const [playlists, setPlaylists] = useState<Playlist[]>([]);
    const [playlistId, setPlaylistId] = useState('');
    const [status, setStatus] = useState('');
    const [accessToken, setAccessToken] = useState('');

    if (accessToken.length === 0 && typeof window !== "undefined") {
        console.log('setting access token in client');
        const access_token = window.localStorage.getItem('access_token');
        if (access_token === null) {
            redirect('/login?messagecode=1');
        } else {
            setAccessToken(access_token)
            getPlaylists(access_token, setPlaylists);
        }
    }

    function randomizeHelper() {
        randomize(accessToken, playlistId, setStatus);
    }

    function selectPlaylist(id: string) {
        if (id === playlistId) {
            setPlaylistId('');
        } else {
            setPlaylistId(id);
        }
    }

    return (
        <div className="ml-2">
            <p className="text-2xl">Shuffle</p>
            <div>
                {playlists.map((playlist, idx) => (
                    <div key={idx}>

                        <button
                            className="rounded outline px-2 my-2 hover:bg-white"
                            onClick={() => selectPlaylist(playlist.id)}
                        >
                        Playlist: {playlist['name']}</button>

                        {playlist["id"] === playlistId &&
                            <div>
                                <button
                                    className="outline rounded px-2 ml-8 my-2 hover:bg-white"
                                    onClick={() => randomizeHelper()}
                                >Randomize!</button>
                                {status.length > 0 &&
                                    <div>Status: {status}</div>
                                }
                            </div>
                        }
                        
                    </div>
                ))}
            </div>
        </div>
    );
}


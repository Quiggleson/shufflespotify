'use client';

import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";

export default function Login() {

    const [message, setMessage] = useState('');
    const clientId = 'b93207dfa52d42bfbbe1d17b613fd963';
    const redirectUri = process.env.NEXT_PUBLIC_CALLBACK_URL!;

    const scope = 'playlist-read-private playlist-read-collaborative user-read-private user-read-email playlist-modify-public playlist-modify-private';
    const authUrl = new URL('https://accounts.spotify.com/authorize');

    const params = {
        response_type: 'code',
        client_id: clientId,
        scope,
        code_challenge_method: 'S256',
        code_challenge: '',
        redirect_uri: redirectUri
    };

    const searchParams = useSearchParams();
    const messagecode = searchParams.get('messagecode');
    if (message.length === 0 && messagecode === '1') {
        setMessage('Session Expired. Please login again.');
    }

    async function generateCodeChallenge() {
        const codeVerifier = generateRandomString(64);
        const hashed = await sha256(codeVerifier)
        const codeChallenge = base64encode(hashed);
        window.localStorage.setItem('code_verifier', codeVerifier);
        params.code_challenge = codeChallenge;
    }

    async function auth() {
        await generateCodeChallenge();
        authUrl.search = new URLSearchParams(params).toString();
        window.location.href = authUrl.toString();
    }

    return (
        <Suspense>
            <div className="ml-2">
                <p className="text-2xl font-bold mb-2">Login</p>
                {message.length > 0 &&
                    <div className="my-2">
                        <p>{message}</p>
                    </div>
                }
                <button className="outline px-2 rounded hover:bg-white" onClick={() => auth()}>Authorize</button>
            </div>
        </Suspense>
    );
}


const generateRandomString = (length: number) => {
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const values = crypto.getRandomValues(new Uint8Array(length));
    return values.reduce((acc, x) => acc + possible[x % possible.length], "");
}

const sha256 = async (plain: string) => {
    const encoder = new TextEncoder()
    const data = encoder.encode(plain)
    return window.crypto.subtle.digest('SHA-256', data)
}

const base64encode = (input: ArrayBuffer) => {
    return btoa(String.fromCharCode(...new Uint8Array(input)))
        .replace(/=/g, '')
        .replace(/\+/g, '-')
        .replace(/\//g, '_');
}


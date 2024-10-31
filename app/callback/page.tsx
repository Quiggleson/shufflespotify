'use client';

import { redirect, useSearchParams } from "next/navigation";

export default function Callback(){

    const searchParams = useSearchParams()

    const code = searchParams.get('code') ?? '';
    const clientId = 'b93207dfa52d42bfbbe1d17b613fd963';
    const url = 'https://accounts.spotify.com/api/token'

    if (typeof window !== "undefined") {
        auth();
    }

    async function auth() {
        const codeVerifier = window.localStorage.getItem('code_verifier') ?? '';
        const payload = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                client_id: clientId,
                grant_type: 'authorization_code',
                code,
                redirect_uri: 'http://localhost:3000/callback',
                code_verifier: codeVerifier,
            }),
        }
        const body = await fetch(url, payload);
        const response = await body.json();
        if (response['access_token'] !== undefined) {
            window.localStorage.setItem('access_token', response['access_token']);
        }
        redirect('/shuffle');
    }


    return (
    <div>
        <p>This page should redirect you</p>
    </div>
    );
}
const CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
const REDIRECT_URI = import.meta.env.VITE_SPOTIFY_REDIRECT_URI;

const generateCodeVerifier = (length: number) => {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (let i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}

const generateCodeChallenge = async (codeVerifier: string) => {
    const data = new TextEncoder().encode(codeVerifier);
    const digest = await window.crypto.subtle.digest('SHA-256', data);
    return btoa(String.fromCharCode.apply(null, [...new Uint8Array(digest)]))
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');
}

export const refreshAccessToken = async (refreshToken: string) => {
    try {
        const response = await fetch('https://accounts.spotify.com/api/token', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    body: new URLSearchParams({
                        client_id: CLIENT_ID,
                        grant_type: 'refresh_token',
                        refresh_token: refreshToken
                    }),
                });
        const data = await response.json();

        if (data.error) {
            throw new Error(data.error_description);
        }
    
        const newTokens = {
            accessToken: data.access_token,
            refreshToken: data.refresh_token || refreshToken,
            expiresIn: Date.now() + data.expires_in * 1000,
        };
    
        localStorage.setItem("spotifyAuth", JSON.stringify(newTokens));
        return newTokens;
    } catch (e) {
        console.error(e);
    }
};

export const logout = () => {
    localStorage.removeItem("spotifyAuth");
    localStorage.removeItem("spotifyUser");
    localStorage.removeItem("spotify_code_verifier");
    window.location.href = "/";
};

export const getStoredAuth = () => {
    const stored = localStorage.getItem("spotifyAuth");
    return stored ? JSON.parse(stored) : null;
};

export const redirectToAuth = async () => {
    const verifier = generateCodeVerifier(128);
    const challenge = await generateCodeChallenge(verifier);
    localStorage.setItem("spotify_code_verifier", verifier);

    const params = new URLSearchParams({
        client_id: import.meta.env.VITE_SPOTIFY_CLIENT_ID,
        response_type: "code",
        redirect_uri : import.meta.env.VITE_SPOTIFY_REDIRECT_URI,
        scope: "user-read-private user-read-email playlist-read-private",
        code_challenge_method: "S256",
        code_challenge: challenge
    });

    window.location.href = `https://accounts.spotify.com/authorize?${params.toString()}`;
}

export const getAccessToken = async (code: string) => {
    try {
        const verifier = localStorage.getItem("spotify_code_verifier");
        if (!verifier) throw new Error("Missing PKCE code verifier");

        console.log('code', code);
        console.log('verifier', verifier);
        const response = await fetch('https://accounts.spotify.com/api/token', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                        body: new URLSearchParams({
                            client_id: CLIENT_ID,
                            grant_type: 'authorization_code',
                            code: code,
                            redirect_uri: REDIRECT_URI,
                            code_verifier: verifier,
                        }),
                    });
        const data = await response.json();

        if (data.error) {
            throw new Error(data.error_description);
        }

        const tokens = {
            accessToken: data.access_token,
            refreshToken: data.refresh_token,
            expiresIn: Date.now() + data.expires_in * 1000,
        };

        if (tokens?.accessToken) {
            localStorage.setItem("spotifyAuth", JSON.stringify(tokens));
            localStorage.removeItem("spotify_code_verifier");
        } 

        return tokens;
    } catch (e) {
        console.log("Error: ", e);
        return null;
    }
}
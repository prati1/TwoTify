import { getStoredAuth, refreshAccessToken } from "./auth";

let onAuthError: (() => void) | null = null;

export const registerAuthErrorHandler = (callback: () => void) => {
  onAuthError = callback;
}


export const api = async(input: RequestInfo, init?: RequestInit):  Promise<Response> => {
    const storedAuth = getStoredAuth();

    if (!storedAuth) {
        onAuthError?.();
        throw new Error("Not Authenticated");
    }

    let {accessToken } = storedAuth;
    const {refreshToken, expiresIn} = storedAuth;

    // Refresh token if expired
    if (Date.now() > expiresIn && refreshToken) {
        try {
            const newTokens = await refreshAccessToken(refreshToken);
            if (newTokens) {
                accessToken = newTokens.accessToken;
            } else {
                onAuthError?.();
                throw new Error("No new token received with refresh token");
            }

        } catch (err) {
            console.error("Token refresh failed:", err);
            onAuthError?.();
            throw err;
        }
    }

    const headers = new Headers(init?.headers);
    headers.set("Authorization", `Bearer ${accessToken}`);

    const response = await fetch(input, {
        ...init,
        headers,
    });

    return response;
}
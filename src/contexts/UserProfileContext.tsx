import { createContext, useEffect, useState } from "react";
import { getStoredAuth, logout, refreshAccessToken } from "../utils/auth";
import axios from "axios";

interface UserProfileContextType {
    userProfile: UserProfile | null;
    setUserProfile: (profile: UserProfile | null) => void;
    isAuthenticated: boolean;
    setIsAuthenticated: (isAuthenticated: boolean) => void;
    logoutUser: () => void;
}

const UserProfileContext = createContext<UserProfileContextType>({
    userProfile: null,
    setUserProfile: () => {},
    isAuthenticated: false,
    setIsAuthenticated: () => {},
    logoutUser: () => {},
});

export const UserProfileProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
    const loadUser = async () => {
        const storedAuth = getStoredAuth();

        if (!storedAuth) {
            setIsAuthenticated(false);
            return;
        }

        const { accessToken, refreshToken, expiresIn } = storedAuth;

        // Refresh token if expired
        if (Date.now() > expiresIn && refreshToken) {
            try {
                const newTokens = await refreshAccessToken(refreshToken);
                storedAuth.accessToken = newTokens.accessToken;
            } catch (err) {
                console.error("Token refresh failed:", err);
                logout();
                return;
            }
        }

        try {
            const { data: user }: {data: UserProfile} = await axios.get(
                "https://api.spotify.com/v1/me",
                {
                headers: { Authorization: `Bearer ${storedAuth.accessToken}` },
                }
        );

        setUserProfile(user);
        localStorage.setItem("spotifyUser", JSON.stringify(user));
        setIsAuthenticated(true);

        } catch (error) {
            console.error("Failed to fetch user profile:", error);
            setIsAuthenticated(false);
            logout();
        }
    };

    const savedUser = localStorage.getItem("spotifyUser");
    if (savedUser) {
        setUserProfile(JSON.parse(savedUser));
        setIsAuthenticated(true);
    } else {
        loadUser();
    }
    }, []);

    const logoutUser = () => {
        setUserProfile(null);
        setIsAuthenticated(false);
        logout();
    };

    return (
    <UserProfileContext.Provider
        value={{ userProfile, setUserProfile, isAuthenticated, logoutUser, setIsAuthenticated }}
    >
        {children}
    </UserProfileContext.Provider>
    );
};

export default UserProfileContext;

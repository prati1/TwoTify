import { createContext, useEffect, useState } from "react";
import { getStoredAuth, logout } from "../utils/auth";
import { api, registerAuthErrorHandler } from "../utils/api";
import type { UserProfile } from "../types/users";

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

        try {
            const response = await api(
                "https://api.spotify.com/v1/me"
            );
            const user: UserProfile = await response.json();
            console.log('user', user);

            setUserProfile(user);
            localStorage.setItem("spotifyUser", JSON.stringify(user));
            setIsAuthenticated(true);

        } catch (error) {
            console.error("Failed to fetch user profile:", error);
            setUserProfile(null);
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

    useEffect(() => {
        registerAuthErrorHandler(() => {
            console.warn("Auth expired or invalid — logging out.");
            setUserProfile(null);
            setIsAuthenticated(false);
            logout();
        });
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

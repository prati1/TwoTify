import { useContext, useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router";
import {redirectToAuth, getAccessToken} from "../utils/auth";
import UserProfileContext from "../contexts/UserProfileContext";
import { api } from "../utils/api";
import type { UserProfile } from "../types/users";

const SpotifyCallback = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const {setUserProfile, setIsAuthenticated} = useContext(UserProfileContext);
    const didExecute = useRef(false);

    const code: string = searchParams.get('code') || '';

    useEffect(() => {
        if (didExecute.current) return;
        didExecute.current = true;

        const getProfileData = async () => {
            try {
                const userProfileData = await api('https://api.spotify.com/v1/me');
                const userProfile: UserProfile = await userProfileData.json();
                setUserProfile({...userProfile});
                localStorage.setItem("spotifyUser", JSON.stringify(userProfile));
                setIsAuthenticated(true);
                
            } catch (e) {
                console.log(e);
            }
        }

        const handleCallback = async () => {
            if (!code) {
                localStorage.removeItem("spotifyAuth");
                redirectToAuth();
                return;
            }

            if (code) {
                await getAccessToken(code);
                await getProfileData();
                navigate('/');
            }
        }

        handleCallback();

    }, [navigate, code, setUserProfile, setIsAuthenticated]);

    return(<></>);
}

export default SpotifyCallback;
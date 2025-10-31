import { useContext, useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router";
import {redirectToAuth, getAccessToken} from "../utils/auth";
import UserProfileContext from "../contexts/UserProfileContext";
import axios from "axios";

const SpotifyCallback = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const {setUserProfile, setIsAuthenticated} = useContext(UserProfileContext);
    const didExecute = useRef(false);

    const code: string = searchParams.get('code') || '';

    useEffect(() => {
        if (didExecute.current) return;
        didExecute.current = true;

        const getProfileData = async (accessToken: string) => {
            try {
                const userProfileData = await axios.get('https://api.spotify.com/v1/me', {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
                });
                setUserProfile({...userProfileData.data});
                localStorage.setItem("spotifyUser", JSON.stringify(userProfileData.data));
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
                const tokens = await getAccessToken(code);
                await getProfileData(tokens?.accessToken);
                navigate('/');
            }
        }

        handleCallback();

    }, [navigate, code, setUserProfile, setIsAuthenticated]);

    return(<></>);
}

export default SpotifyCallback;
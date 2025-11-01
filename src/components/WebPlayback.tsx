import { useEffect, useRef, useState } from "react";
import type { TrackObject } from "../types/playlists";
import { getStoredAuth } from "../utils/auth";
import { api } from "../utils/api";

interface WebPlaybackProps {
    playlistUri: string,
    trackIndex: number,
    totalTracks: number,
}

// @ToDo: Work with episodes EpisodeObject
const WebPlayback: React.FC<WebPlaybackProps> = ({playlistUri, trackIndex, totalTracks}) => {
    const [deviceId, setDeviceId] = useState();
    const [isPaused, setPaused] = useState(false);
    const [isActive, setActive] = useState(false);
    const [currentTrack, setCurrentTrack] = useState<TrackObject>();
    const playerRef = useRef<Spotify.Player | null>(null);

    useEffect(() => {
        const updateCurrentPlayedSong = async () => {
            await api(`https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`, {
                method: 'PUT',
                body: JSON.stringify({
                    context_uri: playlistUri,
                    offset: {position: trackIndex},
                    position_ms: 0
                })
            })
        }

        if (deviceId && playerRef.current) {
            updateCurrentPlayedSong();
        }
    }, [deviceId, playlistUri, trackIndex, playerRef]);

    useEffect(() => {
        const script = document.createElement("script");
        script.src = "https://sdk.scdn.co/spotify-player.js";
        script.async = true;

        document.body.appendChild(script);

        window.onSpotifyWebPlaybackSDKReady = async() => {
            const authToken = getStoredAuth();

            const player = new window.Spotify.Player({
                name: 'Web Playback SDK',
                getOAuthToken: cb => { cb(authToken.accessToken); },
                volume: 0.5
            });

            // setPlayer(player);
            
            player.addListener('ready', async ({ device_id }) => {
                console.log('Ready with Device ID', device_id);
                setDeviceId(device_id);
            });
            
            player.addListener('not_ready', ({ device_id }) => {
                console.log('Device ID has gone offline', device_id);
            });
            
            await player.connect();
            playerRef.current = player;

            player.addListener('player_state_changed', ( state => {
                if (!state) {
                    return;
                }

                setCurrentTrack(state.track_window.current_track);
                setPaused(state.paused);


                player.getCurrentState().then( state => { 
                    return (!state)? setActive(false) : setActive(true) 
                });

            }));
        };
    }, []);

    return(
        <>
        <div className="container">
            <div className="main-wrapper">
                <img src={currentTrack?.album.images[0].url} />

                <div>
                    <div>{ currentTrack?.name }</div>

                    <div>{ currentTrack?.artists[0].name }</div>
                </div>

                <button className="btn-spotify" onClick={() => { return playerRef.current ? playerRef.current.previousTrack() : null }} >
                    &lt;&lt;
                </button>

                <button className="btn-spotify" onClick={() => { return playerRef.current ? playerRef.current.togglePlay() : null }} >
                    { isPaused ? "PLAY" : "PAUSE" }
                </button>

                <button className="btn-spotify" onClick={() => { return playerRef.current ? playerRef.current.nextTrack() : null }} >
                    &gt;&gt;
                </button>
            </div>
        </div>
        </>
    )

}

export default WebPlayback;
import { useEffect, useRef, useState } from "react";
import type { TrackObject } from "../types/playlists";
import { getStoredAuth } from "../utils/auth";
import { api } from "../utils/api";
import { CirclePause, CirclePlay, ChevronFirst, ChevronLast, Circle } from "lucide-react";

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
    const [spotifyPlayer, setSpotifyPlayer] = useState<Spotify.Player | null>(null);

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

        if (deviceId && spotifyPlayer) {
            updateCurrentPlayedSong();
        }
    }, [deviceId, playlistUri, trackIndex, spotifyPlayer]);

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
            
            setSpotifyPlayer(player);
            await player.connect();

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
            <h3 className="text-center text-white opacity-90">Playlist name</h3>
            <div className="flex flex-1 flex-col min-h-0">
                <img src={currentTrack?.album.images[0]?.url} className="max-h-full w-auto object-contain" />
            </div>
            <h2 className="text-white px-25">{currentTrack?.name}</h2>
            <h3 className="text-white opacity-60 px-25">{currentTrack?.artists && currentTrack.artists.length > 0 && currentTrack.artists.map((artist) => artist.name).join(', ') }</h3>
            <div className="flex flex-row px-25 justify-around pb-5">
                <button className="cursor-pointer" onClick={() => { return spotifyPlayer ? spotifyPlayer.previousTrack() : null }}>
                    <ChevronFirst className="w-10 h-10 text-white"/>
                </button>
                <button className="cursor-pointer" onClick={() => { return spotifyPlayer ? spotifyPlayer.togglePlay() : null }}>
                    {isPaused ? <CirclePlay className="w-15 h-15 text-white" /> : <CirclePause className="w-15 h-15 text-white" />}
                </button>
                <button className="cursor-pointer" onClick={() => { return spotifyPlayer ? spotifyPlayer.nextTrack() : null }} >
                    <ChevronLast className="w-10 h-10 text-white" />
                </button>

            </div>
        </>
    )

}

export default WebPlayback;
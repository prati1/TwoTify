import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { api } from "../utils/api";
import type { EpisodeObject, PlaylistTracks, Track, TrackObject } from "../types/playlists";
import WebPlayback from "./WebPlayback";

const Track: React.FC<{track: TrackObject}> = ({track}) => {
    const playSong = async () => {
        const play = await api("https://api.spotify.com/v1/me/player/play", {
            method: "PUT",
            body: JSON.stringify({
                uri: track.uri,
                position_ms: 0
            })
        });
        console.log('play', play);
    }
    return (
        <>
            <div className="flex flex-row gap-2 px-2 py-2 h-[100px]" onClick={playSong}>
                <img src={track.album.images[0].url} className="overflow-hidden object-cover shrink-0" />
                <div className="flex flex-col gap-2 px-2">
                    <h3 className="text-white opacity-90 overflow-hidden">{track.name}</h3>
                    <h4 className="text-white opacity-75 overflow-hidden">{track.artists && track.artists.length && 
                        track.artists.map((artist) => artist.name).join(', ')
                        }</h4>
                </div>
            </div>
        </>
    )
}

const Episode: React.FC<{episode: EpisodeObject}> = ({episode}) => {
    return(
        <></>
    )

}

const PlaylistItem: React.FC<{song: Track}> = ({song}) => {
    return (
        <>
            <div className="bg-gray-700 hover:bg-gray-900 cursor-pointer">
                {song.track.type == 'track' && <Track track={song.track} />}
                {song.track.type == 'episode' && <Episode episode={song.track} />}

            </div>
        </>
    )
}

const PlaylistTracks = () => {
    const { id } = useParams();
    const [tracks, setTracks] = useState<PlaylistTracks>();
    const [uri, setUri] = useState<string>("");
    const [selectedIndex, setSelectedIndex] = useState(0);

    useEffect(() => {
        const getPlaylistTracks = async () => {
            const playlistResp = await api(`https://api.spotify.com/v1/playlists/${id}`);
            const playlistData = await playlistResp.json();
            setUri(playlistData.uri);



            const resp = await api(`https://api.spotify.com/v1/playlists/${id}/tracks`);
            const data: PlaylistTracks = await resp.json();
            setTracks(data);
            setSelectedIndex(0);
        }

        getPlaylistTracks();
    }, [id])

    return(
        <>
        <div className="shadow-2xl p-2 bg-gray-100">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-start">
                <div className="col-span-1 bg-blue-100 min-h-screen max-h-screen overflow-y-auto">
                    <h2 className="text-center">Tracks</h2>
                    <div className="flex flex-col gap-2">
                        {tracks && tracks.total > 0 && tracks.items.map((track, index) => {
                            return (
                                <div key={track.track.id} onClick={() => setSelectedIndex(index)}>
                                    <PlaylistItem song={track} />
                                </div>
                            )
                        })}
                    </div>
                    
                </div>
                <div className="col-span-1 md:col-span-2 bg-blue-50 min-h-screen max-h-screen flex flex-col">
                    <h2 className="text-center">Playing from playlist</h2>
                    <div className="flex-grow bg-gray-700">
                        {tracks && <WebPlayback 
                            totalTracks={tracks?.items.length} 
                            playlistUri={uri} 
                            trackIndex={selectedIndex}
                            />}                     
                    </div>
                </div>

            </div>
        </div>
        </>
    )
}

export default PlaylistTracks;
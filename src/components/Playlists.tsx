import { useEffect, useState } from "react";
import type { Items, Playlists } from "../types/playlists";
import { api } from "../utils/api";
import { useNavigate } from "react-router";

const Playlist: React.FC<{playlist: Items}> = ({playlist}) => {
    const navigate = useNavigate();
    const handlePlaylistClick = () => {
        console.log('clicked', playlist.tracks.href);
        navigate(`/playlist/${playlist.id}`);
    }

    return (<>
            <div onClick={handlePlaylistClick} className="flex flex-col max-w-[45%] h-[200px] md:h-[250px] md:w-[200px] shadow-xl p-2overflow-hidden p-0.5 md:p-2 cursor-pointer">
                <img src={playlist.images[0].url} className="w-full h-[150px] md:h-[190px] object-cover" />
                <p className="text-gray-600">{playlist.name}</p>
            </div>
    </>)
}

const Playlists = () => {
    const [playlists, setPlaylists] = useState<Playlists>();

    useEffect(() => {
        const getPlaylists = async () => {
            const resp = await api("https://api.spotify.com/v1/me/playlists", {
                method: "GET"
            })

            const playlistData: Playlists = await resp.json();
            setPlaylists(playlistData);
            console.log('data', playlistData);
        }

        getPlaylists();
    }, [])

    return (
        <>
            <div className="flex flex-row flex-wrap gap-4 p-2 shadow-2xl">
                {playlists && playlists.items.length > 0 && playlists.items.map((playlist) => {
                    return(
                        <Playlist key={playlist.id} playlist={playlist} />
                    );
                })}
            </div>
            
        </>
    )
}

export default Playlists;
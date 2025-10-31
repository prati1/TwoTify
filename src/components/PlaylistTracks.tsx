import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { api } from "../utils/api";

const PlaylistTracks = () => {
    const { id } = useParams();
    const [tracks, setTracks] = useState();

    useEffect(() => {
        const getPlaylistTracks = async () => {
            const resp = await api(`https://api.spotify.com/v1/playlists/${id}/tracks`);
            const data = await resp.json();
            setTracks(data);
        }

        getPlaylistTracks();
    }, [id])

    return(
        <>
        <div className="shadow-2xl min-h-[450px] p-2">
            <h2 className="text-center">Tracks</h2>
        </div>
        </>
    )
}

export default PlaylistTracks;
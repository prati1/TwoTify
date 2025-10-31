import {createBrowserRouter} from "react-router";
import SpotifyCallback from "./components/SpotifyCallback";
import Home from "./components/Home";
import Profile from "./components/Profile";
import Playlists from "./components/Playlists";
import PlaylistTracks from "./components/PlaylistTracks";

const router = createBrowserRouter([
    { path: "/", Component: Home },
    { path: "/callback", Component: SpotifyCallback},
    { path: "/profile", Component: Profile},
    { path: "/playlists", Component: Playlists},
    { path: "/playlist/:id", Component: PlaylistTracks}
])

export default router;
import {createBrowserRouter} from "react-router";
import SpotifyCallback from "./components/SpotifyCallback";
import Home from "./components/Home";
import Profile from "./components/Profile";
import PlaylistList from "./components/PlaylistList";
import PlaylistDetail from "./components/PlaylistDetail";

const router = createBrowserRouter([
    { path: "/", Component: Home },
    { path: "/callback", Component: SpotifyCallback},
    { path: "/profile", Component: Profile},
    { path: "/playlists", Component: PlaylistList},
    { path: "/playlist/:id", Component: PlaylistDetail}
])

export default router;
import {createBrowserRouter} from "react-router";
import SpotifyCallback from "./components/SpotifyCallback";
import Home from "./components/Home";

const router = createBrowserRouter([
    { path: "/", Component: Home },
    { path: "/callback", Component: SpotifyCallback}
])

export default router;
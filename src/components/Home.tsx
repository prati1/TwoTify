import { useContext } from "react";
import UserProfileContext from "../contexts/UserProfileContext";

const Home = () => {
    const {userProfile} = useContext(UserProfileContext);

    console.log(userProfile);
    return(
        <>
            <div className="min-h-[450px] flex flex-col bg-gray-50 shadow-xl gap-5 p-5">
                <h2 className="align-middle self-center text-5xl text-violet-700">Welcome to TwoTify!</h2>
                <h3 className="self-center text-3xl text-violet-500">Create playlists together with your partner. Vote for the songs you want to listen!</h3>
            </div>
        </>
    )
}

export default Home;
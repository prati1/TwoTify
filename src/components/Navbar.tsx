import { useContext, useState } from "react";
import { redirectToAuth } from "../utils/auth";
import UserProfileContext from "../contexts/UserProfileContext";

const Navbar = () => {
    const {userProfile, logoutUser, isAuthenticated} = useContext(UserProfileContext);
    const [userDropdownIsOpen, setuserDropdownIsOpen] = useState(false);
    const handleLogin = () => {
        redirectToAuth();
    }

    const userDropdownToggle = () => {
        setuserDropdownIsOpen(val => !val);
    }

    return(
        <>
        <div className="navbar">
            <a href="/"><h2>TwoTify</h2></a>
            <div className="flex flex-row gap-2 h-full">
                <button className="cursor-pointer px-2 py-2 text-black hover:text-white hover:bg-gray-500 text-center">
                    <a href="/playlists">
                        <h3>Playlists</h3>
                    </a>
                </button>
            </div>
            {isAuthenticated
            ? <div className="relative">
                <button onClick={userDropdownToggle} className="cursor-pointer">
                    <div className="flex flex-row justify-center items-center gap-1 w-[160px]">
                        {userProfile?.images && userProfile.images.length > 0 && <img className="h-10 w-10 shrink-0 grid-rows-2 rounded-full overflow-hidden border-2 object-cover border-gray-100 focus:outline-none focus:border-white" src={userProfile?.images[0].url} />}
                        <span className="overflow-hidden">{userProfile?.display_name}</span>

                    </div>
                </button>
                {userDropdownIsOpen && 
                <button className="fixed inset-0 bg-gray-600 h-full w-full opacity-25" tabIndex={-1} onClick={()=>setuserDropdownIsOpen(false)}></button>}
                
                {userDropdownIsOpen && <div className="absolute right-0 bg-white rounded-lg py-2 w-48 shadow-md">
                    <a href="/profile" className="block p-2 text-gray-800 hover:bg-indigo-500 hover:text-white">Profile</a>
                    <a href="#" className="block p-2 text-gray-800 hover:bg-indigo-500 hover:text-white" onClick={logoutUser}>Logout</a>
                </div>}
            </div>
            : <div className="flex flex-row gap-2"> 
                <button onClick={handleLogin} className="bg-blue-600 hover:bg-blue-900 text-white rounded-2xl p-2 cursor-pointer">          
                    <h4>Login Using Spotify</h4>
                </button>
            </div>}

            
        </div>
        </>
    );
}

export default Navbar;
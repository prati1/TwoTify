import { useContext } from "react";
import UserProfileContext from "../contexts/UserProfileContext";

const Profile = () => {
    const {userProfile} = useContext(UserProfileContext);

    return(
        <>
        <div className="min-h-[450px] flex flex-col bg-gray-50 shadow-xl gap-5 py-5 px-0 md:px-[400px]">
            <img src={userProfile?.images[0].url} className="object-cover overflow-hidden max-h-[300px] max-w-[300px] self-center" />
            <div className="self-center text-[16pt] font-semibold">{userProfile?.display_name}</div>
            <div>
                Email: {userProfile?.email}
            </div>
            <div>
                Spotify ID: {userProfile?.id}
            </div>
        </div>
        </>
    );
}

export default Profile;
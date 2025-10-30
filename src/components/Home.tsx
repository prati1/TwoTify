import { useContext } from "react";
import UserProfileContext from "../contexts/UserProfileContext";

const Home = () => {
    const {userProfile} = useContext(UserProfileContext);

    console.log(userProfile);
    return(
        <>Welcome!</>
    )
}

export default Home;
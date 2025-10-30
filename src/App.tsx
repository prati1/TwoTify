import { RouterProvider } from "react-router";
import './App.css'
import router from "./routes";
import Navbar from "./components/Navbar";
import { UserProfileProvider } from "./contexts/UserProfileContext";

function App() {
  return (
    <>
        <UserProfileProvider>
          <div className="px-20">
            <Navbar />
            <div className='grid'>
              <RouterProvider router={router} />
            </div>
          </div>

        </UserProfileProvider>
    </>
  )
}

export default App;

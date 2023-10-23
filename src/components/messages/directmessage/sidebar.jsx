import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { signOut } from "firebase/auth";
import { auth } from "../../../firebase";
import Search from "./search";
import { AllChannel } from "../channels/AllChannel";
import useSelectionContext from "../../context/SelectionContext";

const Sidebar = () => {
  const { currentUser } = useContext(AuthContext);
  const { handleShowAddChannel } = useSelectionContext();
  return (
    <div>
      <div className="allinfo w-96 bg-green-950 shadow-l h-full">
        <div className="user-info flex border-b-2 shadow-2xl text-white p-4 font-sans font-semibold">
          <img
            className="w-10 rounded-full h-10"
            src={currentUser.photoURL}
            alt=""
          />
          <p className="mt-2 ml-2 ">{currentUser.displayName}</p>
          <button
            className="ml-8 bg-black p-2 w-24 hover:text-red-400"
            onClick={() => signOut(auth)}
          >
            Log Out
          </button>
        </div>
        <div className="details-btn grid text-white text-xl justify-start p-4 text-md border-b ">
          <div className="dashboard flex hover:bg-sky-500 rounded-lg">
            <div className="icons mt-1 text-lg">
              <ion-icon name="home-outline"></ion-icon>
            </div>
            <button className="ml-2">Dashboard</button>
          </div>
          <div className="threads flex hover:bg-sky-500 rounded-lg w-full">
            <div className="icons mt-1 text-lg">
              <ion-icon name="chatbubble-ellipses-outline"></ion-icon>
            </div>
            <button className="ml-2">Threads</button>
          </div>
          <div className="browse flex hover:bg-sky-500 rounded-lg w-full">
            <div className="icons mt-1 text-lg">
              <ion-icon name="globe-outline"></ion-icon>
            </div>
            <button className="ml-2">Browse Slack</button>
          </div>
          <div className="later flex hover:bg-sky-500 rounded-lg">
            <div className="icons mt-1 text-lg">
              <ion-icon name="bookmark-outline"></ion-icon>
            </div>
            <button className="ml-2">Later</button>
          </div>
          <div className="later flex hover:bg-sky-500 rounded-lg">
            <div className="icons mt-1 text-lg">
              <ion-icon name="game-controller-outline"></ion-icon>
            </div>
          </div>
        </div>

        <div className="channels text-white grid">
          <p className="border-b p-3 text-white font-semibold">Channels</p>
          <div className="channel-name overflow-auto h-32 border-b scrollbar-thin scrollbar-thumb-gray-500">
            <AllChannel />
          </div>
          <div className="add-channel hover:bg-sky-500">
            <div className="flex p-4">
              <div className="icons mt-1 text-lg">
                <ion-icon name="add-circle-outline"></ion-icon>
              </div>
              <button className="ml-2" onClick={handleShowAddChannel}>Add Channel</button>
            </div>
          </div>
        </div>
        <Search />
      </div>
    </div>
  );
};
export default Sidebar;
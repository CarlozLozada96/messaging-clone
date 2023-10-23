import { useContext } from "react";
import Sidebar from "./directmessage/sidebar";
import { ChatContext } from "../context/ChatContext";
import Input from '../messages/directmessage/Input'
import Directmessages from "./directmessage/directmessage";
import Addingchannels from '../messages/channels/addingchannels'
import useSelectionContext from "../context/SelectionContext";

const Dashboard = () => {
  const { data } = useContext(ChatContext);
  const selectedChannelName = data.selectedChannel?.name || '';
  const { showaddchannel, showchannelname, showname } = useSelectionContext();
  return (
    <>
      {showaddchannel &&
        <div className="addingchannels fixed top-0 left-0 h-screen w-screen backdrop-blur-lg bg-gray-800 bg-opacity-50 p-4">
          <Addingchannels></Addingchannels>
        </div>
      }
      <div className="container-dashboard flex w-screen h-screen bg-white">
        <Sidebar></Sidebar>
        <div className="chat-messages w-full">
          <div className="text-white h-16 bg-green-950">
            <div className="receiver flex justify-between p-4">
              <div className="receiver-info flex">

                {showname && <div className="receiver-info flex">
                  <img className="h-10 w-10 rounded-full" src={data.user.photoURL} alt="" />
                  <h1 className="mt-1 ml-2 text-2xl justify-start">{data.user.displayName}</h1>
                </div>}
                {showchannelname && <div className="channels flex">
                  <img className="h-10 w-10 rounded-full" src="logo.png" alt="" />
                  <h1 className="displaychannelname mt-2 ml-2">{selectedChannelName}</h1>
                </div>}
              </div>
              <div className="seach-info">
                <input type="text" className="border p-2 border-gray-500 rounded-lg" placeholder="Search Messages" />
                <button className="bg-black text-white rounded-lg p-2 w-24 ml-1 h-12"><ion-icon name="search-outline"></ion-icon>Search</button>
              </div>
            </div>
          </div>
          <div className="inputs mt-10 h-5/6">
            <div className="h-full">
              <div className="messages overflow-auto h-5/6">
                <Directmessages></Directmessages>
              </div>
              <Input></Input>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
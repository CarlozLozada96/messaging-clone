import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import {
  collection,
  doc,
  getDocs,
  onSnapshot,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../../../firebase";
import { ChatContext } from "../../context/ChatContext";
import useSelectionContext from "../../context/SelectionContext";


export const AllChannel = () => {
  const { currentUser } = useContext(AuthContext);
  const [channels, setChannels] = useState([]);
  const [chats, setChats] = useState([]);

  const { dispatch } = useContext(ChatContext)
  const { handleShowsendchannel, handlehidesenddm, handleshowchannelname, handlehidename } = useSelectionContext()

  const handdlechannelchat = () => {
    const getChats = () => {
      if (currentUser && currentUser.uid) {
        const unsub = onSnapshot(doc(db, "userchat", currentUser.uid), (doc) => {
          setChats(doc.data());
        });

        return () => {
          unsub();
        };
      }
    };

    currentUser.uid && getChats();
  }

  useEffect(() => {
    const fetchChannels = async () => {
      const querySnapshot = await getDocs(collection(db, "chats"));
      const channelsData = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.members) {
          const uids = data.members.map((member) => member.uid);
          if (uids.includes(currentUser.uid) || data.owner.includes(currentUser.uid)) {
            channelsData.push({
              id: doc.id,
              name: data.name,
            });
          } else {
            console.log("you dont belong here chars");
          }
        }
      });
      setChannels(channelsData);
    };
    handdlechannelchat();
    fetchChannels();
  }, [currentUser]);

  const handleSelectedChannel = (channel) => {
    dispatch({ type: "SET_SELECTED_CHANNEL", payload: channel });
    console.log(channel.id);
    handleShowsendchannel()
    handleshowchannelname()
    handlehidesenddm()
    handlehidename()
  };

  return (
    <div>
      {channels.map((channel) => (
        <div
          key={channel.id}
          className="channel p-4"
        >
          <div

            onClick={() => handleSelectedChannel(channel)}
            className="channnelshover cursor-pointer flex hover:bg-sky-500 rounded-lg"
          >
            <div className="icons mt-1 text-lg">
              <ion-icon name="grid-outline"></ion-icon>
            </div>
            <h3 className="text-lg ml-3 font-semibold">
              {channel.name}
            </h3>
          </div>
        </div>
      ))}
    </div>
  )
}

import { doc, onSnapshot } from "firebase/firestore";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { ChatContext } from "../../context/ChatContext";
import { db } from "../../../firebase";
import useSelectionContext from "../../context/SelectionContext";


const Chats = () => {
  const [chats, setChats] = useState([]);

  const { currentUser } = useContext(AuthContext);
  const { dispatch, data } = useContext(ChatContext);
  const { handlehidesendchannel, handleShowsenddm, handlehidechannelname, handleshowname } = useSelectionContext()

  useEffect(() => {
    const getChats = () => {
      if (currentUser && currentUser.uid) {
        const unsub = onSnapshot(doc(db, "userchat", currentUser.uid), (doc) => {
          setChats(doc.data());
        });

        return () => {
          unsub();
        };
      } else {
        const unsub = onSnapshot(doc(db, "channels", currentUser.uid), (doc) => {
          setChats(doc.data());
        });

        return () => {
          unsub();
        };
      }

    };

    currentUser.uid && getChats();
  }, [currentUser]);


  const handleSelect = (u) => {
    dispatch({ type: "CHANGE_USER", payload: u });
  };

  const userclick = (e) => {
    e.preventDefault()
    handlehidesendchannel()
    handlehidechannelname()
    handleShowsenddm()
    handleshowname()
  }

  return (
    <div className="chats text-white">
      {chats &&
        Object.entries(chats)
          .sort((a, b) => b[1].date - a[1].date)
          .map((chat) => (
            <div
              className="userChat"
              key={chat[0]}
              onClick={() => handleSelect(chat[1].userInfo)}
            >
              <div onClick={userclick} className="userChatInfo flex mt-5 hover:bg-sky-500 cursor-pointer rounded-lg p-2">
                <img className="w-10 rounded-full h-10" src={chat[1]?.userInfo?.photoURL} alt="" />
                <span className="ml-2 mt-2 font-bold">{chat[1].userInfo.displayName}</span>
              </div>
            </div>
          ))}

    </div>
  );
};

export default Chats;

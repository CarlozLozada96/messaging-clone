import { useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { ChatContext } from "../../context/ChatContext";
import PropTypes from "prop-types";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../../firebase";

const Messages = ({ message }) => {
  const { currentUser } = useContext(AuthContext);
  const { data } = useContext(ChatContext);
  const [usersData, setUsersData] = useState({});

  const loadallusers = async () => {
    const usersRef = collection(db, "users");
    const querySnapshot = await getDocs(usersRef);
    const usersData = {};
    querySnapshot.forEach((doc) => {
      const userData = doc.data();
      usersData[userData.uid] = userData;
    });
    setUsersData(usersData);
  };

  const ref = useRef();

  useEffect(() => {
    loadallusers();
    ref.current?.scrollIntoView({ behavior: "smooth" });
  }, [message]);

  return (
    <div className="chat-container ">
      <div className="messages text-black ">
        <div
          ref={ref}
          className={`message ${message.senderId === currentUser.uid && "owner"
            }`}
        >
          <div className="display-msg grid p-2 ml-24 ">
            <div className="messageh ">
              <div className="messageinfo w-full flex">
                <img
                  className="w-14 h-12  rounded-full"
                  src={
                    message.senderId === currentUser.uid
                      ? currentUser.photoURL
                      : usersData[message.senderId]?.photoURL
                  }
                  alt=""
                />
                <div className="messages-chat w-5/6 ">
                  <p className="ml-5 font-bold">
                    {message.senderId === currentUser.uid
                      ? currentUser.displayName + " YOU"
                      : usersData[message.senderId]?.displayName
                      || "Unknown User"}
                  </p>
                  <p className="p-5 text-2xl border border-black ml-3 rounded-xl w-full">
                    {message.text}
                    {message.img && (
                      <img
                        className="w-2/6 h-96 rounded-lg"
                        src={message.img}
                        alt=""
                      />
                    )}
                    {message.video && (
                      <video controls autoPlay
                        className="w-5/6 h-96"
                        src={message.video}
                        alt=""
                      />
                    )}
                    {message.zipfile && (
                      <a className="ml-5 text-blue-800" href={message.zipfile}>SECRET FILE</a>
                    )}
                  </p>
                  <p className="ml-5">
                    {message.date.toDate().toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

Messages.propTypes = {
  message: PropTypes.object.isRequired,
};

export default Messages;
import { collection, doc, onSnapshot, query } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../../../firebase";


const Messages = ({ channelId }) => {

  const [channelmessages, setchannelMessages] = useState([]);

  useEffect(() => {
    const q = query(collection(db, "channels", channelId, "messages"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const data = [];
      querySnapshot.forEach((doc) => {
        data.push({ id: doc.id, ...doc.data() });
      });
      setchannelMessages(data);
    });
    return unsubscribe;
  }, [channelId]);

  return (
    <div className="messages">
      {channelmessages.map((message) => (
        <div key={message.id}>
          <p>{message.text}</p>
          <span>from: {message.senderName}</span>
        </div>
      ))}
    </div>
  );
};

export default Messages;
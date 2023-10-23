import { collection, doc, getDoc, getDocs, query, serverTimestamp, setDoc, updateDoc, where } from "firebase/firestore";
import { useContext, useEffect, useState } from "react";
import { db } from "../../../firebase";
import { AuthContext } from "../../context/AuthContext";
import Chats from './chatbox'

const Search = () => {
  const [username, setUsername] = useState("");
  const [user, setUser] = useState(null);
  const [err, setErr] = useState(false);
  const [searchResults, setSearchResults] = useState([]);


  const { currentUser } = useContext(AuthContext);

  const handleSearch = async () => {
    const q = query(
      collection(db, "users"),
      where("displayName", ">=", username),
      where("displayName", "<=", username + "\uf8ff")
    );

    try {
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        const results = []
        querySnapshot.forEach((doc) => {
          if (doc.exists()) {
            results.push(doc.data());
          }
        });
        setSearchResults(results);
      } else {
        setSearchResults([]);
      }
    } catch (err) {
      setErr(true);
    }
  };

  const handleSelect = async (result) => {
    const combineid =
      currentUser.uid > result.uid
        ? currentUser.uid + result.uid
        : result.uid + currentUser.uid;
    try {
      const res = await getDoc(doc(db, "chats", combineid));
      if (!res.exists()) {
        await setDoc(doc(db, "chats", combineid), { messages: [] });

        await updateDoc(doc(db, "userchat", currentUser.uid), {
          [combineid + ".userInfo"]: {
            uid: result.uid,
            displayName: result.displayName,
            photoURL: result.photoURL,
          },
          [combineid + ".date"]: serverTimestamp(),
        });

        await updateDoc(doc(db, "userchat", result.uid), {
          [combineid + ".userInfo"]: {
            uid: currentUser.uid,
            displayName: currentUser.displayName,
            photoURL: currentUser.photoURL,
          },
          [combineid + ".date"]: serverTimestamp(),
        });
      }
    } catch (err) {
      console.log(err);
    }
    setUser(null);
    setUsername("");
  };

  const handleKey = async (e) => {
    setUsername(e.target.value);
    await handleSearch();
  };

  useEffect(() => {
    setSearchResults([]);
  }, [username]);

  return (
    <div>
      <div className="directmessages">
        <p className="border-b border-t p-3 text-white font-semibold">
          Direct Messages
        </p>
        <input
          onChange={handleKey}
          value={username}
          type="text"
          className="w-full h-8 mb-3 bg-green-950 text-white mt-1 placeholder:p-2"
          placeholder="Search username"
        />
        {searchResults.length > 0 && (
          <div className="search-results text-white mt-2">
            {searchResults.map(result => (
              <div
                key={result.uid}
                className="search-result cursor-pointer hover:bg-sky-600 p-2 rounded"
                onClick={() => handleSelect(result)}
              >
                #{result.displayName}
              </div>
            ))}
          </div>
        )}
        <div className="allusername grid overflow-auto h-44 text-white">
          <div className="chats p-4">
            <Chats></Chats>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Search;
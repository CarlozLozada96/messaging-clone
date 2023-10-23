import { collection, doc, getDoc, getDocs, query, setDoc, where } from "firebase/firestore";
import { useContext, useState } from "react";
import { db } from "../../../firebase";
import { AuthContext } from "../../context/AuthContext";
import useSelectionContext from "../../context/SelectionContext";

const Addingchannels = () => {
    const [channelName, setChannelName] = useState("");
    const [channelDesc, setChannelDesc] = useState("");
    const [searchUser, setSearchUser] = useState("");
    const [searchResults, setSearchResults] = useState([]);

    const { currentUser } = useContext(AuthContext);
    const { handleHideAddChannel } = useSelectionContext();

    const handleSearch = async () => {
        const q = query(
            collection(db, "users"),
            where("displayName", ">=", searchUser),
            where("displayName", "<=", searchUser + "\uf8ff")
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
            console.log(err);
        }
    };

    const handleAddChannel = async () => {
        if (selectedUsers.length < 2) {
            return alert("Channel must have 2 or more members");
        }

        const userUpdates = {};
        userUpdates[currentUser.uid] = {
            displayName: currentUser.displayName,
            photoURL: currentUser.photoURL,
        };
        selectedUsers.forEach((user) => {
            userUpdates[user.uid] = {
                displayName: user.displayName,
                photoURL: user.photoURL,
            };
        });
        const channelowner = currentUser.uid
        const channelId = currentUser.uid + "-" + Date.now();

        try {
            const addChannels = collection(db, "userchat");
            await setDoc(doc(addChannels, channelId), { users: userUpdates });

            const chatsRef = doc(db, "chats", channelId);
            const chatExists = await getDoc(chatsRef);
            if (!chatExists.exists()) {
                await setDoc(chatsRef, {
                    name: channelName,
                    description: channelDesc,
                    members: selectedUsers,
                    owner: channelowner,
                    messages: []
                });
            }
            console.log(`Added channel ${channelId}`);
            handleHideAddChannel();
            alert("Channel Successfully Created")
        } catch (err) {
            console.log(`Error adding channel ${channelId}`, err);
        }
        setTimeout(() => {
            setSearchUser("");
            setChannelName("");
            setChannelDesc("");
            setSelectedUsers([]);
        }, 1000);
    };

    const [selectedUsers, setSelectedUsers] = useState([]);

    return (
        <div className="addingchannel flex justify-center">
            <div className="absolute m-24 p-10 w-1/3 shadow-lg shadow-gray-900 rounded-lg bg-green-950 text-white grid">
                <h1 className="text-center text-3xl">Adding Channels</h1>
                <div className="inputs text-black grid font-bold">
                    <input onChange={e => setChannelName(e.target.value)} className="channelname rounded-lg text-center h-12 mt-4" placeholder="Channel Name" type="text" value={channelName} />
                    <input onChange={e => setChannelDesc(e.target.value)} className="channeldiscription rounded-lg text-center h-12 mt-4" placeholder="Channel Discription" type="text" value={channelDesc} />
                    <input onChange={(e) => {
                        setSearchUser(e.target.value);
                        handleSearch();
                    }} className="searchuser h-12 mt-4 rounded-lg text-center" placeholder="Add User in the Channel" type="text" value={searchUser} />
                    <div className="displaysearch text-white mt-5 text-center">
                        {searchResults.length > 0 && (
                            <div className="search-results text-white mt-2">
                                {searchResults.map(result => (
                                    <div
                                        key={result.uid}
                                        className="search-result cursor-pointer hover:bg-sky-600 p-2 rounded"
                                        onClick={() => setSelectedUsers([...selectedUsers, result])}
                                    >
                                        {result.displayName}
                                    </div>
                                ))}
                            </div>
                        )}
                        {selectedUsers.map((user) => (
                            <div key={user.uid} className="displayselecteduser mt-2">
                                Selected Member: {user.displayName}
                            </div>
                        ))}
                    </div>
                </div>
                <div className="buttons mt-7 flex justify-center">
                    <button onClick={handleAddChannel} className="bg-green-800 p-5 rounded-lg">ADD CHANNEL</button>
                    <button onClick={handleHideAddChannel} className="ml-10 bg-red-800 p-5 w-36 rounded-lg">CANCEL</button>
                </div>
            </div>
        </div>
    );
};

export default Addingchannels;
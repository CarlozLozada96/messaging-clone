import { AuthContext } from "../../context/AuthContext";
import { ChatContext } from "../../context/ChatContext";
import {
  arrayUnion,
  doc,
  serverTimestamp,
  Timestamp,
  updateDoc,
} from "firebase/firestore";
import { db, storage } from "../../../firebase";
import { v4 as uuid } from "uuid";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { useContext, useEffect, useState } from "react";
import useSelectionContext from "../../context/SelectionContext";
import EmojiPicker from "emoji-picker-react";

const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition
const mic = new SpeechRecognition()

mic.continuous = true
mic.interimResults = true
mic.lang = 'en-US'

const Input = ({ userSelected }) => {
  const [text, setText] = useState("");
  const [img, setImg] = useState(null);
  const [video, setVideo] = useState(null);
  const [zipfile, setZipfile] = useState(null);
  const { currentUser } = useContext(AuthContext);
  const { data } = useContext(ChatContext);
  const { showsendchannel, showsenddm } = useSelectionContext();
  const [showPicker, setShowPicker] = useState(false);
  const [emoji, setEmoji] = useState("");
  const [isListening, setIsListening] = useState(false)
  const [note, setNote] = useState("")

  useEffect(() => {
    handleListen()
  }, [isListening])

  const handleListen = () => {
    if (isListening) {
      mic.start()
      mic.onend = () => {
        console.log('continue..')
        mic.start()
      }
    } else {
      mic.stop()
      mic.onend = () => {
        console.log('Stopped Mic on Click')
      }
    }
    mic.onstart = () => {
      console.log('Mics on')
    }

    mic.onresult = event => {
      const transcript = Array.from(event.results)
        .map(result => result[0])
        .map(result => result.transcript)
        .join('')
      console.log(transcript)
      setNote(transcript)
      mic.onerror = event => {
        console.log(event.error)
      }
    }
  }

  const handlechannelsendmessage = async () => {
    console.log("messages before update", data.messages);

    if (img) {

      const storageRef = ref(storage, uuid());

      const uploadTask = uploadBytesResumable(storageRef, img);

      uploadTask.on(
        () => {
          //TODO:Handle Error
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then(
            async (downloadURL) => {
              await updateDoc(doc(db, "chats", data.chatId), {
                messages: arrayUnion({
                  id: uuid(),
                  text: text + emoji + note,
                  senderId: currentUser.uid,
                  senderImg: currentUser.photoURL,
                  date: Timestamp.now(),
                  img: downloadURL,
                }),
              });
            }
          );
        }
      );
      setText("");
      setImg(null);
      setShowPicker(false)
      setEmoji("")
      setNote("")
      setVideo(null)
    } else if (video) {
      const storageRef = ref(storage, uuid());
      const uploadTask = uploadBytesResumable(storageRef, video);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
        },
        (error) => {
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then(
            async (downloadURL) => {
              await updateDoc(doc(db, "chats", data.chatId), {
                messages: arrayUnion({
                  id: uuid(),
                  text: text + emoji + note,
                  senderId: currentUser.uid,
                  date: Timestamp.now(),
                  video: downloadURL,
                }),
              });
            }
          );
        }
      );
      setText("");
      setImg(null);
      setShowPicker(false)
      setEmoji("")
      setNote("")
      setVideo(null)
    } else if (zipfile) {
      const storageRef = ref(storage, uuid());
      const uploadTask = uploadBytesResumable(storageRef, zipfile);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
        },
        (error) => {
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then(
            async (downloadURL) => {
              await updateDoc(doc(db, "chats", data.chatId), {
                messages: arrayUnion({
                  id: uuid(),
                  text: text + emoji + note,
                  senderId: currentUser.uid,
                  date: Timestamp.now(),
                  zipfile: downloadURL,
                }),
              });
            }
          );
        }
      );
      setText("");
      setImg(null);
      setShowPicker(false)
      setEmoji("")
      setNote("")
      setVideo(null)
      setZipfile(null)
    }
    else {
      await updateDoc(doc(db, "chats", data.chatId), {
        messages: arrayUnion({
          id: uuid(),
          text: text + emoji + note,
          senderId: currentUser.uid,
          senderImg: currentUser.photoURL,
          date: Timestamp.now(),
        }),
      });
    }

    setText("");
    setImg(null);
    setShowPicker(false)
    setEmoji("")
    setNote("")
    setVideo(null)
  };

  const handleSend = async () => {
    console.log("messages before update", data.messages);

    if (img) {
      const storageRef = ref(storage, uuid());

      const uploadTask = uploadBytesResumable(storageRef, img);

      uploadTask.on(
        () => {
          //TODO:Handle Error
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then(
            async (downloadURL) => {
              await updateDoc(doc(db, "chats", data.chatId), {
                messages: arrayUnion({
                  id: uuid(),
                  text: text + emoji + note,
                  senderId: currentUser.uid,
                  date: Timestamp.now(),
                  img: downloadURL,
                }),
              });
            }
          );
        }
      );
      setText("");
      setImg(null);
      setShowPicker(false)
      setEmoji("")
      setNote("")
      setVideo(null)
    } else if (video) {
      const storageRef = ref(storage, uuid());
      const uploadTask = uploadBytesResumable(storageRef, video);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
        },
        (error) => {

        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then(
            async (downloadURL) => {
              await updateDoc(doc(db, "chats", data.chatId), {
                messages: arrayUnion({
                  id: uuid(),
                  text: text + emoji + note,
                  senderId: currentUser.uid,
                  date: Timestamp.now(),
                  video: downloadURL,
                }),
              });
            }
          );
        }
      );
      setText("");
      setImg(null);
      setShowPicker(false)
      setEmoji("")
      setNote("")
      setVideo(null)
    }else if (zipfile) {
      const storageRef = ref(storage, uuid());
      const uploadTask = uploadBytesResumable(storageRef, zipfile);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
        },
        (error) => {
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then(
            async (downloadURL) => {
              await updateDoc(doc(db, "chats", data.chatId), {
                messages: arrayUnion({
                  id: uuid(),
                  text: text + emoji + note,
                  senderId: currentUser.uid,
                  date: Timestamp.now(),
                  zipfile: downloadURL,
                }),
              });
            }
          );
        }
      );
      setText("");
      setImg(null);
      setShowPicker(false)
      setEmoji("")
      setNote("")
      setVideo(null)
      setZipfile(null)
    }
    else {
      await updateDoc(doc(db, "chats", data.chatId), {
        messages: arrayUnion({
          id: uuid(),
          text: text + emoji + note,
          senderId: currentUser.uid,
          date: Timestamp.now(),
        }),
      });
    }
    await updateDoc(doc(db, "userchat", currentUser.uid), {
      [data.chatId + ".lastMessage"]: {
        text: text + emoji + note,
      },
      [data.chatId + ".date"]: serverTimestamp(),
    });

    await updateDoc(doc(db, "userchat", data.user.uid), {
      [data.chatId + ".lastMessage"]: {
        text: text + emoji + note,
      },
      [data.chatId + ".date"]: serverTimestamp(),
    });

    setText("");
    setImg(null);
    setShowPicker(false)
    setEmoji("")
    setNote("")
    setVideo("")
  };
  return (
    <div className="input-containter ml-10 mt-5">
      <div className="input w-full">
        <div className="input-messages w-full pl-40 grid p-4">
          <input
            type="text"
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Backspace' && !text && !emoji && !note) {
                e.preventDefault();
                return;
              }

              if (e.key === 'Backspace') {
                if (!text && !emoji && note) {
                  setNote(note.slice(0, -1));
                } else if (text && emoji && !note) {
                  setEmoji("");
                  setText(text.slice(0, -1));
                } else if (text && !emoji && !note) {
                  setText(text.slice(0, -1));
                } else if (text && emoji && note) {
                  if (text.endsWith(emoji)) {
                    setEmoji("");
                    setText(text.slice(0, -1));
                  } else if (emoji.endsWith(note)) {
                    setNote("");
                    setEmoji(emoji.slice(0, -note.length));
                  } else {
                    setText(text.slice(0, -1));
                  }
                }
              }
            }}
            className="rounded-lg w-5/6 h-16 bg-transparent border border-white shadow-lg text-black placeholder:p-3"
            placeholder="Write a Message"
            value={text + note + emoji}
          />
          <div className="fileinputs text-3xl absolute mt-4 right-96 mr-24">
            <ion-icon
              name="folder-outline"
              onClick={() => {
                const fileInput = document.getElementById('file-input');
                fileInput.click();
              }}
            />
          </div>

          <input
            id="file-input"
            type="file"
            accept="application/vnd.openxmlformats-officedocument.wordprocessingml.document, application/x-zip-compressed, application/pdf, image/*, video/*"
            style={{ display: 'none' }}
            onChange={(e) => {
              const file = e.target.files[0];
              if (file) {
                if (file.type.startsWith('image')) {
                  setImg(file);
                  setVideo(null);
                  setZipfile(null)
                } else if (file.type.startsWith('video')) {
                  setVideo(file);
                  setImg(null);
                  setZipfile(null)
                } else if (file.type === 'application/pdf' || file.type === 'application/x-zip-compressed' || file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
                  setZipfile(file);
                  setImg(null);
                  setVideo(null);
                } else {
                  console.log('Selected file:', file);
                  console.log('File type:', file.type);
                  alert('Invalid file type. Please upload an image, video, or zip file.');
                }
              }
            }}
          />

          <div className="voicerec absolute mt-4 mr-10 right-96">
            <button className="text-3xl" onClick={() => setIsListening(prevState => !prevState)}>
              <ion-icon name="mic-outline"></ion-icon>
            </button>
          </div>
          <button className="text-3xl absolute mt-3 mr-10 right-80" onClick={() => setShowPicker(true)}>😀</button>
          {showPicker && (
            <div className="emojis absolute bottom-44">
              <EmojiPicker
                onEmojiClick={(event, emojiObject) =>
                  setEmoji((prevEmoji) => prevEmoji + emojiObject.emoji)
                }
              />
            </div>
          )}
          {showsenddm && (
            <button
              type="submit"
              onClick={() => handleSend()}
              className="mt-4 absolute right-72 text-[#36c5f0] text-2xl"
            >
              <ion-icon name="send-outline"></ion-icon>
            </button>
          )}
          {showsendchannel && (
            <button
              type="submit"
              onClick={() => handlechannelsendmessage()}
              className="mt-4 absolute right-72 text-red-500 text-2xl"
            >
              <ion-icon name="send-outline"></ion-icon>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Input;
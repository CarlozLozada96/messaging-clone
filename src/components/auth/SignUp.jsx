import { useState } from 'react';
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth, db, storage } from "../../firebase";
import { collection, doc, setDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { useNavigate } from 'react-router-dom';

const SignUp = () => {
  const [userState, setUserState] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errorState, setErrorState] = useState([]);
  const [img, setImg] = useState(null);

  const handleInput = (event) => {
    let target = event.target;
    setUserState((currentState) => {
      let currentUser = { ...currentState };
      currentUser[target.name] = target.value;
      return currentUser;
    });
  };

  const checkForm = () => {
    setErrorState([]);
    if (isFormEmpty()) {
      setErrorState([{ message: "Please fill up the empty details" }]);
      return false;
    } else if (!checkPassword()) {
      return false;
    }
    return true;
  };

  const isFormEmpty = () => {
    const { username, email, password, confirmPassword } = userState;
    return (
      !username.length || !email.length || !password.length || !confirmPassword.length
    );
  };

  const checkPassword = () => {
    const { username, password, confirmPassword } = userState;
    if (password.length < 8) {
      setErrorState([{ message: "Password must be greater than 8" }]);
      return false;
    } else if (password !== confirmPassword) {
      setErrorState([{ message: "Password does not match" }]);
      return false;
    } else if (username.length > 12) {
      setErrorState([{ message: "Username Must Less than 12 only" }]);
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorState([]);
    const storageRef = ref(storage, userState.username);
    if (checkForm()) {
      try {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          userState.email,
          userState.password
        );
        await uploadBytesResumable(storageRef, img);
        const downloadURL = await getDownloadURL(storageRef);
        await updateProfile(userCredential.user, {
          displayName: userState.username,
          photoURL: downloadURL,
        });
        const usersRef = collection(db, "users");
        await setDoc(doc(usersRef, userCredential.user.uid), {
          uid: userCredential.user.uid,
          displayName: userState.username,
          email: userState.email,
          photoURL: downloadURL,
        });
        const userChatRef = collection(db, "userchat");
        await setDoc(doc(userChatRef, userCredential.user.uid), {});
        const successMessage = "Registration successful!";
        setErrorState([{ message: successMessage, type: "success" }]);
      } catch (error) {
        const errorMessage =
          error.code === "auth/email-already-in-use"
            ? "Email is already in use."
            : "Registration failed. Please try again.";
        setErrorState([{ message: errorMessage, type: "error" }]);
      }
    }
  };
  const navigatetologin = useNavigate();
  return (
    <div className="container w-full max-w-xl mt-8 bg-slate-100 rounded-lg grid justify-center shadow-lg shadow-gray-500 m-auto">
      <div className="logodetails flex mt-5">
        <img src="logo.png" className="w-12 ml-40" alt="" />
        <h1 className="font-extrabold font-sans mt-2 ml-2 text-2xl">slack</h1>
      </div>
      <p className="mt-2 text-3xl font-extrabold text-center">Sign Up to Slack</p>
      <div className="suggest-info flex text-center">
        <p className="mt-1 ml-5 text-lg font-extralight">We suggest using the</p>
        <p className="mt-1 text-lg ml-2 font-bold">email address you use at work.</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="input-details w-72 grid">
          <input
            type="text"
            onChange={handleInput}
            value={userState.username}
            placeholder="Enter Username"
            name="username"
            id="username"
            className="w-full rounded-md text-center ml-20 mt-10 p-2 shadow-lg shadow-gray-300"
          />
          <input
            type="text"
            onChange={handleInput}
            value={userState.email}
            placeholder="Enter Email Address"
            name="email"
            id="email"
            className="w-full rounded-md text-center ml-20 mt-3 p-2 shadow-lg shadow-gray-300"
          />
          <input
            type="password"
            onChange={handleInput}
            value={userState.password}
            placeholder="Enter Your Password"
            name="password"
            id="password"
            className="w-full rounded-md text-center ml-20 p-2 mt-3 shadow-lg shadow-gray-300"
          />
          <input
            type="password"
            onChange={handleInput}
            value={userState.confirmPassword}
            placeholder="Confirm Your Password"
            name="confirmPassword"
            id="confirmPassword"
            className="w-full rounded-md text-center mt-3 ml-20 p-2 mb-3 shadow-lg shadow-gray-300"
          />
          <input
            type="file"
            onChange={(e) => setImg(e.target.files[0])}
            placeholder="Confirm Your Password"
            name="avatar"
            id="avatar"
            className="w-full rounded-md text-center mt-3 ml-20 p-2 mb-3 shadow-lg shadow-gray-300"
          />
          <button
            type="submit"
            className="hover:text-yellow-400 shadow-lg shadow-gray-500 w-full rounded-md text-center ml-20 p-2 mb-3 bg-violet-950 text-white"
          >
            Register
          </button>
          {errorState.length > 0 && (
            <p
              className={`text-center ml-40 ${errorState[0].type === "success"
                  ? "text-green-500"
                  : "text-red-500"
                } font-semibold`}
              id="errormessages"
            >
              <ul>
                {errorState.map((error, index) => (
                  <li key={index}>{error.message}</li>
                ))}
              </ul>
            </p>
          )}
        </div>
      </form>
      <h1 className="text-center font-semibold mt-3 mb-4">OR</h1>
      <div className="othersignin w-72 ">
        <button className="hover:shadow-lg shadow-gray-500 w-full rounded-md text-center ml-20 p-2 mb-3 border border-black font-semibold">
          <div className="google flex absolute mt-1 ml-6">
            <ion-icon name="logo-google"></ion-icon>
          </div>
          Sign up with Google
        </button>
        <button className="hover:shadow-lg shadow-gray-500 w-full rounded-md text-center ml-20 p-2 mb-3 border border-black font-semibold">
          <div className="google flex absolute mt-1 ml-6">
            <ion-icon name="logo-apple"></ion-icon>
          </div>
          Sign up with Apple
        </button>
      </div>
      <p className="text-center">Have an Account?</p>
      <p
        className="text-center font-semibold hover:text-yellow-400 text-sky-500 mb-5 cursor-pointer"
        onClick={() => navigatetologin("/login")}
      >
        Login to my Account
      </p>
    </div>
  );
};

export default SignUp;
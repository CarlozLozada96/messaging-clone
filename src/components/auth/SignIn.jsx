import { useState, useEffect } from 'react'
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase";
import { useNavigate } from 'react-router-dom';

const SignIn = () => {
  const [userState, setUserState] = useState({
    email: '',
    password: ''
  });
  const [errorState, setErrorState] = useState([]);

  const handleInput = (event) => {
    let target = event.target;
    setUserState((currentState) => {
      let currentUser = { ...currentState };
      currentUser[target.name] = target.value;
      return currentUser;
    });
  };

  const navigateToApp = useNavigate();
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        navigateToApp('/');
      }
    });
    return unsubscribe;
  }, [navigateToApp]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorState([]);
    if (checkForm()) {
      signInWithEmailAndPassword(auth, userState.email, userState.password)
        .then(() => {
          navigateToApp("/");
        })
        .catch(() => {
          setErrorState([{ message: 'Email or Password is Incorrect!' }]);
        });
    }
  };
  const checkForm = () => {
    setErrorState([]);
    if (isFormEmpty()) {
      setErrorState([{ message: 'Please fill up the empty details' }]);
      return false;
    }
    return true;
  };

  const isFormEmpty = () => {
    const { email, password } = userState;
    return !email.length || !password.length
  };
  const navigatetologin = useNavigate();

  return (
    <div className="container w-full max-w-xl mt-8 bg-slate-100 rounded-lg grid justify-center shadow-lg shadow-gray-500 m-auto">
      <div className="logodetails flex mt-5">
        <img src="logo.png" className="w-12 ml-40" alt="" />
        <h1 className="font-extrabold font-sans mt-2 ml-2 text-2xl">slack</h1>
      </div>
      <p className="mt-2 text-3xl font-extrabold text-center">Sign In to Slack</p>
      <div className="suggest-info flex text-center">
        <p className="mt-1 ml-5 text-lg font-extralight">We suggest using the</p>
        <p className="mt-1 text-lg ml-2 font-bold">email address you use at work.</p>
      </div>

      <form onSubmit={handleSubmit} className='mt-10'>
        <div className="input-details w-72 grid">
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
          <button type="submit" className="hover:text-yellow-400 shadow-lg shadow-gray-500 w-full rounded-md text-center ml-20 p-2 mb-3 mt-3 bg-violet-950 text-white">
            Login
          </button>
          {errorState.length > 0 && (
            <p className={`text-center ml-40 ${errorState[0].type === 'success' ? 'text-green-500' : 'text-red-500'} font-semibold`} id="errormessages">
              <ul>
                {errorState.map((error, index) => (
                  <li key={index}>{error.message}</li>
                ))}
              </ul>
            </p>
          )}
        </div>
      </form>
      <h1 className="text-center font-semibold mt-8">OR</h1>
      <div className="othersignin w-72 ">
        <button className="hover:shadow-lg shadow-gray-300 w-full rounded-md text-center ml-20 p-2 mb-3 border border-black font-semibold">
          <div className="google flex absolute mt-1 ml-6">
            <ion-icon name="logo-google"></ion-icon>
          </div>
          Sign in with Google
        </button>
        <button className="hover:shadow-lg shadow-gray-300 w-full rounded-md text-center ml-20 p-2 mb-3 border border-black font-semibold">
          <div className="google flex absolute mt-1 ml-6">
            <ion-icon name="logo-apple"></ion-icon>
          </div>
          Sign in with Apple
        </button>
      </div>
      <p className="text-center">New to Slack?</p>
      <p className='text-center hover:text-yellow-400 font-semibold text-sky-500 mb-5 cursor-pointer' onClick={() => navigatetologin("/register")}>
        Create an Account
      </p>
    </div>
  );
};
export default SignIn;
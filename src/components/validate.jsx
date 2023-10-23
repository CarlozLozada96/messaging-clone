
import { useEffect, useState, useContext } from "react";
import { auth } from "../firebase";
import { useNavigate } from 'react-router-dom';
import { onAuthStateChanged } from "firebase/auth";

const ValidatedDetails = () => {
  const [authUser, setAuthUser] = useState(null);
  const notsignedin = useNavigate();
  console.log(authUser)

  useEffect(() => {
    const listen = onAuthStateChanged(auth, (user) => {
      if (user) {
        setAuthUser(user);
      } else {
        setAuthUser(null);
        notsignedin('/login');
      }
    });

    return () => {
      listen();
    };
  }, [notsignedin]);

  return (
    <>


    </>
  );
};
export default ValidatedDetails;
export const UserAuth = () => {
return useContext(ValidatedDetails);
}
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  const [user, setUser] = useState(undefined); // undefined = loading

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, currentUser => setUser(currentUser));
    return () => unsub();
  }, []);

  if (user === undefined) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  return children;
};

export default PrivateRoute;

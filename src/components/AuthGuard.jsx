import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase/firebase";
import { Navigate } from "react-router-dom";

function AuthGuard({ children }) {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

    useEffect(() => {
      const unsub = onAuthStateChanged(auth, (u) => {
        setUser(u);
        setLoading(false);
      });
      return () => unsub();
    }, []);

  if (loading) return <p>認証確認中...</p>;

  if (!user) return <Navigate to="/admin" replace />;

  return children;
}

export default AuthGuard;

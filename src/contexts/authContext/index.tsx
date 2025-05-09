import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import { app } from "../../auth/firebase"; // Make sure to configure Firebase in this file
import { useRouter } from "next/navigation";

interface AuthContextProps {
  currentUser: User | null;
  userLoggedIn: boolean;
}

interface AuthProviderProps {
  children: ReactNode;
}
const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<AuthProviderProps> = ({
  children,
}: any) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userLoggedIn, setUserLoggedIn] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const auth = getAuth(app);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    if (!currentUser) {
      router.push("/auth/sign-in");
    }

    return () => unsubscribe();
  }, [auth]);

  // useEffect(() => {
  //   auth.authStateReady().then(() => {
  //     if (!auth.currentUser) {
  //       router.push("/auth/sign-in");
  //     }
  //   });
  // }, [auth]);

  useEffect(() => {
    if (currentUser) {
      setUserLoggedIn(true);
    } else {
      setUserLoggedIn(false);
    }
    setLoading(false);
  }, [currentUser]);

  return (
    <AuthContext.Provider value={{ currentUser, userLoggedIn }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextProps => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

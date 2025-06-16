import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
//  import { User } from "firebase/auth";
// import { app } from "../../auth/firebase"; // Make sure to configure Firebase in this file
import { useRouter } from "next/navigation";
import { loginService } from "@/app/api/services/authService";

type User = {
  email: string;
  password: string;
}

interface AuthContextProps {
  currentUser: User | null;
  userLoggedIn: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
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
  // const auth = getAuth(app);
  const router = useRouter();

  const login = async (username: string, password: string): Promise<boolean> => {
    console.log("Attempting to log in with", username, password);
    const success = await loginService(username, password);
    if (success) {
      console.log("Login successful");
      setCurrentUser({ email: username, password });
      setUserLoggedIn(true);
    } else {
      console.error("Login failed");
    }
    return success;
  };

  const logout = () => {
    setCurrentUser(null);
    setUserLoggedIn(false);
    // Optionally clear any tokens or session data here
  };
  // useEffect(() => {
  //   const unsubscribe = onAuthStateChanged(auth, (user) => {
  //     setCurrentUser(user);
  //   });
  //   if (!currentUser) {
  //     router.push("/auth/sign-in");
  //   }

  //   return () => unsubscribe();
  // }, [auth]);

  useEffect(() => {

      if (!userLoggedIn) {
        router.push("/auth/sign-in");
      }
    
  }, [currentUser, userLoggedIn]);

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
    <AuthContext.Provider value={{ currentUser, userLoggedIn, login, logout }}>
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

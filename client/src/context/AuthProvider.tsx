// src/components/AuthProvider.tsx
import React, {
  ReactNode,
  useEffect,
  useState,
  createContext,
  useContext,
} from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged, User } from "firebase/auth";

// Define the context type
interface AuthContextType {
  user: User | null;
  loading: boolean;
}

// Create the context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        navigate("/auth");
      }
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [navigate]);

  if (loading) return <div>Loading...</div>;

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;

// Hook to use the Auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

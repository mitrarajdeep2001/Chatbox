import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

interface ThemeContextType {
  theme: "light" | "dark";
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | null>(null);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [hydrated, setHydrated] = useState(false);

  // Ensure hydration before setting the theme
  useEffect(() => {
    const storedTheme = localStorage.getItem("theme") as "light" | "dark";
    if (storedTheme) {
      setTheme(storedTheme);
      document.documentElement.className = storedTheme;
    }
    setHydrated(true); // Mark hydration complete
  }, []);

  useEffect(() => {
    if (hydrated) {
      document.documentElement.className = theme;
      localStorage.setItem("theme", theme);
    }
  }, [theme, hydrated]);

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  // Prevent rendering until hydration is complete
  if (!hydrated) return null;

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

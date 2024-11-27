// MainLayout.jsx
import { Outlet } from "react-router-dom";
import LeftSidebar from "@/components/Sidebar";
import { ThemeProvider } from "./context/ThemeProvider";
import AuthProvider from "./context/AuthProvider";

const MainLayout = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <div className="dark:bg-dark-primary bg-light-primary flex font-sans">
          <LeftSidebar /> {/* Sidebar visible across all pages */}
          <div style={{ flex: 1 }}>
            <Outlet /> {/* Where nested routes will render */}
          </div>
        </div>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default MainLayout;

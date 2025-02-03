// MainLayout.jsx
import { Outlet } from "react-router-dom";
import LeftSidebar from "@/components/Sidebar";
import { ThemeProvider } from "./context/ThemeProvider";
import AuthProvider from "./context/AuthProvider";
import SocketProvider from "./context/SocketProvider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import WebRTCProvider from "./context/WebRTCProvider";
import { GeneralProvider } from "./context/GeneralProvider";

const MainLayout = () => {
  // Create a client
  const queryClient = new QueryClient();
  return (
    <GeneralProvider>
      <ThemeProvider>
        <AuthProvider>
          <SocketProvider>
            <WebRTCProvider>
              <QueryClientProvider client={queryClient}>
                <div className="dark:bg-dark-primary bg-light-primary flex font-sans relative">
                  <LeftSidebar /> {/* Sidebar visible across all pages */}
                  <div style={{ flex: 1 }}>
                    <Outlet /> {/* Where nested routes will render */}
                  </div>
                </div>
                {/* <ReactQueryDevtools initialIsOpen={false} /> */}
              </QueryClientProvider>
            </WebRTCProvider>
          </SocketProvider>
        </AuthProvider>
      </ThemeProvider>
    </GeneralProvider>
  );
};

export default MainLayout;

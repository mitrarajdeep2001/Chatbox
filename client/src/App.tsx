import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainLayout from "./MainLayout";
import Home from "./pages/Home";
import Auth from "./pages/Auth";

function App() {
  return (
    <Router>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/chat/:id" element={<Home />} />
          {/* Add more routes here */}
        </Route>
        <Route path="/auth" element={<Auth />} />
      </Routes>
    </Router>
  );
}

export default App;

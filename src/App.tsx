import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import Home from "./pages/Home";
import About from "./pages/About";
<<<<<<< HEAD
import Profile from "./pages/Profile";
=======
import Dashboard from "./pages/Dashboard"; 

>>>>>>> 5eefdbc99be83fc8e3484a0f5451e06781bad555

export default function App() {
  return (
    <BrowserRouter>
      <MainLayout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
<<<<<<< HEAD
          <Route path="/profile" element={<Profile />} />
=======
          <Route path="/dashboard" element={<Dashboard />} /> 

>>>>>>> 5eefdbc99be83fc8e3484a0f5451e06781bad555
        </Routes>
      </MainLayout>
    </BrowserRouter>
  );
}

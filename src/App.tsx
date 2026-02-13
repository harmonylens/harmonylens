import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import EventPage from "./pages/Event";
import Header from "./components/Header";

function App() {
  return (
    <div className="min-h-screen bg-white text-black flex flex-col">
      <Header />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/event/:event" element={<EventPage />} />
      </Routes>
    </div>
  );
}

export default App;

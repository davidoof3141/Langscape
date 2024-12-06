import Navbar from "./components/navbar/navbar";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import ChatPage from "./pages/chat/ChatPage";
import Vocabulary from "./pages/vocabulary/Vocabulary";

const Home = () => (
  <div>
    <Navbar></Navbar>
  </div>
)

const App = () => (
  <Router>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/chat" element={<ChatPage />} />
      <Route path="/vocabulary" element={<Vocabulary />} />
    </Routes>
  </Router>
)

export default App;

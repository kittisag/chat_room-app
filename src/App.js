import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ChatRoom from "./components/ChatRoom";
import CreateChatRoom from "./components/createChatRoom";
import LogoIcon from "./assets/images/logo.png";

const App = () => {
  return (
    <div className="app">
      <div className="home-title-icon">
        <img src={LogoIcon} alt="icon" width="150px" />
      </div>
      <div className="container">
        <Router>
          <Routes>
            <Route path="/" element={<CreateChatRoom />} />
            <Route path="/chat-room/:roomId" element={<ChatRoom />} />
          </Routes>
        </Router>
      </div>
    </div>
  );
};

export default App;

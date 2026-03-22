import React from 'react';
import { Routes, Route } from "react-router-dom";
import LoginPanel from "./components/Login/Login";
import Register from "./components/Register/Register";

function App() {
  return (
    <Routes>
      {/* This covers /login and /login/ */}
      <Route path="/login" element={<LoginPanel />} />
      <Route path="/login/" element={<LoginPanel />} />
      
      {/* This covers /register and /register/ */}
      <Route path="/register" element={<Register />} />
      <Route path="/register/" element={<Register />} />
      
      {/* Default route for the homepage */}
      <Route path="/" element={<LoginPanel />} /> 
    </Routes>
  );
}

export default App;

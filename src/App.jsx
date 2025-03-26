import React from "react";
import Home from "./Pages/Home";
import { Routes, Route } from "react-router-dom";
import Header from "./Components/Header";
import Hero from "./Components/HERO.JSX";
export default function App() {
  return (
    <div>
      <Header />
      <Routes>
        <Route path="/home" element={<Hero />} />
        <Route path="/chatbot" element={<Home />} />
      </Routes>
    </div>
  );
}

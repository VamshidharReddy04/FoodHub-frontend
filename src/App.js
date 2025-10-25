import "./App.css";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from "./screens/Home";
import Login from "./screens/Login";
import SignUp from "./screens/SignUp";
import MyCart from "./screens/MyCart";
import MyOrder from "./screens/MyOrder";
import { CartProvider } from './components/ContextReducer';
import WelcomePopup from './components/WelcomePopup';
import React, { useState, useEffect } from 'react';

function App() {
  const [showWelcome, setShowWelcome] = useState(false);

  // show on first app load if user hasn't seen it and is not logged in
  useEffect(() => {
    const seen = localStorage.getItem('welcomeSeen');
    const token = localStorage.getItem('userToken');
    if (!seen && !token) {
      setShowWelcome(true);
    }
  }, []);

  // allow Navbar to force-open popup when brand clicked
  useEffect(() => {
    const handler = (e) => {
      const force = !!(e && e.detail && e.detail.force);
      if (force) localStorage.removeItem('welcomeSeen'); 
      setShowWelcome(true);
    };
    window.addEventListener('showWelcome', handler);
    return () => window.removeEventListener('showWelcome', handler);
  }, []);

  return (
    <CartProvider>
      <Router>
        <WelcomePopup visible={showWelcome} onClose={() => setShowWelcome(false)} />
        <div>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/cart" element={<MyCart />} />
            <Route path="/order" element={<MyOrder />} />
            <Route path="/login" element={<Login />} />
            <Route path="/createuser" element={<SignUp />} />
          </Routes>
        </div>
      </Router>
    </CartProvider>
  );
}

export default App;

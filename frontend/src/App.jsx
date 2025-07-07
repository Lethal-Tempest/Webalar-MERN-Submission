import React, { useState, useEffect } from 'react';
import Login from './pages/Login';
import Home from './pages/Home';
import Navbar from './components/Navbar';
import { Routes, Route, useNavigate } from 'react-router-dom';

const App = () => {
  const navigate = useNavigate();
  const [token, setToken] = useState(localStorage.getItem('token') || '');

  useEffect(() => {
    if (token) {
      navigate('/');
    } else {
      navigate('/login');
    }
  }, [token, navigate]);

  return (
    <div className='flex-1 bg-neutral-800'>
      <Navbar onLogout={() => {
        localStorage.removeItem('token');
        setToken('');
      }} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login setToken={setToken} />} />
      </Routes>
    </div>
  );
};

export default App;

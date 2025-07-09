import React, { useState, useEffect } from 'react';
import Login from './pages/Login';
import Home from './pages/Home';
import Navbar from './components/Navbar';
import { Routes, Route, useNavigate } from 'react-router-dom';

const App = () => {
  const navigate = useNavigate();
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (token) {
      navigate('/');
    } else {
      navigate('/login');
    }
  }, [token, navigate]);

  return (
    <div className='flex-1 bg-neutral-800 overflow-x-hidden'>
      <Navbar onLogout={() => {
        localStorage.removeItem('token');
        setToken('');
      }} setVisible={setVisible} visible={visible} />
      <Routes>
        <Route path="/" element={<Home visible={visible} setVisible={setVisible} />} />
        <Route path="/login" element={<Login setToken={setToken} />} />
      </Routes>
    </div>
  );
};

export default App;

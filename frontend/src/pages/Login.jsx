import axios from 'axios';
import React, { useState } from 'react';
import { useShopContext } from '../context/ShopContext';

const Login = ({setToken}) => {
  const { backendUrl } = useShopContext();
  const [state, setState] = useState('login');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${backendUrl}/api/user/${state}`, formData);

      if (response.data.success) {
        localStorage.setItem('token', response.data.token);
        setToken(response.data.token);
      } else {
        console.log("❌ Failed:", response.data.message);
      }
    } catch (error) {
      console.error("❌ Error submitting form:", error.response?.data?.message || error.message);
    }
  };

  return (
    <div className='flex justify-center items-center h-screen relative bottom-30'>
      <div className='flex flex-col gap-15 items-center'>
        <span className='text-4xl font-bold text-neutral-300'>
          {state === 'login' ? 'LOG IN' : 'SIGN UP'}
        </span>
        <div className='flex flex-col gap-6'>
          {state === 'signup' && (
            <div className='flex items-center w-110 justify-between'>
              <span className='text-lg text-neutral-300'>Name</span>
              <input
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                value={formData.name}
                className='w-80 p-2 px-3 rounded-lg bg-neutral-700 text-neutral-300'
                type="text"
                required
              />
            </div>
          )}
          <div className='flex items-center w-110 justify-between'>
            <span className='text-lg text-neutral-300'>Email</span>
            <input
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              value={formData.email}
              className='w-80 p-2 px-3 rounded-lg bg-neutral-700 text-neutral-300'
              type="email"
              required
            />
          </div>
          <div className='flex items-center w-110 justify-between'>
            <span className='text-lg text-neutral-300'>Password</span>
            <input
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              value={formData.password}
              className='w-80 p-2 px-3 rounded-lg bg-neutral-700 text-neutral-300'
              type="password"
              required
            />
          </div>
          <button
            onClick={handleSubmit}
            className='p-2 px-3 rounded-lg bg-neutral-900 text-neutral-300 text-2xl hover:bg-neutral-300 hover:text-neutral-900 hover:cursor-pointer hover:scale-105 active:scale-110 transition-all ease-in-out duration-300'
          >
            {state === 'login' ? 'LOG IN' : 'SIGN UP'}
          </button>
        </div>
        <div className='flex justify-between w-full mt-4'>
          <span className='text-lg text-neutral-300'>
            {state === 'login' ? "Don't have an account?" : "Already have an account?"}
          </span>
          <span
            className='text-lg text-neutral-300 hover:cursor-pointer hover:text-neutral-400 ml-2'
            onClick={() => setState(state === 'login' ? 'signup' : 'login')}
          >
            {state === 'login' ? 'Sign up' : 'Log in'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default Login;

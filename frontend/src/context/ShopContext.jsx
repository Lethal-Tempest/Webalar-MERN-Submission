// ✅ ShopContext.jsx
import React, { createContext, useContext } from 'react';

const ShopContext = createContext();

export const useShopContext = () => useContext(ShopContext);

export const ShopProvider = ({ children }) => {
  const backendUrl = 'http://localhost:5000';

  return (
    <ShopContext.Provider value={{ backendUrl }}>
      {children}
    </ShopContext.Provider>
  );
};

// ✅ ShopContext.jsx
import React, { createContext, useContext } from 'react';

const ShopContext = createContext();

export const useShopContext = () => useContext(ShopContext);

export const Columns = [
  {
    id: "todo",
    title: "To Do"
  },
  {
    id: "ip",
    title: "In Progress"
  },
  {
    id: "done",
    title: "Done"
  }
]

export const ShopProvider = ({ children }) => {
  const backendUrl = 'http://localhost:5000';

  return (
    <ShopContext.Provider value={{ backendUrl, Columns }}>
      {children}
    </ShopContext.Provider>
  );
};

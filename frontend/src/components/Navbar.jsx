const Navbar = ({ onLogout }) => {
  return (
    <nav className="p-4 text-white flex justify-between">
      <h1 className="text-2xl">My App</h1>
      <button onClick={onLogout} className="bg-red-600 px-4 py-2 rounded">Logout</button>
    </nav>
  );
};

export default Navbar;
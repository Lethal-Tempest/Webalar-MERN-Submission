import { GiHamburgerMenu } from "react-icons/gi";
import { IoCloseOutline } from "react-icons/io5";

const Navbar = ({ onLogout, setVisible, visible }) => {
    return (
        <nav className="p-4 text-white flex justify-between h-[10vh] items-center px-10">
            <h1 className="text-2xl">My App</h1>
            {localStorage.getItem('token') && 
            <div className="flex items-center gap-5">
                <button onClick={onLogout} className="bg-red-600 px-4 py-2 rounded hover:cursor-pointer hover:scale-105 active:scale-110 transition-all duration-300 ease-in-out">Logout</button>
                <div>
                    {
                        visible
                            ? <IoCloseOutline onClick={() => setVisible(false)} size={24} className="text-neutral-300 block lg:hidden hover:cursor-pointer" />
                            : <GiHamburgerMenu onClick={() => setVisible(true)} size={24} className="text-neutral-300 block lg:hidden hover:cursor-pointer" />
                    }

                </div>
            </div>}
        </nav>
    );
};

export default Navbar;
import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router";
import { FaShoppingCart } from "react-icons/fa";
import { HiMenu, HiX } from "react-icons/hi";
import { AuthContext } from "../context/AuthProvider.jsx";

const Navbar = () => {
  const { user, logout } = React.useContext(AuthContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showNavbar, setShowNavbar] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const navigate = useNavigate();



    // 🔥 Here move handleRemoveItem
    const handleRemoveItem = (indexToRemove) => {
      const updatedCart = cartItems.filter((_, index) => index !== indexToRemove);
      setCartItems(updatedCart);
      localStorage.setItem('cart', JSON.stringify(updatedCart));
  
      window.dispatchEvent(new Event('cartUpdated'));
    };


    useEffect(() => {
      const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
      setCartItems(storedCart);
    
      const handleCartChange = () => {
        const updatedCart = JSON.parse(localStorage.getItem('cart')) || [];
        setCartItems(updatedCart);
      };
    
      window.addEventListener('cartUpdated', handleCartChange);
    
      return () => {
        window.removeEventListener('cartUpdated', handleCartChange);
      };
    }, []);
    

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setShowNavbar(false);
      } else {
        setShowNavbar(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [lastScrollY]);

  const handleLogout = () => {
    logout();
  
    const path = window.location.pathname;
  
    const isEditOrAddOrView = 
      path.includes("/books/edit") || 
      path.includes("/books/add") || 
      /^\/books\/[^\/]+$/.test(path);  // regex: matches /books/:id (without extra slash)
  
    if (isEditOrAddOrView) {
      navigate("/signin");
    }
  };

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/books", label: "Shop" },
  ];

  if (user?.role === "admin") {
    navLinks.push({ to: "/books/add", label: "Add Book" });
  }

  return (
    <nav className={`bg-white fixed w-full top-0 z-50 py-4 shadow-sm transition-transform duration-300 ${showNavbar ? "translate-y-0" : "-translate-y-full"}`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          <NavLink to="/" className="text-xl font-bold uppercase">
            Book<span className="text-amber-500">Club.</span>
          </NavLink>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `text-sm font-medium transition-colors ${isActive ? "text-amber-500" : "text-gray-700 hover:text-amber-500"}`
                }
              >
                {label}
              </NavLink>
            ))}
          </div>

          {/* Right Side */}
          <div className="flex items-center space-x-4">
            <button onClick={() => setIsCartOpen(true)} className="relative bg-black text-white p-2 rounded-full">
              <FaShoppingCart />
              {cartItems.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-amber-500 text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cartItems.length}
                </span>
              )}
            </button>

            {!user ? (
              <NavLink to="/signin" className="text-sm text-black">Signin</NavLink>
            ) : (
              <button onClick={handleLogout} className="text-sm text-black">Logout</button>
            )}

            {/* Mobile Menu Toggle */}
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden text-gray-700">
              {isMenuOpen ? <HiX /> : <HiMenu />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4">
            <div className="flex flex-col space-y-2">
              {navLinks.map(({ to, label }) => (
                <NavLink
                  key={to}
                  to={to}
                  onClick={() => setIsMenuOpen(false)}
                  className="text-sm py-2 text-gray-700 hover:text-amber-500"
                >
                  {label}
                </NavLink>
              ))}
              {!user ? (
                <NavLink to="/signin" onClick={() => setIsMenuOpen(false)} className="text-sm text-gray-700">
                  Signin
                </NavLink>
              ) : (
                <button onClick={handleLogout} className="text-sm text-gray-700">
                  Logout
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Cart Sidebar */}
      <div
        className={`fixed top-0 right-0 w-80 max-w-full h-screen bg-white shadow-2xl transform ${isCartOpen ? "translate-x-0" : "translate-x-full"
          } transition-transform duration-300 ease-in-out z-50 flex flex-col`}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-5 border-b shadow-sm">
          <h2 className="text-2xl font-bold text-gray-800">🛒 Your Cart</h2>
          <button
            onClick={() => setIsCartOpen(false)}
            className="text-gray-500 hover:text-gray-800 transition"
          >
            <HiX size={28} />
          </button>
        </div>

        {/* Cart Items */}
        {cartItems.map((item, index) => (
  <div
    key={index}
    className="flex items-center gap-4 p-3 bg-gray-100 rounded-lg shadow-sm relative"
  >
    <img
      src={item.imageUrl || "/placeholder-book.jpg"}
      alt={item.title}
      className="w-16 h-16 rounded-lg object-cover"
    />
    <div className="flex-1">
      <h3 className="font-semibold text-gray-800">{item.title}</h3>
      <p className="text-gray-500 text-sm">${item.price?.toFixed(2)}</p>
    </div>
    {/* Remove button */}
    <button
      onClick={() => handleRemoveItem(index)}
      className="text-red-500 hover:text-red-700 absolute top-2 right-2"
    >
      <HiX size={20} />
    </button>
  </div>
))}

        {/* Checkout Button */}
        {cartItems.length > 0 && (
          <div className="p-5 border-t shadow-inner">
            <button
              onClick={() => {
                navigate("/checkout");
                setIsCartOpen(false);
              }}
              className="w-full bg-amber-500 hover:bg-amber-600 text-white font-semibold py-3 rounded-lg shadow-md transition transform hover:scale-105"
            >
              Proceed to Checkout
            </button>
          </div>
        )}
      </div>

    </nav>
  );
};

export default Navbar;

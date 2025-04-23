
import React, { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import { FaShoppingCart } from 'react-icons/fa';
import { HiMenu, HiX } from 'react-icons/hi';
import { NavLink ,useLocation, useNavigate } from 'react-router'

const Navbar = () => {
  const [user, setUser] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Load user from token
  const loadUser = () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUser(decoded);
      } catch (err) {
        console.error('Invalid token');
        setUser(null);
      }
    } else {
      setUser(null);
    }
  };

  useEffect(() => {
    loadUser();
  }, []);

  // Logout handler
  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);

    // If private route, redirect to login
    const privateRoutes = ['/books/add', '/dashboard', '/admin'];
    if (privateRoutes.some(route => location.pathname.startsWith(route))) {
      navigate('/signin');
    }
    // If not private, stay on same page
  };

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/books', label: 'Shop' },
  ];

  if (user?.role === 'admin') {
    navLinks.push({ to: '/books/add', label: 'Add Book' });
  }

  return (
    <nav className="bg-white fixed w-full top-0 z-50 py-4 shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <NavLink to="/" className="text-xl font-bold uppercase tracking-wider">
            Book<span className="text-amber-500">Club.</span>
          </NavLink>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `text-sm font-medium transition-colors ${
                    isActive ? 'text-amber-500' : 'text-gray-700 hover:text-amber-500'
                  }`
                }
              >
                {label}
              </NavLink>
            ))}

            {user ? (
              <button
                onClick={handleLogout}
                className="text-sm font-medium text-red-500 hover:text-red-700"
              >
                Logout
              </button>
            ) : (
              <NavLink to="/signin" className="text-sm font-medium text-gray-700 hover:text-amber-500">
                Signin
              </NavLink>
            )}
          </div>

          {/* Right Icons */}
          <div className="flex items-center space-x-4">
            <NavLink
              to="/cart"
              className="bg-black text-white p-2 rounded-full hover:bg-gray-800 transition-colors"
            >
              <FaShoppingCart className="h-5 w-5" />
            </NavLink>

            {/* Mobile Menu Toggle */}
            <button
              className="md:hidden text-gray-700 hover:text-amber-500 transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <HiX className="h-6 w-6" /> : <HiMenu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden pt-4 pb-2">
            <div className="flex flex-col space-y-3">
              {navLinks.map(({ to, label }) => (
                <NavLink
                  key={to}
                  to={to}
                  className={({ isActive }) =>
                    `text-sm font-medium py-2 transition-colors ${
                      isActive ? 'text-amber-500' : 'text-gray-700 hover:text-amber-500'
                    }`
                  }
                  onClick={() => setIsMenuOpen(false)}
                >
                  {label}
                </NavLink>
              ))}

              {user ? (
                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    handleLogout();
                  }}
                  className="text-left text-sm font-medium py-2 text-red-500 hover:text-red-700"
                >
                  Logout
                </button>
              ) : (
                <NavLink
                  to="/signin"
                  className="text-sm font-medium py-2 text-gray-700 hover:text-amber-500"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Signin
                </NavLink>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

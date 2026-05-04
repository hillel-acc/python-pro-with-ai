import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/auth';
import { useCartStore } from '../store/cart';
import Cart from './Cart';

const Header = () => {
  const { user, logout } = useAuthStore();
  const { items, loadCart } = useCartStore();
  const [cartOpen, setCartOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    if (user) {
      loadCart();
    }
  }, [user, loadCart]);

  return (
    <header className="sticky top-0 z-20 bg-white border-b shadow-sm">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold text-gray-800">
          Shop
        </Link>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setCartOpen(true)}
            className="relative p-2 text-gray-600 hover:text-gray-800"
          >
            🛒
            {
              (items ?? []).length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1">
                  {items.length}
                </span>
              )
            }
          </button>
          {user ? (
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center"
              >
                👤
              </button>
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border rounded shadow-lg">
                  <Link
                    to="/orders"
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                    onClick={() => setDropdownOpen(false)}
                  >
                    My Orders
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setDropdownOpen(false);
                    }}
                    className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Login
            </Link>
          )}
        </div>
      </div>
      <Cart open={cartOpen} onClose={() => setCartOpen(false)} />
    </header>
  );
};

export default Header;
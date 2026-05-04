import { useCartStore } from '../store/cart';
import { Link } from 'react-router-dom';

interface CartProps {
  open: boolean;
  onClose: () => void;
}

const Cart = ({ open, onClose }: CartProps) => {
  const { items, updateQuantity, removeItem, getTotal } = useCartStore();
  const total = getTotal();

  const calculateSubtotal = (item: any) => parseFloat(item.price) * item.quantity;

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-end z-50">
      <div className="bg-white w-full max-w-md h-full p-4 overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Shopping Cart</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            ✕
          </button>
        </div>
        {(items ?? []).length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          <>
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.product_id} className="flex justify-between items-center border-b pb-2">
                  <div>
                    <p className="font-medium">Product {item.product_id}</p>
                    <p className="text-sm text-gray-600">${calculateSubtotal(item).toFixed(2)}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => updateQuantity(item.product_id, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                      className="px-2 py-1 bg-gray-200 rounded disabled:opacity-50"
                    >
                      -
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.product_id, item.quantity + 1)}
                      className="px-2 py-1 bg-gray-200 rounded"
                    >
                      +
                    </button>
                    <button
                      onClick={() => removeItem(item.product_id)}
                      className="px-2 py-1 bg-red-500 text-white rounded"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t">
              <p className="text-lg font-bold">Total: ${total.toFixed(2)}</p>
              <Link
                to="/checkout"
                onClick={onClose}
                className="block w-full mt-4 px-4 py-2 bg-green-500 text-white text-center rounded hover:bg-green-600"
              >
                Checkout
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Cart;
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useCartStore } from '../store/cart';
import { checkout } from '../api/client';

const stripePromise = loadStripe('pk_test_...'); // Replace with actual test key

const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { clearCart, getTotal } = useCartStore();
  const total = getTotal();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);
    try {
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/orders`,
        },
      });
      if (error) {
        alert(error.message);
      } else {
        clearCart();
        navigate('/orders');
      }
    } catch (err) {
      alert('Payment failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement />
      <button
        type="submit"
        disabled={!stripe || loading}
        className="w-full mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
      >
        {loading ? 'Processing...' : 'Place Order'}
      </button>
    </form>
  );
};

const Checkout = () => {
  const { items, getTotal } = useCartStore();
  const total = getTotal();
  const [clientSecret, setClientSecret] = useState('');

  const calculateSubtotal = (item: any) => parseFloat(item.price) * item.quantity;

  useEffect(() => {
    const createOrder = async () => {
      try {
        const response = await checkout();
        // Assume backend returns client_secret or intent_id
        // For simplicity, assume response.data.client_secret
        setClientSecret(response.data.client_secret || 'pi_test_secret'); // Mock
      } catch (error) {
        alert('Failed to create order');
      }
    };
    if (items.length > 0) {
      createOrder();
    }
  }, [items]);

  const options = {
    clientSecret,
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Checkout</h1>
      <div className="mb-6">
        <h2 className="text-xl mb-2">Order Summary</h2>
        {items.map((item) => (
          <div key={item.product_id} className="flex justify-between mb-2">
            <span>Product {item.product_id} x{item.quantity}</span>
            <span>${calculateSubtotal(item).toFixed(2)}</span>
          </div>
        ))}
        <div className="border-t pt-2 font-bold">
          Total: ${total.toFixed(2)}
        </div>
      </div>
      {clientSecret && (
        <Elements stripe={stripePromise} options={options}>
          <CheckoutForm />
        </Elements>
      )}
    </div>
  );
};

export default Checkout;
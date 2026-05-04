import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getOrders} from '../api/client';
import type {Order} from '../api/client';

const OrderDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await getOrders();
        const foundOrder = response.data.find((o: Order) => o.id === parseInt(id!));
        setOrder(foundOrder || null);
      } catch (error) {
        console.error('Failed to fetch order', error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (!order) return <div>Order not found.</div>;

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Order #{order.id}</h1>
      <div className="mb-4">
        <h2 className="text-xl mb-2">Items</h2>
        {order.items.map((item) => (
          <div key={item.id} className="flex justify-between mb-2">
            <span>Product {item.product_id} x{item.quantity}</span>
          </div>
        ))}
      </div>
      <p>Status: {order.stripe_payment_intent_id ? 'Paid' : 'Pending'}</p>
    </div>
  );
};

export default OrderDetails;
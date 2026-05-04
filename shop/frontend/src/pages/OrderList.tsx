import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getOrders} from '../api/client';
import type { Order } from '../api/client';

const OrderList = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await getOrders();
        setOrders(response.data);
      } catch (error) {
        console.error('Failed to fetch orders', error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">My Orders</h1>
      {orders.length === 0 ? (
        <p>No orders yet.</p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="bg-white p-4 rounded shadow">
              <Link to={`/orders/${order.id}`} className="text-blue-500 hover:underline">
                Order #{order.id}
              </Link>
              <p>Items: {order.items.length}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderList;
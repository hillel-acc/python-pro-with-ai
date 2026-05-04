import { useEffect, useState } from 'react';
import { getProducts} from '../api/client';
import type { Product }from '../api/client';
import { useCartStore } from '../store/cart';

const ProductList = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const addItem = useCartStore((state) => state.addItem);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await getProducts();
        setProducts(response.data);
      } catch (error) {
        console.error('Failed to fetch products', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleAddToCart = async (productId: number, price: string) => {
    try {
      await addItem(productId, 1, price);
      alert('Added to cart!');
    } catch (error) {
      alert('Failed to add to cart. Please login.');
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Products</h1>
      <div className="space-y-4">
        {products.map((product) => (
          <div key={product.id} className="bg-white p-4 rounded shadow flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold">{product.name}</h2>
              <p className="text-lg font-bold text-green-600">${product.price}</p>
            </div>
            <button
              onClick={() => handleAddToCart(product.id, product.price)}
              className="self-start md:self-center px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductList;
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api/v1';

export const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Types
export interface Product {
  id: number;
  name: string;
  price: string; // decimal as string
}

export interface CartItem {
  product_id: number;
  quantity: number;
  price: string;
}

export interface OrderItem {
  id: number;
  product_id: number;
  quantity: number;
}

export interface Order {
  id: number;
  customer_id: number;
  stripe_payment_intent_id: string;
  items: OrderItem[];
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
}

// API functions
export const getProducts = () => api.get<Product[]>('/products/');

export const login = (data: LoginRequest) =>
  api.post<LoginResponse>(
    '/token',
    new URLSearchParams({ ...data, grant_type: 'password' }),
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    }
  );

export const syncCart = (items: CartItem[]) =>
  api.post('/cart/items', items);

export const getCart = () => api.get<CartItem[]>('/cart/items');

export const checkout = () => api.post<Order>('/orders');

export const getOrders = () => api.get<Order[]>('/orders');

export const checkPayment = (intent_id: string) =>
  api.get(`/orders/check_payment?intent_id=${intent_id}`);
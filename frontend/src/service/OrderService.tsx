import { api } from "../../api/axios";

interface OrderItem {
  productId: number;
  name: string;
  image: string;
  quantity: number;
  price: number;
}

interface Order {
  orderId: number;
  userId: number;
  username: string;
  totalPrice: number;
  createdAt: string;
  items: OrderItem[];
}

export const OrderService = {
  async getAll() {
    try {
      const response = await api.get("/orders");
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 403) {
        return "NotAdmin";
      }
      throw error;
    }
  },
};

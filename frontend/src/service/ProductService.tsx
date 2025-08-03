import { api } from "../../api/axios";

interface Product {
  id: number;
  name: string;
  price: number;
  image?: string;
  stock: number;
}

export const ProductService = {
  async getAll() {
    try {
      const response = await api.get("/products");
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 403) {
        return "NotAdmin";
      }
      throw error;
    }
  },

  getById: async (id: number): Promise<Product> => {
    const response = await api.get(`/products/${id}`);
    return response.data;
  },

  create: async (product: Omit<Product, "id">): Promise<Product> => {
    const response = await api.post("/products", product);
    return response.data;
  },

  update: async (id: number, product: Partial<Product>): Promise<Product> => {
    const response = await api.put(`/products/${id}`, product);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/products/${id}`);
  },
};

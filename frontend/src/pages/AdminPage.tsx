import { useEffect, useRef, useState } from "react";
import { api } from "../../api/axios";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { form } from "framer-motion/client";
import { ProductService } from "../service/ProductService";
import { OrderService } from "../service/OrderService";

interface Product {
  id: number;
  name: string;
  price: number;
  image?: string;
  stock: number;
}

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

export default function AdminPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    stock: "",
    image: "",
  });
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleDelete = async (id: number) => {
    try {
      await ProductService.delete(id);
      setProducts(products.filter((p) => p.id !== id));
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  const [scrolled, setScrolled] = useState(false);
  const productRef = useRef<HTMLDivElement>(null);
  const orderRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const fetchProducts = async () => {
    try {
      const data = await ProductService.getAll();
      setProducts(data);
    } catch (err) {
      console.error("Error fetching products:", err);
      toast.error("Hiba a termékek betöltésekor");
    }
  };
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const data = await OrderService.getAll();
      console.log("Fetched orders:", data);
      setOrders(data);
      console.log("Orders state updated:", orders);
    } catch (err) {
      console.error("Error fetching orders:", err);
      toast.error("Hiba a rendelések betöltésekor");
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    fetchOrders();
  }, []);

  const scrollToProducts = () => {
    productRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  const scrollToOrders = () => {
    orderRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleLogout = async () => {
    try {
      await api.post("/logout", {}, { withCredentials: true });
      navigate("/login");
    } catch (err: any) {
      console.error("Logout failed:", err.response?.data || err.message);
    }
  };

  const openEditModal = (product: Product) => {
    {
      console.log("asd: " + product.image);
    }
    setEditingProduct(product);
    setFormData({
      name: product.name,
      price: product.price.toString(),
      stock: product.stock.toString(),
      image: product.image?.toString() || "",
    });
    setEditMode(true);
    setShowModal(true);
  };
  const openAddModal = () => {
    setFormData({
      name: "",
      price: "",
      stock: "",
      image: "",
    });
    setEditMode(false);
    setShowModal(true);
  };

  const saveProduct = async () => {
    console.log("img: " + formData.image);

    const productData = {
      name: formData.name,
      price: Number(formData.price),
      stock: Number(formData.stock),
      image: formData.image || undefined,
    };
    console.log("imggg: " + productData.image);

    try {
      if (editMode && editingProduct) {
        await ProductService.update(editingProduct.id, productData);
        toast.success("Sikeres szerkesztés");
      } else {
        await ProductService.create(productData);
        toast.success("Sikeres hozzáadás");
      }

      fetchProducts();
      setShowModal(false);
    } catch (err: any) {
      toast.error(
        "Hiba: " +
          (err.response?.data?.error || err.message || "Ismeretlen hiba")
      );
    }
  };

  return (
    <>
      <div className="font-poppins min-h-screen max-w-screen">
        <div
          className={`fixed top-0 left-0 w-full z-20 transition-all duration-400${
            scrolled
              ? " backdrop-blur-xs text-lorange"
              : "bg-transparent text-white"
          }`}
        >
          <div className="flex justify-between items-center lg:px-6 py-4  lg:scale-100 ">
            <h1 className="lg:text-2xl lg:font-extrabold text-lg font-bold lg:scale-100 scale-70">
              SnackShop
            </h1>
            <div className="flex gap-2 scale-70 lg:scale-100">
              <button
                onClick={scrollToProducts}
                className={`font-semibold px-4 py-1 rounded-full transition ${
                  scrolled
                    ? "bg-lorange text-white hover:bg-lorange/70 hover:border-dorange hover:border-px"
                    : "bg-white/90 text-lorange hover:bg-white"
                }`}
              >
                Termékek
              </button>
              <button
                onClick={scrollToOrders}
                className={`font-semibold px-4 py-1 rounded-full transition ${
                  scrolled
                    ? "bg-lorange text-white hover:bg-lorange/70 hover:border-dorange hover:border-px"
                    : "bg-white/90 text-lorange hover:bg-white"
                }`}
              >
                Rendelések
              </button>

              <button type="button" onClick={handleLogout}>
                <span
                  className={`material-symbols-outlined font-semibold px-4 py-1 rounded-full transition ${
                    scrolled
                      ? "bg-lorange text-white hover:bg-lorange/70 hover:border-dorange hover:border-px"
                      : "bg-white/90 text-lorange hover:bg-white"
                  }`}
                >
                  logout
                </span>
              </button>
            </div>
          </div>
        </div>
        <div
          ref={productRef}
          className="min-h-screen bg-gradient-to-br  from-cyan-800/30 via-lorange/30 to-cyan-800/30  lg:p-10 pt-20 align-middle  m-auto"
        >
          <h2 className="lg:text-5xl text-2xl font-bold text-center text-white lg:mb-10 mb-6 drop-shadow">
            Termékek
          </h2>
          <div className="grid lg:gap-6 lg:max-w-9xl md:gap-6 md:max-w-7xl items-center justify-center content-center place-items-center gap-4 max-w-sm container-sm align-middle justify-items-center m-auto">
            <div className="lg:max-w-8xl m-auto">
              <div className="flex justify-items-end justify-end mb-6">
                <button
                  onClick={openAddModal}
                  className="bg-lorange text-white text-sm lg:px-4 px-2 py-2 rounded-lg hover:bg-lorange/80 flex items-center float-right gap-2"
                >
                  <span className="material-symbols-outlined">add</span>
                  Új termék
                </button>
              </div>

              <div className="bg-white/80 rounded-xl lg:min-w-3xl shadow-lg backdrop-blur-sm overflow-hidden">
                <table className="min-w-full lg:divide-y text-xs lg:text-2xl divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="lg:px-6 lg:py-3 p-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Kép
                      </th>
                      <th className="lg:px-6 lg:py-3 p-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Név
                      </th>
                      <th className="lg:px-6 lg:py-3 p-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Ár
                      </th>
                      <th className="lg:px-6 lg:py-3 p-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Készlet
                      </th>
                      <th className="lg:px-6 lg:py-3 p-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Műveletek
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {products.map((product) => (
                      <motion.tr
                        key={product.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                        className="hover:bg-gray-50"
                      >
                        <td className="lg:px-6 lg:py-4 p-1 whitespace-nowrap">
                          <img
                            src={
                              product.image
                                ? `http://localhost:3000/assets/snacks/${product.image}`
                                : "http://localhost:3000/assets/snacks/snacklogo.png"
                            }
                            alt={product.name}
                            className="lg:h-10 lg:w-10 h-5 w-5 text-xs lg:text-xl object-contain"
                          />
                        </td>
                        <td className="lg:px-6 lg:py-4 p-1 whitespace-nowrap lg:text-sm text-gray-900">
                          {product.name}
                        </td>
                        <td className="lg:px-6 lg:py-4 p-1 whitespace-nowrap lg:text-sm text-gray-500">
                          {product.price} Ft
                        </td>
                        <td
                          className={`lg:px-6 lg:py-4 p-1 whitespace-nowrap lg:text-sm "text-gray-500"`}
                        >
                          {product.stock}
                        </td>
                        <td className="lg:px-6 lg:py-4 p-1 whitespace-nowrap lg:text-sm text-gray-500">
                          <div className="flex gap-6">
                            <button
                              onClick={() => openEditModal(product)}
                              className="text-lorange hover:text-lorange/70"
                            >
                              <span className="material-symbols-outlined">
                                edit
                              </span>
                            </button>
                            <button
                              onClick={() => handleDelete(product.id)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <span className="material-symbols-outlined">
                                delete
                              </span>
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        ref={orderRef}
        className="min-h-screen bg-gradient-to-bl from-cyan-800/30 via-lorange/30 to-cyan-800/30 lg:p-10 p-4 pt-20 "
      >
        <h2 className="text-2xl lg:text-5xl text-center text-white mb-10 lg:mt-10 drop-shadow">
          Rendelések
        </h2>

        <div className="max-w-3xl mx-auto space-y-4 max-h-xxs">
          {orders.map((order) => (
            <motion.div
              key={order.orderId}
              className="bg-white/80 rounded-xl shadow p-4 backdrop-blur-sm"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex justify-between font-semibold text-lorange mb-2">
                <span>
                  #{order.orderId} • {order.username}
                </span>
                <span>{new Date(order.createdAt).toLocaleString()}</span>
              </div>
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-16 gap-y-4 lg:gap-16">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex items-center lg:gap-4 gap-2">
                    <img
                      src={`http://localhost:3000/assets/snacks/${item.image}`}
                      alt={item.name}
                      className="w-16 h-16 rounded object-contain"
                    />
                    <div>
                      <h4 className="font-semibold">{item.name}</h4>
                      <p className="text-sm text-gray-700">
                        {item.quantity} × {item.price} Ft
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-2 text-right text-lg font-bold text-lorange">
                Összesen: {order.totalPrice} Ft
              </div>
            </motion.div>
          ))}
        </div>
        {showModal && (
          <div
            className="fixed inset-0 bg-black/70 bg-opacity-50 flex justify-center items-center z-50"
            onClick={() => setShowModal(false)}
          >
            <div
              className="bg-white p-6 rounded-lg max-w-md lg:w-full w-[90%]"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-bold mb-4 text-lorange">
                {editMode ? "Termék szerkesztése" : "Új termék hozzáadása"}
              </h3>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  saveProduct();
                  console.log(editMode);
                  console.log(editingProduct?.id);
                  console.log("kuk: " + formData.image);
                }}
              >
                <input
                  type="text"
                  name="name"
                  placeholder="Név"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="block w-full p-2 mb-2 border rounded"
                />
                <input
                  type="number"
                  name="price"
                  placeholder="Ár"
                  value={formData.price}
                  onChange={handleInputChange}
                  required
                  min={0}
                  className="block w-full p-2 mb-2 border rounded"
                />
                <input
                  type="number"
                  name="stock"
                  placeholder="Készlet"
                  value={formData.stock}
                  onChange={handleInputChange}
                  required
                  className="block w-full p-2 mb-2 border rounded"
                />
                <input
                  type="text"
                  name="image"
                  placeholder="Kép elérési útja (example.png)"
                  value={formData.image}
                  onChange={handleInputChange}
                  className="block w-full p-2 mb-2 border rounded"
                />
                {""}
                <button
                  type="submit"
                  className="bg-lorange text-white px-4 py-2 rounded hover:bg-lorange/80"
                >
                  {editMode ? "Mentés" : "Hozzáadás"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="ml-2 px-4 py-2 rounded border"
                >
                  Mégse
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

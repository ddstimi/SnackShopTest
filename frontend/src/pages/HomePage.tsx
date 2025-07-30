import { useEffect, useRef, useState } from 'react';
import { api } from '../../api/axios';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

interface Product {
  id: number;
  name: string;
  price: number;
  image?: string;
}

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [scrolled, setScrolled] = useState(false);
  const productRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();


  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await api.get('/products');
        setProducts(res.data);
      } catch (err) {
        console.error('Error during fetching products:', err);
      }
    };
    fetchProducts();
  }, []);

  const scrollToProducts = () => {
    productRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleLogout = async () => {
    try {
        await api.post('/logout', {}, { withCredentials: true });
        navigate("/login");
    } catch (err: any) {
      console.error('Logout failed:', err.response?.data || err.message);
    }
  };

  return (
    <div className="font-poppins">
      <div
        className={`fixed top-0 left-0 w-full z-20 transition-all duration-400${
          scrolled ?  ' backdrop-blur-xs text-lorange': 'bg-transparent text-white'
        }`}
      >
        <div className="flex justify-between items-center lg:px-6 py-4  lg:scale-100 ">
          <h1 className="lg:text-2xl lg:font-extrabold text-lg font-bold lg:scale-100 scale-70">SnackShop</h1>
          <div className="flex gap-2 scale-70 lg:scale-100">
            <button
              onClick={scrollToProducts}
              className={`font-semibold px-4 py-1 rounded-full transition ${
                scrolled ? 'bg-lorange text-white hover:bg-lorange/70 hover:border-dorange hover:border-px' : 'bg-white/90 text-lorange hover:bg-white'
              }`}
            >
              Rendelés
            </button>
            <button>
              <span
                className={`material-symbols-outlined font-semibold px-4 py-1 rounded-full transition ${
                  scrolled ? 'bg-lorange text-white hover:bg-lorange/70 hover:border-dorange hover:border-px' : 'bg-white/90 text-lorange hover:bg-white'
                }`}
              >
                shopping_cart
              </span>
            </button>
            <button type='button' onClick={handleLogout}>
              <span
                className={`material-symbols-outlined font-semibold px-4 py-1 rounded-full transition ${
                  scrolled ? 'bg-lorange text-white hover:bg-lorange/70 hover:border-dorange hover:border-px' : 'bg-white/90 text-lorange hover:bg-white'
                }`}
              >
                logout
              </span>
            </button>
          </div>
        </div>
      </div>

      <div className="lg:h-screen h-[calc(100vh-15rem)] relative bg-[url('./assets/home-sweets.jpg')] bg-cover bg-center pt-19">
        <div className="absolute inset-0 bg-black/40 z-0" />
        <div className="relative z-10 flex flex-col justify-end h-full p-6">
          <div className="text-white text-center mb-16 md:mb-24">
            <h2 className="text-4xl md:text-6xl font-bold drop-shadow-lg">Világi ízek egy helyen</h2>
            <p className="text-lg mt-4 drop-shadow-md">
              Böngéssz a leghíresebb termékek között és válaszd ki, amelyik a legharapnivalóbb számodra!
            </p>
          </div>
        </div>
      </div>

      <div
        ref={productRef}
        className="min-h-screen bg-gradient-to-bl from-cyan-800/30 to-lorange/60 p-10 pt-20 align-middle  m-auto"
      >
        <h2 className="lg:text-5xl text-2xl font-bold text-center text-white lg:mb-10 mb-6 drop-shadow">
          Termékeink
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 lg:gap-6 lg:max-w-7xl md:gap-6 md:max-w-7xl items-center  justify-center content-center place-items-center gap-4 max-w-sm container-sm  mx-auto">
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              className="bg-white/70 rounded-xl shadow-lg backdrop-blur-sm overflow-hidden lg:hover:scale-102 transition-transform duration-300 p-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <img
                  src={`http://localhost:3000/assets${product.image}` || 'https://via.placeholder.com/300x200.png?text=Snack'}
                alt={product.name}
                className="lg:w-[10rem] lg:h-[10rem] w-[8rem] h-[8rem] object-cover align-middle m-auto"
              />
              <div className="lg:p-4 p-2">
                <h3 className="text-xl font-semibold">{product.name}</h3>

                <div className="mt-4 flex justify-between items-center gap-3">
                  <span className="text-lg font-bold text-lorange w-fit">
                    {product.price} Ft
                  </span>
                  <button className="bg-lorange/90 text-white lg:font-semibold px-2 py-1 rounded-full hover:bg-lorange transition">
                    Kosárba
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

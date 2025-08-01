import { useEffect, useRef, useState } from 'react';
import { api } from '../../api/axios';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

interface Product {
  id: number;
  name: string;
  price: number;
  image?: string;
  stock: number;
}

interface CartItem extends Product {
  quantity: number;
}


export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [scrolled, setScrolled] = useState(false);
  const productRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const [cartVisible, setCartVisible] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);



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

  const toggleCart = () => setCartVisible(prev => !prev);

const addToCart = (product: Product) => {
  setCartItems(prevItems => {
    const existing = prevItems.find(item => item.id === product.id);
    if (existing) {
      if (existing.quantity >= product.stock) {
        toast.warning('Nincs több elérhető ebből a termékből!');
        return prevItems;
      }
      return prevItems.map(item =>
        item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
      );
    } else {
      if (product.stock < 1) {
        toast.warning('Ez a termék elfogyott!');
        return prevItems;
      }
      return [...prevItems, { ...product, quantity: 1 }];
    }
  });
};


const changeQuantity = (id: number, delta: number) => {
  setCartItems(prevItems =>
    prevItems
      .map(item =>
        item.id === id ? { ...item, quantity: item.quantity + delta } : item
      )
      .filter(item => item.quantity > 0)
  );
};

const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);


const handlePurchase = async () => {
  try {
    const res = await api.post(
      '/order',
      { cart: cartItems },
      { withCredentials: true }
    );
    toast.success('Sikeres vásárlás!');
    setCartItems([]);
    setCartVisible(false);
  } catch (err: any) {
    console.error('Full error response:', err.response);
    const errorMessage = err.response?.data?.error || 'Ismeretlen hiba történt';
    toast.error(<><div className='grid grid-cols-1'><strong className=''>Hiba történt</strong><div className=''>{errorMessage}</div></div></>)
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
            <button type='button' onClick={toggleCart}>
  <span
    className={`material-symbols-outlined font-semibold px-4 py-1 rounded-full transition relative inline-flex items-center p-3 text-sm text-center ${
      scrolled ? 'bg-cyan-800 text-white hover:bg-cyan-800/50 hover:border-cyan-800 hover:border-px' : 'bg-white/90 text-cyan-800 hover:bg-white'
    }`}
  >
    shopping_cart
  </span>
<div className={`absolute inline-flex items-center justify-center w-5 h-5 text-xs font-bold  ${scrolled ? 'bg-white text-lorange hover:bg-white' :  'bg-lorange text-white hover:bg-lorange/70 hover:border-dorange hover:border-px'} rounded-full -top-2 right-16`}>
  {cartItems.length}
</div>
</button>

            {cartVisible && (
  <div className="absolute right-0 top-10 w-80 bg-white rounded-xl shadow-xl p-4 z-50">
    <h3 className="text-lg font-bold mb-2 text-cyan-800">Kosár</h3>
    {cartItems.length === 0 ? (
        <div className="space-y-3">
      <p className="text-gray-500">A kosár üres.</p>
      <div className=" pt-2 flex justify-between font-semibold">
          <span className='text-cyan-900'>Összesen:</span>
          <span className='text-cyan-900'>{total} Ft</span>
        </div>
        <button onClick={() => setCartItems([])} className="w-full bg-gray-200 text-gray-800 py-2 rounded hover:bg-gray-300 transition disabled:opacity-50" disabled>
            Kosár ürítése
        </button>

        <button className="w-full bg-lorange text-white py-2 rounded hover:bg-lorange/80 transition disabled:opacity-50" disabled>
          Vásárlás
        </button>
      </div>
    ) : (
      <div className="space-y-3">
        {cartItems.map(item => (
          <div key={item.id} className="flex justify-between items-center border-b-1 py-1 border-gray-100">
            <span className='text-dorange/80'>{item.name}</span>
            <span className='text-cyan-900'>{item.price} Ft</span>

            <div className="flex items-center gap-1">
              <button onClick={() => changeQuantity(item.id, -1)} className="px-2 py-0 bg-gray-200 rounded">-</button>
              <input
                type="number"
                value={item.quantity}
                readOnly
                className="w-10 text-center border border-gray-300 rounded text-gray-800"
              />
              <button onClick={() => changeQuantity(item.id, 1)} className="px-2 py-0 bg-gray-200 rounded">+</button>
            </div>
            <button onClick={() => setCartItems(prev => prev.filter(p => p.id !== item.id))} className="text-lorange/80 hover:text-dorange">✕</button>

          </div>
        ))}
        <div className=" pt-2 flex justify-between font-semibold">
          <span className='text-cyan-900'>Összesen:</span>
          <span className='text-cyan-900'>{total} Ft</span>
        </div>
        <button onClick={() => setCartItems([])} className="w-full bg-gray-200 text-gray-800 py-2 rounded hover:bg-gray-300 transition">
            Kosár ürítése
        </button>

        <button className="w-full bg-lorange text-white py-2 rounded hover:bg-lorange/80 transition" onClick={handlePurchase}>
          Vásárlás
        </button>
      </div>
    )}
  </div>
)}

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

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 lg:gap-6 lg:max-w-7xl md:gap-6 md:max-w-7xl items-center  justify-center content-center place-items-center gap-4 max-w-sm container-sm  mx-auto">
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              className="bg-white/70 rounded-xl shadow-lg backdrop-blur-sm overflow-hidden lg:hover:scale-102 transition-transform duration-300 p-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <img
                  src={`http://localhost:3000/assets/snacks/${product.image}` || 'https://via.placeholder.com/300x200.png?text=Snack'}
                alt={product.name}
                className="lg:w-[10rem] lg:h-[10rem] w-[8rem] h-[8rem] object-contain align-middle m-auto"
              />
              <div className="lg:p-4 p-2">
                <h3 className="text-xl font-semibold">{product.name}</h3>

                <div className="mt-4 flex justify-between items-center gap-3">
                  <span className="text-lg font-bold text-lorange w-fit">
                    {product.price} Ft
                  </span>
                  <button type='button'
  onClick={() => addToCart(product)}
  className="bg-lorange/90 text-white lg:font-semibold px-2 py-1 rounded-full hover:bg-lorange transition"
>
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

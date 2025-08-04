import { useState } from "react";
import { api } from "../../api/axios";
import { useNavigate } from "react-router-dom";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [registerError, setRegisterError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!username || !password) {
      setLoginError("Felhasználónév és jelszó mező kitöltése kötelező.");
      return;
    }

    try {
      const res = await api.post("/login", { username, password });
      // console.log("Login success:", res.data);
      setLoginError("");
      setUsername("");
      setPassword("");
      if (username === "admin") {
        navigate("/admin");
      } else {
        navigate("/home");
      }
    } catch (err: any) {
      console.error("Login failed:", err.response?.data || err.message);
      setLoginError(
        err.response?.data?.error ||
          (err.response?.data?.authenticated === false
            ? "Érvénytelen felhasználónév vagy jelszó."
            : "Hiba történt a bejelentkezés során.")
      );
    }
  };

  const handleRegister = async () => {
    if (!username || !password) {
      setRegisterError("Felhasználónév és jelszó mező kitöltése kötelező.");
      return;
    }

    try {
      const res = await api.post("/register", { username, password });
      console.log("Register success:", res.data);
      setRegisterError("");
      setIsLogin(true);
    } catch (err: any) {
      console.error("Register failed:", err.response?.data || err.message);
      setRegisterError(
        err.response?.data?.error || "Hiba történt a regisztráció során."
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-bl from-cyan-800/30 to-lorange/60 font-poppins">
      <div className="relative w-[60rem] h-[32rem] lg:rounded-xl rounded-lg lg:shadow-xl overflow-hidden lg:bg-white/20 backdrop-blur m-2 lg:m-0">
        <div className="absolute lg:inset-0 lg:bg-[url('./assets/fast-food.jpg')] lg:bg-cover lg:filter lg:blur-xs lg:scale-110 lg:opacity-80 h-full" />

        <div className="relative w-full lg:h-full h-[80%] overflow-hidden">
          <div
            className={`absolute top-0 left-0 h-full w-[200%] flex transition-transform duration-700 ease-in-out ${
              isLogin ? "translate-x-0" : "-translate-x-1/2"
            }`}
          >
            <div className="w-1/2 flex flex-col lg:flex-row">
              <div className="w-1/2 hidden lg:flex items-center justify-center text-white text-center p-6">
                <div>
                  <h1 className="text-4xl font-extrabold mb-2">Üdv újra!</h1>
                  <p className="mb-10">
                    Még nincs fiókod? Csatlakozz és kóstolj bele a
                    lehetőségekbe!
                  </p>
                  <button
                    onClick={() => setIsLogin(false)}
                    className="px-16 py-2 border border-white rounded-lg hover:bg-white/40 bg-white/20 transition"
                  >
                    Regisztráció
                  </button>
                </div>
              </div>

              <div className="w-full lg:w-1/2 flex items-center justify-center bg-white/80 p-8 z-10 gap-9">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleLogin();
                  }}
                  className="w-full max-w-sm lg:space-y-6 space-y-2"
                >
                  <h2 className="text-2xl font-bold">Bejelentkezés</h2>
                  <input
                    type="text"
                    required
                    placeholder="Felhasználónév"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full p-2 border rounded"
                  />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Jelszó"
                    className="w-full p-2 border rounded"
                  />
                  <button
                    type="submit"
                    className="w-full border-dorange border-1 font-bold  rounded-lg text-white hover:bg-lorange/80 bg-lorange/100 p-2 mt-2 transform"
                  >
                    Bejelentkezés
                  </button>
                  {loginError && <p className="text-red-400">{loginError}</p>}
                  <div className="lg:invisible md:invisible visible flex flex-row flex-1 justify-center flex-wrap">
                    <div className="flex items-center justify-center w-full gap-2">
                      <hr className="flex-grow h-px bg-gradient-to-r from-gray-400 to-gray-200 border-0" />
                      <p className="text-gray-500 text-sm">vagy</p>
                      <hr className="flex-grow h-px bg-gradient-to-r from-gray-200 to-gray-400 border-0" />
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsLogin(false)}
                      className="px-10 py-2 border border-gray-400 rounded-lg hover:bg-gray-600/30 bg-gray-400/10 transition mt-4"
                    >
                      Regisztráció
                    </button>
                  </div>
                </form>
              </div>
            </div>

            <div className="w-1/2 flex flex-col lg:flex-row">
              <div className="w-full lg:w-1/2 flex items-center justify-center bg-white/80 p-8 z-10 gap-6">
                <form
                  className="w-full max-w-sm lg:space-y-6 space-y-2"
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleRegister();
                  }}
                >
                  <h2 className="text-2xl font-bold">Regisztráció</h2>
                  <input
                    type="text"
                    placeholder="Felhasználónév"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full p-2 border rounded"
                  />
                  <input
                    type="password"
                    placeholder="Jelszó"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-2 border rounded"
                  />
                  <button
                    type="submit"
                    className="w-full border-dorange border-1 font-bold  rounded-lg text-white hover:bg-lorange/80 bg-lorange/100 p-2 mt-2 transform"
                  >
                    Regisztráció
                  </button>
                  {registerError && (
                    <p className="text-red-400">{registerError}</p>
                  )}
                  <div className="lg:invisible md:invisible visible flex flex-row flex-1 justify-center flex-wrap">
                    <div className="flex items-center justify-center w-full gap-2 ">
                      <hr className="flex-grow h-px bg-gradient-to-r from-gray-400 to-gray-200 border-0" />
                      <p className="text-gray-500 text-sm">vagy</p>
                      <hr className="flex-grow h-px bg-gradient-to-r from-gray-200 to-gray-400 border-0" />
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsLogin(true)}
                      className="px-10 py-2 border relative align-middle border-gray-400 rounded-lg hover:bg-gray-600/30 bg-gray-400/10 transition mt-4"
                    >
                      Bejelentkezés
                    </button>
                  </div>
                </form>
              </div>
              <div className="w-1/2 hidden lg:flex items-center justify-center text-white text-center p-6">
                <div>
                  <h1 className="text-4xl font-extrabold mb-2">
                    Ízleld meg a világot!
                  </h1>
                  <p className="mb-10">
                    Már van fiókod? Kattints a bejelentkezéshez.
                  </p>
                  <button
                    type="button"
                    onClick={() => setIsLogin(true)}
                    className="px-16 py-2 border border-white rounded-lg hover:bg-white/40 bg-white/20 transition"
                  >
                    Bejelentkezés
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

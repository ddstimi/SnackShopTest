# SnackShop - Full-Stack 
 Full-stack webalkalmazást, ahol felhasználók snackeket tudnak rendelni, az admin pedig
kezelheti a termékeket, árakat, készletet, látja a rendeléseket
- Fejlesztési idő: 7 munkanap
- Fejlesztői környezet: Visual Studio Code
## Technológiák
  ### Backend
  - Node.js
  - Fastify
  - bycrpt
  - SQLite adatbázis
  - Hitelesítés: Fastify Cookie
  - Jogosultságok: Cookie + unique admin felhasználó
  ### Frontend
  - React (Vite)
  - Axios
  - Tailwind CSS
## Funkciók
  ### Felhasználó
  - Regisztráció/Bejelentkezés
  - Terméklista
  - Rendelés leadása
  - Kosár ürítése
  - Kosár szerkesztése
  - Kijelentkezés
  ### Admin
  - Bejelentkezés
  - Terméklista
  - Rendeléslista
  - Termékkezelés (CRUD)<sup>(Termékekhez teszt jelleggel előre feltöltött képek is rendelhetők a backend/assets/snack mappából(pl: bueno.png, cola.png, snickers.png,...))</sup>
  - Kijelentkezés
## .env változók
```
ADMINPASSWORD=SnackBoss2025
COOKIE_SECRET=kmcfrqT957WgPuRqdBy2uEYPch1Jb3Qb
DB_PATH=./db/snackshop.db
```
## Admin adatok
- Felhasználónév: admin
- Jelszó: SnackBoss2025
## Futtatás
  Backend
  ```
  cd backend
  npm install
  npm run init-db
  npm run dev
  ```
  
  Frontend
  ```
  cd frontend
  npm install
  npm run dev
  ```

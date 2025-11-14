# 📦 Instalacja Zależności - Instrukcje

## 🎯 Cel

Ten dokument opisuje jak zainstalować wszystkie wymagane zależności dla projektu FocusForest.

## ⚡ Szybka Instalacja (Wszystko na raz)

W głównym katalogu projektu:

```powershell
npm run install:all
```

To zainstaluje zależności zarówno dla backendu jak i frontendu.

---

## 📦 Backend Dependencies

### Instalacja

```powershell
cd backend
npm install
```

### Główne Zależności

#### Production Dependencies
```json
{
  "express": "^4.18.2",          // Web framework
  "cors": "^2.8.5",              // CORS middleware
  "dotenv": "^16.3.1",           // Environment variables
  "bcrypt": "^5.1.1",            // Password hashing
  "jsonwebtoken": "^9.0.2",      // JWT authentication
  "pg": "^8.11.3",               // PostgreSQL client
  "typeorm": "^0.3.17",          // ORM
  "reflect-metadata": "^0.1.13", // TypeORM requirement
  "express-validator": "^7.0.1", // Input validation
  "helmet": "^7.1.0",            // Security headers
  "express-rate-limit": "^7.1.5", // Rate limiting
  "morgan": "^1.10.0"            // HTTP logger
}
```

#### Dev Dependencies
```json
{
  "@types/express": "^4.17.21",
  "@types/node": "^20.10.5",
  "@types/cors": "^2.8.17",
  "@types/bcrypt": "^5.0.2",
  "@types/jsonwebtoken": "^9.0.5",
  "@types/morgan": "^1.9.9",
  "typescript": "^5.3.3",
  "nodemon": "^3.0.2",
  "ts-node": "^10.9.2"
}
```

### Scripts

```powershell
# Development mode
npm run dev

# Build TypeScript
npm run build

# Production mode
npm start

# TypeORM commands
npm run typeorm migration:generate -- -n MigrationName
npm run typeorm migration:run
```

---

## 🎨 Frontend Dependencies

### Instalacja

```powershell
cd frontend
npm install
```

### Główne Zależności

#### Production Dependencies
```json
{
  "react": "^18.2.0",              // UI Library
  "react-dom": "^18.2.0",          // React DOM
  "react-router-dom": "^6.20.1",   // Routing
  "axios": "^1.6.2",               // HTTP client
  "zustand": "^4.4.7",             // State management
  "framer-motion": "^10.16.16",    // Animations
  "recharts": "^2.10.3",           // Charts
  "lucide-react": "^0.294.0",      // Icons
  "react-hot-toast": "^2.4.1",     // Notifications
  "date-fns": "^3.0.6"             // Date utilities
}
```

#### Dev Dependencies
```json
{
  "@types/react": "^18.2.43",
  "@types/react-dom": "^18.2.17",
  "@typescript-eslint/eslint-plugin": "^6.14.0",
  "@typescript-eslint/parser": "^6.14.0",
  "@vitejs/plugin-react": "^4.2.1",
  "autoprefixer": "^10.4.16",
  "eslint": "^8.55.0",
  "eslint-plugin-react-hooks": "^4.6.0",
  "eslint-plugin-react-refresh": "^0.4.5",
  "postcss": "^8.4.32",
  "tailwindcss": "^3.3.6",
  "typescript": "^5.2.2",
  "vite": "^5.0.8"
}
```

### Scripts

```powershell
# Development mode
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

---

## 🐳 Docker (Bez instalacji Node modules)

Jeśli używasz Docker, zależności są instalowane automatycznie:

```powershell
docker-compose up -d
```

Docker użyje plików `package.json` i zainstaluje wszystko wewnątrz kontenera.

---

## 🔧 Troubleshooting

### Problem: npm install fails

**Rozwiązanie:**
```powershell
# Wyczyść cache
npm cache clean --force

# Usuń node_modules i package-lock.json
Remove-Item -Recurse -Force node_modules
Remove-Item package-lock.json

# Zainstaluj ponownie
npm install
```

### Problem: "Cannot find module"

**Rozwiązanie:**
```powershell
# Upewnij się że jesteś w odpowiednim katalogu
cd backend  # lub frontend

# Reinstaluj zależności
npm install
```

### Problem: TypeScript errors

**Rozwiązanie:**
```powershell
# Zainstaluj typy
npm install --save-dev @types/node @types/express

# Restart TypeScript server w VS Code
# Ctrl+Shift+P -> "TypeScript: Restart TS Server"
```

### Problem: bcrypt installation error

**Rozwiązanie (Windows):**
```powershell
# Zainstaluj build tools
npm install --global windows-build-tools

# Potem zainstaluj ponownie bcrypt
npm install bcrypt
```

---

## 📊 Rozmiary Dependencies

### Backend
- **node_modules**: ~150 MB
- **Production dependencies**: ~50 MB
- **Dev dependencies**: ~100 MB

### Frontend
- **node_modules**: ~400 MB
- **Production dependencies**: ~200 MB
- **Dev dependencies**: ~200 MB

---

## ⚙️ Konfiguracja po instalacji

### Backend

1. Skopiuj `.env.example` do `.env`:
```powershell
cp .env.example .env
```

2. Edytuj `.env` z własnymi wartościami:
```env
DB_HOST=localhost
DB_PASSWORD=your_password
JWT_SECRET=your_secret_key
```

### Frontend

1. Skopiuj `.env.example` do `.env`:
```powershell
cp .env.example .env
```

2. Ustaw URL backendu:
```env
VITE_API_URL=http://localhost:3000
```

---

## ✅ Weryfikacja Instalacji

### Backend

```powershell
cd backend
npm run dev
```

Powinno wyświetlić:
```
🚀 Server running on port 3000
📊 Environment: development
🌐 CORS enabled for: http://localhost:5173
```

### Frontend

```powershell
cd frontend
npm run dev
```

Powinno wyświetlić:
```
VITE v5.0.8  ready in 500 ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
```

---

## 🔄 Aktualizacja Dependencies

### Sprawdź outdated packages

```powershell
npm outdated
```

### Aktualizuj wszystkie

```powershell
npm update
```

### Aktualizuj konkretny package

```powershell
npm install package-name@latest
```

---

## 📝 Dodawanie Nowych Dependencies

### Production dependency

```powershell
npm install package-name
```

### Dev dependency

```powershell
npm install --save-dev package-name
```

### Przykład - dodanie nowej biblioteki

```powershell
# Frontend - dodaj lodash
cd frontend
npm install lodash
npm install --save-dev @types/lodash

# Backend - dodaj uuid
cd backend
npm install uuid
npm install --save-dev @types/uuid
```

---

## 🎓 Best Practices

1. **Zawsze commituj `package-lock.json`** - zapewnia jednakowe wersje
2. **Używaj konkretnych wersji** - unikaj `^` i `~` w produkcji
3. **Regularnie aktualizuj** - security patches
4. **Sprawdzaj licencje** - przed dodaniem dependencies
5. **Monitoruj rozmiar** - unikaj niepotrzebnych dużych bibliotek

---

## 📚 Dodatkowe Zasoby

- [npm Documentation](https://docs.npmjs.com/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [React Documentation](https://react.dev/)
- [Express Guide](https://expressjs.com/en/guide/routing.html)

---

**Wszystko zainstalowane? Przejdź do [QUICKSTART.md](QUICKSTART.md)!** 🚀

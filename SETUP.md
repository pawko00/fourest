# 🚀 FocusForest - Setup & Installation Guide

## 📋 Wymagania

Przed rozpoczęciem upewnij się, że masz zainstalowane:

- **Node.js** 18 lub nowszy
- **PostgreSQL** 14 lub nowszy (lub Docker)
- **Git**
- **Docker** i **Docker Compose** (opcjonalnie, ale zalecane)

## 🎯 Szybki Start z Docker (Zalecane)

### 1. Klonowanie projektu

```powershell
cd c:\Users\Pawkuix\Documents\ProjektowanieUniwersalne
```

### 2. Uruchomienie z Docker Compose

```powershell
docker-compose up -d
```

To polecenie:
- Uruchomi PostgreSQL na porcie 5432
- Uruchomi backend API na porcie 3000
- Uruchomi frontend na porcie 5173

### 3. Dostęp do aplikacji

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3000
- **Health Check**: http://localhost:3000/health

### 4. Zatrzymanie aplikacji

```powershell
docker-compose down
```

## 💻 Uruchomienie Lokalne (Bez Dockera)

### Backend

#### 1. Instalacja zależności

```powershell
cd backend
npm install
```

#### 2. Konfiguracja zmiennych środowiskowych

```powershell
cp .env.example .env
```

Edytuj plik `.env` i dostosuj wartości (szczególnie dane dostępowe do PostgreSQL):

```env
NODE_ENV=development
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=focusforest
DB_PASSWORD=focusforest123
DB_DATABASE=focusforest
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=7d
CORS_ORIGIN=http://localhost:5173
```

#### 3. Utworzenie bazy danych

Zaloguj się do PostgreSQL i utwórz bazę danych:

```sql
CREATE DATABASE focusforest;
CREATE USER focusforest WITH PASSWORD 'focusforest123';
GRANT ALL PRIVILEGES ON DATABASE focusforest TO focusforest;
```

#### 4. Uruchomienie backendu

```powershell
npm run dev
```

Backend będzie dostępny na: http://localhost:3000

### Frontend

#### 1. Instalacja zależności

```powershell
cd frontend
npm install
```

#### 2. Konfiguracja zmiennych środowiskowych

```powershell
cp .env.example .env
```

Edytuj plik `.env`:

```env
VITE_API_URL=http://localhost:3000
```

#### 3. Uruchomienie frontendu

```powershell
npm run dev
```

Frontend będzie dostępny na: http://localhost:5173

## 🎨 Pierwsze Uruchomienie

### 1. Utwórz konto

- Przejdź do http://localhost:5173/register
- Wypełnij formularz rejestracji
- Zostaniesz automatycznie zalogowany

### 2. Rozpocznij sesję skupienia

- Kliknij "Start Focus Session" na Dashboard
- Wybierz czas trwania (15, 25, 45 lub 60 minut)
- Kliknij "Start Focus Session"
- Obserwuj jak Twoje drzewo rośnie!

### 3. Sprawdź statystyki

- Przejdź do zakładki "Statistics"
- Zobacz swoje postępy tygodniowe i miesięczne
- Śledź swój streak!

## 🐳 Deployment do Kubernetes

### 1. Build obrazów Docker

```powershell
# Backend
cd backend
docker build -t focusforest-backend:latest .

# Frontend
cd ../frontend
docker build -t focusforest-frontend:latest .
```

### 2. Deploy do Kubernetes

```powershell
cd ..
kubectl apply -f k8s/postgres.yaml
kubectl apply -f k8s/backend.yaml
kubectl apply -f k8s/frontend.yaml
```

### 3. Sprawdzenie statusu

```powershell
kubectl get pods
kubectl get services
```

### 4. Dostęp do aplikacji

```powershell
# Pobierz external IP dla frontend service
kubectl get service frontend
```

## 🔧 Troubleshooting

### Problem: Backend nie może połączyć się z bazą danych

**Rozwiązanie:**
1. Sprawdź czy PostgreSQL działa: `docker ps` lub sprawdź lokalną instalację
2. Zweryfikuj dane dostępowe w pliku `.env`
3. Sprawdź logi backendu: `docker-compose logs backend`

### Problem: CORS errors w przeglądarce

**Rozwiązanie:**
1. Upewnij się, że `CORS_ORIGIN` w backendzie jest ustawione na `http://localhost:5173`
2. Zrestartuj backend po zmianie zmiennych środowiskowych

### Problem: TypeScript errors w VS Code

**Rozwiązanie:**
1. Zainstaluj zależności: `npm install` w folderach backend i frontend
2. Zrestartuj TypeScript server: `Ctrl+Shift+P` → "TypeScript: Restart TS Server"

### Problem: Port jest już zajęty

**Rozwiązanie (PowerShell):**
```powershell
# Znajdź proces na porcie 3000
netstat -ano | findstr :3000

# Zakończ proces (zamień PID na rzeczywisty)
taskkill /PID <PID> /F
```

## 📊 Struktura Projektu

```
ProjektowanieUniwersalne/
├── backend/                 # Node.js + Express + TypeScript
│   ├── src/
│   │   ├── controllers/    # Kontrolery API
│   │   ├── entities/       # Modele TypeORM
│   │   ├── middleware/     # Middleware (auth, errors)
│   │   ├── routes/         # Endpointy API
│   │   ├── utils/          # Funkcje pomocnicze
│   │   ├── data-source.ts  # Konfiguracja bazy danych
│   │   └── server.ts       # Entry point
│   ├── package.json
│   ├── tsconfig.json
│   └── Dockerfile
│
├── frontend/               # React + TypeScript + Vite
│   ├── src/
│   │   ├── components/    # Komponenty UI
│   │   ├── pages/         # Strony aplikacji
│   │   ├── store/         # Zustand store
│   │   ├── lib/           # API client
│   │   ├── types/         # TypeScript types
│   │   └── App.tsx        # Główny komponent
│   ├── package.json
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   └── Dockerfile
│
├── k8s/                    # Kubernetes manifests
│   ├── postgres.yaml
│   ├── backend.yaml
│   └── frontend.yaml
│
├── docker-compose.yml      # Docker Compose config
└── README.md               # Dokumentacja
```

## 🎓 Testowe Konta

Możesz utworzyć testowe konto podczas rejestracji lub użyć:

**Email:** test@focusforest.com  
**Username:** testuser  
**Password:** test123

(Po pierwszym uruchomieniu musisz je utworzyć przez formularz rejestracji)

## 🌟 Funkcjonalności

### ✅ Zaimplementowane

- [x] Rejestracja i logowanie użytkowników
- [x] JWT authentication
- [x] Tworzenie sesji skupienia (15, 25, 45, 60 min)
- [x] Wizualizacja rosnącego drzewa w czasie rzeczywistym
- [x] Timer z możliwością pauzy
- [x] Dashboard z podsumowaniem
- [x] Statystyki (tygodniowe i miesięczne)
- [x] Wykresy postępów
- [x] System streakóbw
- [x] Profil użytkownika
- [x] Zmiana hasła
- [x] Dark/Light mode
- [x] Responsive design
- [x] PostgreSQL database
- [x] Docker support
- [x] Kubernetes ready

### 🎯 Możliwe rozszerzenia

- [ ] Ambient sounds (dźwięki natury)
- [ ] Różne gatunki drzew do odblokowania
- [ ] System osiągnięć (achievements)
- [ ] Eksport danych do CSV
- [ ] Social features (leaderboards)
- [ ] Mobile app (React Native)
- [ ] Powiadomienia push
- [ ] Integration z kalendarzem

## 📚 API Endpoints

### Authentication
- `POST /api/auth/register` - Rejestracja nowego użytkownika
- `POST /api/auth/login` - Logowanie
- `GET /api/auth/me` - Pobierz dane zalogowanego użytkownika

### Sessions
- `POST /api/sessions` - Rozpocznij nową sesję
- `PUT /api/sessions/:id/complete` - Zakończ sesję
- `GET /api/sessions` - Lista wszystkich sesji
- `DELETE /api/sessions/:id` - Usuń sesję

### Statistics
- `GET /api/stats` - Ogólne statystyki
- `GET /api/stats/weekly` - Statystyki tygodniowe
- `GET /api/stats/monthly` - Statystyki miesięczne

### User
- `GET /api/user/profile` - Pobierz profil
- `PUT /api/user/profile` - Aktualizuj profil
- `PUT /api/user/password` - Zmień hasło

## 🔒 Bezpieczeństwo

- Hasła hashowane z bcrypt (10 salt rounds)
- JWT tokens z expiracją (7 dni)
- CORS protection
- Rate limiting (100 requestów/15 min)
- Helmet.js security headers
- SQL injection protection (TypeORM)
- Input validation (express-validator)

## 📞 Wsparcie

W razie problemów:
1. Sprawdź sekcję Troubleshooting powyżej
2. Sprawdź logi: `docker-compose logs`
3. Sprawdź issues w projekcie

---

Miłego korzystania z FocusForest! 🌳✨

# 🌳 FocusForest - Focus Management Application

Aplikacja do zarządzania czasem i koncentracją, inspirowana aplikacją Forest. Sadź cyfrowe drzewa podczas sesji skupienia i buduj swój własny las produktywności!

## 🎯 Funkcjonalności

- **Autentykacja użytkowników** - bezpieczne logowanie i rejestracja z JWT
- **Sesje skupienia** - timer z wizualizacją rosnącego drzewa
- **Statystyki** - szczegółowe raporty produktywności
- **Profil użytkownika** - personalizacja i zarządzanie kontem
- **Gamifikacja** - odblokowywanie nowych gatunków drzew
- **Streaki** - motywacja do codziennej pracy
- **Ambient sounds** - odgłosy natury podczas sesji

## 🏗️ Architektura

```
┌─────────────────┐      ┌─────────────────┐      ┌─────────────────┐
│                 │      │                 │      │                 │
│    Frontend     │◄────►│     Backend     │◄────►│   PostgreSQL    │
│  React + TS     │      │  Express + TS   │      │    Database     │
│                 │      │                 │      │                 │
└─────────────────┘      └─────────────────┘      └─────────────────┘
```

## 🚀 Stack Technologiczny

### Frontend
- React 18 + TypeScript
- Vite (build tool)
- TailwindCSS (styling)
- Framer Motion (animations)
- Axios (HTTP client)
- React Router (routing)
- Zustand (state management)

### Backend
- Node.js + Express + TypeScript
- JWT (authentication)
- bcrypt (password hashing)
- PostgreSQL (database)
- TypeORM (ORM)
- Express Validator (validation)

### DevOps
- Docker & Docker Compose
- Kubernetes ready
- Environment configuration

## 📦 Instalacja i uruchomienie

### Wymagania
- Node.js 18+
- PostgreSQL 14+
- Docker (opcjonalnie)

### Lokalne uruchomienie

#### 1. Klonowanie repozytorium
```bash
cd ProjektowanieUniwersalne
```

#### 2. Uruchomienie z Docker Compose (zalecane)
```bash
docker-compose up -d
```

Aplikacja będzie dostępna pod:
- Frontend: http://localhost:5173
- Backend: http://localhost:3000

#### 3. Lokalne uruchomienie (bez Dockera)

**Backend:**
```bash
cd backend
npm install
cp .env.example .env
# Skonfiguruj zmienne środowiskowe w .env
npm run dev
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

## 🎨 Unikalne rozwiązania UX

1. **Dynamiczny wzrost drzewa** - drzewo rośnie w czasie rzeczywistym podczas sesji
2. **Wybór gatunku drzewa** - różne drzewa do odblokowania (sosna, dąb, sakura, bambus)
3. **Ambient sounds** - odgłosy lasu, deszczu, ptaków
4. **Streak system** - wizualizacja serii dni pracy
5. **Forest view** - 3D wizualizacja twojego "lasu produktywności"
6. **Micro-interactions** - płynne animacje i feedback
7. **Dark/Light mode** - przełączanie motywów
8. **Progressive rewards** - system odblokowywania nagród

## 📊 Struktura bazy danych

```sql
Users
├── id
├── email
├── username
├── password_hash
├── created_at
└── updated_at

FocusSessions
├── id
├── user_id
├── duration_minutes
├── tree_type
├── completed
├── started_at
└── ended_at

UserStats
├── id
├── user_id
├── total_sessions
├── total_minutes
├── current_streak
├── longest_streak
└── trees_planted

TreeTypes
├── id
├── name
├── unlock_requirement
└── rarity
```

## 🔐 Bezpieczeństwo

- Hasła hashowane z bcrypt (10 salt rounds)
- JWT tokens z expiracją
- Walidacja danych wejściowych
- SQL injection protection (TypeORM)
- CORS configuration
- Rate limiting
- Helmet.js security headers

## 🐳 Kubernetes Deployment

```bash
kubectl apply -f k8s/
```

## 📝 API Endpoints

### Auth
- `POST /api/auth/register` - Rejestracja
- `POST /api/auth/login` - Logowanie
- `GET /api/auth/me` - Profil użytkownika

### Sessions
- `POST /api/sessions` - Rozpocznij sesję
- `PUT /api/sessions/:id` - Zakończ sesję
- `GET /api/sessions` - Lista sesji
- `DELETE /api/sessions/:id` - Usuń sesję

### Stats
- `GET /api/stats` - Statystyki użytkownika
- `GET /api/stats/weekly` - Statystyki tygodniowe
- `GET /api/stats/monthly` - Statystyki miesięczne

### User
- `GET /api/user/profile` - Profil
- `PUT /api/user/profile` - Aktualizuj profil
- `PUT /api/user/password` - Zmień hasło

## 🧪 Testowanie

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test
```

## 📄 Licencja

MIT License

## 👨‍💻 Autor

Projekt stworzony jako część kursu Projektowanie Uniwersalne

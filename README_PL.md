# 🌳 FocusForest - Aplikacja do Zarządzania Skupieniem

> Sadź cyfrowe drzewa podczas sesji skupienia i buduj swój las produktywności!

## 📖 Spis Treści

- [O Projekcie](#o-projekcie)
- [Funkcjonalności](#funkcjonalności)
- [Stack Technologiczny](#stack-technologiczny)
- [Instalacja](#instalacja)
- [Użytkowanie](#użytkowanie)
- [Architektura](#architektura)
- [API](#api)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [Licencja](#licencja)

## 🎯 O Projekcie

FocusForest to nowoczesna aplikacja webowa inspirowana popularną aplikacją Forest, stworzona jako projekt studencki w ramach kursu "Projektowanie Uniwersalne". 

**Główna idea:** Podczas sesji skupienia rośnie wirtualne drzewo. Jeśli skupisz się przez cały czas - zasadzisz drzewo w swoim lesie produktywności!

### Problem który rozwiązujemy

- 📱 **Rozproszenie uwagi** - ciągłe powiadomienia i media społecznościowe
- ⏰ **Brak struktury** - trudność w organizacji czasu pracy
- 📊 **Brak motywacji** - niezauważanie własnych postępów
- 🎯 **Prokrastynacja** - odkładanie ważnych zadań

### Nasze rozwiązanie

✅ Gamifikacja produktywności  
✅ Wizualna reprezentacja postępów  
✅ System nagród i streakόw  
✅ Statystyki i analytics  
✅ Prosty, intuicyjny interface  

## ✨ Funkcjonalności

### Zaimplementowane

- ✅ **Autoryzacja i Autentykacja**
  - Bezpieczna rejestracja z walidacją
  - Login z JWT tokens
  - Zmiana hasła
  
- ✅ **Sesje Skupienia**
  - Timer (15, 25, 45, 60 minut)
  - Wizualizacja rosnącego drzewa
  - Pauza i wznowienie
  - Automatyczne zapisywanie

- ✅ **Dashboard**
  - Podsumowanie statystyk
  - Quick actions
  - Historia ostatnich sesji
  - Wizualizacja lasu

- ✅ **Statystyki**
  - Wykresy tygodniowe i miesięczne
  - Liczba sesji i minut
  - Current i longest streak
  - Detailed breakdown

- ✅ **Profil**
  - Edycja username
  - Dark/Light mode
  - Sound preferences
  - Zmiana hasła

### Design Features

- 🎨 **Modern UI** - Czyste, minimalistyczne wzornictwo
- 🌙 **Dark Mode** - Ochrona oczu podczas nocnej pracy
- 📱 **Responsive** - Działa na desktop, tablet i mobile
- ⚡ **Smooth Animations** - Framer Motion dla płynnych przejść
- 🎯 **Accessibility** - ARIA labels, keyboard navigation

## 🛠️ Stack Technologiczny

### Frontend
```
React 18          - UI Library
TypeScript        - Type Safety
Vite              - Build Tool
TailwindCSS       - Styling
Framer Motion     - Animations
Zustand           - State Management
Axios             - HTTP Client
React Router      - Routing
Recharts          - Data Visualization
Lucide React      - Icons
React Hot Toast   - Notifications
```

### Backend
```
Node.js           - Runtime
Express           - Web Framework
TypeScript        - Type Safety
PostgreSQL        - Database
TypeORM           - ORM
bcrypt            - Password Hashing
jsonwebtoken      - Authentication
express-validator - Input Validation
helmet            - Security Headers
morgan            - Logging
```

### DevOps
```
Docker            - Containerization
Docker Compose    - Multi-container
Kubernetes        - Orchestration
Git               - Version Control
```

## 🚀 Instalacja

### Wymagania

- Node.js 18+
- PostgreSQL 14+ (lub Docker)
- Git

### Metoda 1: Docker Compose (Zalecana)

```powershell
# 1. Sklonuj repozytorium
git clone https://github.com/yourusername/focusforest.git
cd focusforest

# 2. Uruchom wszystko
docker-compose up -d

# 3. Aplikacja dostępna na:
# Frontend: http://localhost:5173
# Backend: http://localhost:3000
```

### Metoda 2: Lokalna Instalacja

Szczegółowe instrukcje w [SETUP.md](SETUP.md)

## 📱 Użytkowanie

### 1. Rejestracja

1. Otwórz http://localhost:5173/register
2. Wypełnij formularz (email, username, hasło)
3. Zostaniesz automatycznie zalogowany

### 2. Pierwsza Sesja

1. Kliknij "Start Focus Session"
2. Wybierz czas trwania
3. Kliknij "Start"
4. Obserwuj rosnące drzewo!

### 3. Śledzenie Postępów

- **Dashboard** - szybki przegląd
- **Statistics** - szczegółowe wykresy
- **Profile** - twoje osiągnięcia

## 🏗️ Architektura

### Schemat Wysokopoziomowy

```
┌─────────────┐      ┌─────────────┐      ┌─────────────┐
│   Browser   │────▶ │   Backend   │────▶ │  PostgreSQL │
│  (React)    │◀────│  (Express)  │◀────│  (Database) │
└─────────────┘      └─────────────┘      └─────────────┘
     │                     │
     │                     │
     ▼                     ▼
 TailwindCSS          TypeORM
 Framer Motion        bcrypt
 Zustand              JWT
```

### Baza Danych

**4 główne tabele:**

1. **users** - Dane użytkowników
2. **user_stats** - Statystyki użytkowników
3. **focus_sessions** - Historia sesji
4. **tree_types** - Typy drzew

Więcej w [ARCHITECTURE.md](ARCHITECTURE.md)

## 🔌 API

### Endpoints

#### Auth
```
POST   /api/auth/register  - Rejestracja
POST   /api/auth/login     - Logowanie
GET    /api/auth/me        - Pobierz użytkownika
```

#### Sessions
```
POST   /api/sessions              - Rozpocznij sesję
PUT    /api/sessions/:id/complete - Zakończ sesję
GET    /api/sessions              - Lista sesji
DELETE /api/sessions/:id          - Usuń sesję
```

#### Stats
```
GET    /api/stats         - Ogólne statystyki
GET    /api/stats/weekly  - Statystyki tygodniowe
GET    /api/stats/monthly - Statystyki miesięczne
```

#### User
```
GET    /api/user/profile  - Pobierz profil
PUT    /api/user/profile  - Aktualizuj profil
PUT    /api/user/password - Zmień hasło
```

### Przykład Request

```typescript
// Rozpocznij sesję
POST /api/sessions
Authorization: Bearer <token>
Content-Type: application/json

{
  "durationMinutes": 25,
  "treeTypeId": "uuid"
}
```

## 🐳 Deployment

### Docker

```powershell
# Build images
docker build -t focusforest-backend ./backend
docker build -t focusforest-frontend ./frontend

# Run
docker-compose up -d
```

### Kubernetes

```powershell
# Deploy wszystko
kubectl apply -f k8s/

# Check status
kubectl get pods
kubectl get services
```

Szczegóły w [SETUP.md](SETUP.md)

## 🤝 Contributing

Chcesz pomóc w rozwoju projektu? Świetnie!

1. Fork projektu
2. Utwórz branch (`git checkout -b feature/AmazingFeature`)
3. Commit zmian (`git commit -m 'Add some AmazingFeature'`)
4. Push do brancha (`git push origin feature/AmazingFeature`)
5. Otwórz Pull Request

Zobacz [CONTRIBUTING.md](CONTRIBUTING.md) po więcej szczegółów.

## 🐛 Znane Problemy

- [ ] Brak mobile app
- [ ] Brak ambient sounds
- [ ] Brak social features

Widzisz bug? [Zgłoś issue](https://github.com/yourusername/focusforest/issues)

## 📈 Roadmap

### v1.1 (Q1 2024)
- [ ] Ambient sounds (rain, forest, etc.)
- [ ] More tree types
- [ ] Achievements system

### v1.2 (Q2 2024)
- [ ] Social features
- [ ] Leaderboards
- [ ] Friends system

### v2.0 (Q3 2024)
- [ ] Mobile app (React Native)
- [ ] Desktop app (Electron)
- [ ] Browser extension

## 📄 Licencja

Distributed under the MIT License. See `LICENSE` for more information.

## 👨‍💻 Autorzy

- **Twoje Imię** - *Initial work* - [@yourprofile](https://github.com/yourprofile)

## 🙏 Podziękowania

- [Forest App](https://www.forestapp.cc/) - Inspiracja
- [TailwindCSS](https://tailwindcss.com/) - Amazing CSS framework
- [Framer Motion](https://www.framer.com/motion/) - Beautiful animations
- Community - Feedback i wsparcie

## 📞 Kontakt

Email: your.email@example.com  
GitHub: [@yourprofile](https://github.com/yourprofile)  
LinkedIn: [Your Profile](https://linkedin.com/in/yourprofile)

---

**Zbudowane z ❤️ i ☕ dla społeczności produktywności**

⭐ Star this repo if you find it helpful!

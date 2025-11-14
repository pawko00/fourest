# 🚀 FocusForest - Quick Start Guide

## ⚡ Najszybszy Start (1 komenda!)

```powershell
docker-compose up -d
```

Potem otwórz: **http://localhost:5173** 🎉

---

## 📋 Checklist Pierwszego Uruchomienia

### 1. Weryfikacja Wymagań
- [ ] Node.js 18+ zainstalowany
- [ ] Docker Desktop uruchomiony (jeśli używasz Docker)
- [ ] PostgreSQL 14+ (jeśli lokalnie)
- [ ] Port 5173 wolny (frontend)
- [ ] Port 3000 wolny (backend)
- [ ] Port 5432 wolny (database)

### 2. Instalacja

**Opcja A: Docker (Zalecana)**
```powershell
cd c:\Users\Pawkuix\Documents\ProjektowanieUniwersalne
docker-compose up -d
```

**Opcja B: Lokalnie**
```powershell
# Backend
cd backend
npm install
cp .env.example .env
# Edytuj .env z danymi do PostgreSQL
npm run dev

# Frontend (nowe okno terminala)
cd frontend
npm install
npm run dev
```

### 3. Pierwsza Sesja
- [ ] Otwórz http://localhost:5173
- [ ] Zarejestruj nowe konto
- [ ] Zaloguj się
- [ ] Rozpocznij pierwszą sesję skupienia!

---

## 🎯 Testowanie Funkcjonalności

### Auth
- [ ] Rejestracja działa
- [ ] Login działa
- [ ] Token jest zapisywany
- [ ] Przekierowanie po loginie

### Focus Session
- [ ] Można wybrać czas (15/25/45/60)
- [ ] Timer odlicza czas
- [ ] Drzewo rośnie
- [ ] Pauza działa
- [ ] Można zakończyć sesję

### Dashboard
- [ ] Statystyki się wyświetlają
- [ ] Las rośnie po sesjach
- [ ] Recent sessions pokazują historię

### Stats
- [ ] Wykres tygodniowy działa
- [ ] Wykres miesięczny działa
- [ ] Detailed breakdown poprawny

### Profile
- [ ] Można zmienić username
- [ ] Dark mode działa
- [ ] Zmiana hasła działa

---

## 🔧 Typowe Problemy i Rozwiązania

### Problem: "Port 3000 already in use"

**Rozwiązanie (PowerShell):**
```powershell
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### Problem: "Cannot connect to database"

**Rozwiązanie:**
```powershell
# Sprawdź czy PostgreSQL działa
docker ps

# Jeśli nie, uruchom ponownie
docker-compose down
docker-compose up -d
```

### Problem: "Module not found"

**Rozwiązanie:**
```powershell
# Backend
cd backend
Remove-Item -Recurse -Force node_modules
npm install

# Frontend
cd frontend
Remove-Item -Recurse -Force node_modules
npm install
```

### Problem: TypeScript errors w VS Code

**Rozwiązanie:**
1. `Ctrl+Shift+P`
2. Wpisz: "TypeScript: Restart TS Server"
3. Enter

---

## 📊 Sprawdzenie Czy Wszystko Działa

### Backend Health Check
```powershell
curl http://localhost:3000/health
```

Powinno zwrócić:
```json
{
  "status": "ok",
  "timestamp": "2024-..."
}
```

### Frontend
Otwórz: http://localhost:5173

Powinieneś zobaczyć stronę logowania.

### Database
```powershell
docker-compose exec postgres psql -U focusforest -d focusforest -c "\dt"
```

Powinno pokazać 4 tabele:
- users
- user_stats
- focus_sessions
- tree_types

---

## 🎓 Testowe Dane

### Utwórz testowego użytkownika:

1. Przejdź do http://localhost:5173/register
2. Wypełnij:
   - Email: `test@example.com`
   - Username: `testuser`
   - Password: `test123`
3. Zarejestruj się

### Rozpocznij testową sesję:

1. Na Dashboard kliknij "Start Focus Session"
2. Wybierz 15 minut
3. Kliknij Start
4. Obserwuj rosnące drzewo

---

## 📚 Następne Kroki

1. ✅ Przeczytaj [README.md](README.md) - Przegląd projektu
2. ✅ Zobacz [ARCHITECTURE.md](ARCHITECTURE.md) - Szczegóły architektury
3. ✅ Sprawdź [SETUP.md](SETUP.md) - Pełna dokumentacja instalacji
4. ✅ Zapoznaj się z [CONTRIBUTING.md](CONTRIBUTING.md) - Jak kontrybuować

---

## 🆘 Potrzebujesz Pomocy?

1. Sprawdź [SETUP.md](SETUP.md) - Troubleshooting section
2. Zobacz [GitHub Issues](https://github.com/yourusername/focusforest/issues)
3. Napisz do nas: your.email@example.com

---

## 🎉 Gotowe!

Jeśli wszystko działa - gratulacje! Możesz teraz:

- 🌳 Sadzić drzewa podczas pracy
- 📊 Śledzić swoje postępy
- 🔥 Budować streak
- 🏆 Odblokowywać osiągnięcia

**Powodzenia z produktywnością!** ✨

---

Made with ❤️ and ☕ by FocusForest Team

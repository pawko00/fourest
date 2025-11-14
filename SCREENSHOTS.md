# 📸 FocusForest Screenshots

> **Uwaga:** Poniżej znajdują się opisy ekranów aplikacji. Po uruchomieniu aplikacji możesz zrobić screenshoty i umieścić je tutaj.

## 🔐 Authentication Screens

### Login Page
![Login](./screenshots/login.png)
- Minimalistyczny design
- Logo aplikacji z drzewem
- Email i password fields
- Link do rejestracji

### Register Page
![Register](./screenshots/register.png)
- Formularz rejestracji
- Walidacja w czasie rzeczywistym
- Username, email, password
- Confirm password

## 🏠 Dashboard

![Dashboard](./screenshots/dashboard.png)

**Główne elementy:**
- Powitanie użytkownika
- 3 karty statystyk (Trees, Streak, Minutes)
- Duży przycisk "Start Focus Session"
- Wizualizacja "Your Forest"
- Lista ostatnich sesji

## 🎯 Focus Session

### Start Screen
![Focus Start](./screenshots/focus-start.png)
- Wybór czasu trwania (15/25/45/60 min)
- Duży przycisk "Start"

### Active Session
![Focus Active](./screenshots/focus-active.png)
- Duży timer
- Rosnące drzewo (animacja)
- Progress bar
- Przyciski Pause/Resume/Cancel

### Completion
![Focus Complete](./screenshots/focus-complete.png)
- Gratulacje
- Pełne drzewo
- Przycisk "Complete"
- Automatyczne przekierowanie do Dashboard

## 📊 Statistics

![Statistics](./screenshots/stats.png)

**Widoczne elementy:**
- Przełącznik Week/Month
- 3 karty z podsumowaniem:
  - Total Sessions
  - Total Minutes
  - Average per Day/Week
- Wykres słupkowy (Recharts)
- Detailed Breakdown (lista)

## 👤 Profile

![Profile](./screenshots/profile.png)

**Sekcje:**
1. **Profile Information**
   - Email (disabled)
   - Username (editable)
   - Sound Effects toggle
   
2. **Your Statistics**
   - 4 karty metrykowe
   - Trees Planted
   - Total Sessions
   - Current Streak
   - Total Hours

3. **Security**
   - Change Password form
   - Current password
   - New password
   - Confirm new password

## 🎨 UI Features

### Dark Mode
![Dark Mode](./screenshots/dark-mode.png)
- Przełącznik w Navbar
- Wszystkie komponenty w dark theme
- Zachowanie preferencji

### Responsive Design

#### Mobile View
![Mobile](./screenshots/mobile.png)
- Zoptymalizowany layout
- Touch-friendly buttons
- Collapsed sidebar

#### Tablet View
![Tablet](./screenshots/tablet.png)
- Adaptywny grid
- 2-kolumnowy layout gdzie możliwe

## 🎭 Animations

### Tree Growth
![Tree Animation](./screenshots/tree-animation.gif)
- Płynne powiększanie
- Kołysanie (subtle animation)
- Progress bar sync

### Card Entrance
![Card Animation](./screenshots/card-animation.gif)
- Stagger effect
- Fade in + slide up
- Delay między kartami

### Button Interactions
![Button Hover](./screenshots/button-hover.gif)
- Scale on hover
- Scale down on tap
- Smooth transitions

## 📱 Notifications

### Success Toast
![Success Toast](./screenshots/toast-success.png)
- "Tree planted successfully!"
- Zielona ikona
- Auto-dismiss

### Error Toast
![Error Toast](./screenshots/toast-error.png)
- "Failed to start session"
- Czerwona ikona
- Dłuższy czas wyświetlania

### Info Toast
![Info Toast](./screenshots/toast-info.png)
- "Session paused"
- Niebieska ikona

## 🎯 Special States

### Empty State (Dashboard)
![Empty State](./screenshots/empty-state.png)
- "No trees yet. Start a session!"
- Zachęta do rozpoczęcia

### Loading State
![Loading](./screenshots/loading.png)
- Skeleton screens
- Spinner
- "Loading..." text

### Error State
![Error](./screenshots/error.png)
- Komunikat błędu
- Sugestia działania
- Retry button

---

## 📝 Jak dodać screenshoty?

1. Uruchom aplikację: `docker-compose up -d`
2. Otwórz http://localhost:5173
3. Zrób screenshoty każdego ekranu
4. Utwórz folder `screenshots/` w głównym katalogu
5. Zapisz pliki PNG z odpowiednimi nazwami
6. Screenshoty pojawią się automatycznie w tym dokumencie

### Zalecane rozmiary:
- Desktop: 1920x1080
- Mobile: 375x812 (iPhone)
- Tablet: 768x1024 (iPad)

### Format:
- PNG dla statycznych obrazów
- GIF dla animacji (max 5MB)
- Kompresja: TinyPNG

---

**Tip:** Użyj narzędzi jak [Cleanshot](https://cleanshot.com/) lub [Screely](https://www.screely.com/) do pięknych screenshotów!

# Prezentacja Wdrożenia Projektu FocusForest w Kubernetes

## Wstęp
Dzień dobry Państwu. Chciałbym zaprezentować architekturę wdrożeniową aplikacji "FocusForest" w środowisku Kubernetes. Moim celem było stworzenie wdrożenia, które nie tylko "działa", ale spełnia standardy środowisk produkcyjnych (tzw. *production-grade*), zapewniając wysoką dostępność, skalowalność i bezpieczeństwo danych.

Cała konfiguracja została podzielona na logiczne moduły, które omówię krok po kroku.

---

## 1. Fundamenty i Izolacja

### `00-namespace.yaml`
Zaczynamy od higieny pracy w klastrze.
*   **Co robi:** Tworzy dedykowaną przestrzeń nazw `fourest`.
*   **Dlaczego:** Pozwala to na pełną izolację moich zasobów od innych aplikacji w klastrze. Ułatwia zarządzanie, czyszczenie środowiska i w przyszłości - zarządzanie limitami zasobów per projekt (ResourceQuotas).

### `01-storageclass.yaml`
*   **Co robi:** Definiuje klasę pamięci masowej `fourest-storage`.
*   **Dlaczego:** Zamiast polegać na domyślnych ustawieniach klastra, definiuję własną politykę. Kluczowym elementem jest tutaj `volumeBindingMode: Immediate` oraz `reclaimPolicy: Retain` - co oznacza, że w przypadku usunięcia PVC, dane fizyczne na dysku nie zostaną automatycznie skasowane, co jest dodatkowym zabezpieczeniem przed utratą danych.

### `02-configmap.yaml` oraz `03-secret.yaml`
Zgodnie z zasadami *Twelve-Factor App*, konfiguracja jest oddzielona od kodu.
*   **ConfigMap:** Przechowuje dane jawne (adresy URL, porty, zmienne środowiskowe jak `NODE_ENV`).
*   **Secret:** Przechowuje dane wrażliwe (hasła do bazy, klucze JWT) zakodowane w base64.
*   **Zaleta:** Zmiana hasła do bazy nie wymaga przebudowywania obrazu Dockera, a jedynie aktualizacji obiektu w Kubernetesie.

---

## 2. Bezpieczeństwo (RBAC)

### `04-rbac.yaml`
To element często pomijany w prostych projektach.
*   **Co robi:** Tworzy `ServiceAccount`, `Role` oraz `RoleBinding`.
*   **Kluczowa zaleta:** Zamiast używać domyślnego konta z szerokimi uprawnieniami, backend otrzymuje tylko te dostępy, których potrzebuje (np. odczyt ConfigMap i Secretów). Implementuje to zasadę najmniejszych przywilejów (*Principle of Least Privilege*).

---

## 3. Warstwa Danych (StatefulSet) - Najważniejszy element infrastruktury

W przeciwieństwie do aplikacji bezstanowych, baza danych wymaga specjalnego traktowania. Tutaj zastosowałem wzorzec **StatefulSet**, zamiast zwykłego Deploymentu.

### `07-postgres-statefulset.yaml`
*   **Dlaczego nie Deployment?:** Bazy danych potrzebują stabilnej tożsamości. Pod `postgres-0` w StatefulSecie zawsze wstanie jako `postgres-0`, a nie losowy ciąg znaków. Gwarantuje to, że baza zawsze podłączy się do swojego dysku z danymi.
*   **Probes (Sondy):** Zaimplementowałem `livenessProbe` i `readinessProbe` używając natywnego polecenia `pg_isready`. Kubernetes nie tylko wie, że kontener działa, ale wie, czy PostgreSQL jest gotowy przyjmować zapytania SQL.

### `06-postgres-headless-service.yaml`
*   **Szczegół:** Jest to serwis typu `ClusterIP: None`.
*   **Dlaczego:** Nie potrzebujemy load balancera dla pojedynczej instancji bazy. Headless Service pozwala na bezpośrednią komunikację po DNS (`postgres-0.postgres-headless...`), co jest szybsze i bardziej przewidywalne dla sterowników bazodanowych.

### `05-postgres-pvc.yaml`
*   Obsługuje trwałość danych (Persistence). Jeśli pod z bazą ulegnie awarii i zrestartuje się na innym węźle, te same dane zostaną do niego podpięte.

---

## 4. Warstwa Aplikacyjna (Backend)

### `08-backend-deployment.yaml`
*   **Skalowalność:** Ustawione `replicas: 2`. Dwie kopie backendu działają równolegle.
*   **Availability:** Wykorzystanie sond `health` check. Jeśli jedna instancja backendu się zawiesi, Kubernetes automatycznie odetnie od niej ruch i ją zrestartuje, podczas gdy druga instancja będzie obsługiwać użytkowników. Zero downtime.
*   **Resource Limits:** Zdefiniowane `requests` i `limits` dla CPU/RAM. Zapobiega to sytuacji, w której wyciek pamięci w aplikacji "zagłodzi" inne procesy na serwerze (ochrona przed *Noisy Neighbor*).

### `09-backend-service.yaml`
*   Standardowy serwis klastrowy, który rozkłada ruch (Load Balancing) między dwie repliki backendu.

---

## 5. Warstwa Prezentacji (Frontend)

### `10-frontend-deployment.yaml`
Tutaj zastosowałem zaawansowany mechanizm planowania (Scheduling).
*   **Pod Anti-Affinity:** To jeden z "profesjonalnych" wyróżników tego projektu.
    ```yaml
    podAntiAffinity:
      preferredDuringSchedulingIgnoredDuringExecution: ...
    ```
*   **Co to daje:** Instruuje to Kubernetesa, aby *starał się* nie umieszczać dwóch instancji frontendu na tym samym fizycznym serwerze (węźle). Jeśli jeden serwer padnie, druga instancja frontendu na innym serwerze nadal działa. Zwiększa to drastycznie niezawodność całej aplikacji.

---

## 6. Wystawienie na Świat (Ingress)

### `12-ingress.yaml`
Zamiast otwierać porty bezpośrednio (NodePort), użyłem kontrolera Ingress jako centralnego punktu wejścia.
*   **Routing:** Jeden adres IP obsługuje zarówno frontend (`/`), jak i backend (`/api`).
*   **Rewrite Target:** Kluczowa konfiguracja dla Nginx. Ruch przychodzący na `/api/users` jest przepisywany na `/users` zanim trafi do backendu. Backend nie musi wiedzieć, że na zewnątrz jest dostępny pod prefiksem `/api`. To znakomicie upraszcza kod aplikacji.

---

## Podsumowanie

Projekt ten to nie tylko "uruchomienie kontenerów". To zaprojektowana architektura, która bierze pod uwagę:
1.  **Trwałość danych** (StatefulSet, PVC).
2.  **Samoleczenie** (Liveness/Readiness Probes).
3.  **Wysoką dostępność** (Replikacja, Anti-Affinity).
4.  **Bezpieczeństwo** (RBAC, Secrets).

Jest to gotowy boilerplate pod wdrożenie produkcyjne małej lub średniej skali.

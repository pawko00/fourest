# Szczegółowa Analiza Architektury Kubernetes - Projekt FocusForest

Niniejszy dokument stanowi dogłębną analizę techniczną wdrożenia aplikacji FocusForest w środowisku Kubernetes. Prezentacja skupia się na detalach konfiguracyjnych, uzasadnieniu decyzji architektonicznych oraz mechanizmach zapewniających stabilność i bezpieczeństwo.

---

## 1. Fundamenty Infrastruktury (Baseline Infrastructure)

### Namespace (`00-namespace.yaml`)
Wydzielenie dedykowanej przestrzeni nazw `fourest` nie jest tylko zabiegiem kosmetycznym.
*   **Izolacja zasobów:** W przypadku wdrożenia w klastrze współdzielonym, namespace działa jak wirtualny klaster.
*   **Discovery:** Wszystkie serwisy wewnątrz komunikują się używając nazw skróconych (np. `backend` zamiast `backend.fourest.svc.cluster.local`), co upraszcza konfigurację.

### StorageClass (`01-storageclass.yaml`)
*   **Provisioner:** Użyto `k8s.io/minikube-hostpath`, co jest adekwatne dla środowiska deweloperskiego/testowego. W środowisku chmurowym (AWS/GCP) wystarczyłoby zmienić provisioner na np. `ebs.csi.aws.com`.
*   **ReclaimPolicy: Retain:** To krytyczne ustawienie bezpieczeństwa danych. Domyślnie jest to często `Delete`. Ustawienie `Retain` gwarantuje, że nawet jeśli ktoś przypadkowo usunie obiekt `PersistentVolumeClaim` (PVC), fizyczny wolumen (PV) z danymi bazy **nie zostanie usunięty**. Wymaga to ręcznej interwencji administratora, co jest pożądanym bezpiecznikiem.
*   **VolumeBindingMode: Immediate:** Wolumen jest tworzony natychmiast po utworzeniu PVC, co przyspiesza start bazy w prostych klastrach.

---

## 2. Bezpieczeństwo i Uprawnienia (RBAC)

### Role-Based Access Control (`04-rbac.yaml`)
Implementacja zasady *Least Privilege* (najmniejszych przywilejów). Aplikacja backendowa nie działa na domyślnym koncie, które często ma zbyt szerokie uprawnienia.
*   **ServiceAccount:** `fourest-backend-sa` nadaje tożsamość podom backendu.
*   **Role & Binding:** Zdefiniowana rola `fourest-backend-role` precyzyjnie określa, co aplikacja może robić:
    *   `verbs: ["get", "list", "watch"]` na zasobach `configmaps` i `secrets`.
    *   Brak uprawnień `create`, `update` czy `delete`. Aplikacja może czytać swoją konfigurację, ale nie może jej zmienić ani uszkodzić innych elementów klastra.

### Zarządzanie Sekretami (`03-secret.yaml`)
*   Dane wrażliwe są odseparowane od konfiguracji aplikacji.
*   **Base64:** Wartości są zakodowane standardem Base64.
*   *Uwaga produkcyjna:* W kodzie zaznaczono świadomość, że w dużych systemach produkcyjnych Sekrety Kubernetesa powinny być szyfrowane w spoczynku (Encryption at Rest) lub wstrzykiwane z zewnętrznych systemów jak HashiCorp Vault.

---

## 3. Warstwa Danych (State persistence & Database)

To najbardziej zaawansowana część wdrożenia.

### StatefulSet (`07-postgres-statefulset.yaml`)
Dlaczego **StatefulSet**, a nie Deployment?
1.  **Stabilna tożsamość sieciowa:** Pod zawsze nazywa się `postgres-0`. Nawet po restarcie, nazwa Hosta pozostaje ta sama. Jest to niezbędne dla mechanizmów replikacji baz danych i spójności logów.
2.  **Graceful Storage:** W przeciwieństwie do Deploymentu, StatefulSet gwarantuje, że nowy pod nie wstanie, dopóki stary (np. uszkodzony) nie zostanie całkowicie zamknięty, co zapobiega korupcji danych przy równoczesnym dostępie do wolumenu (dla trybów ReadWriteOnce).

### Headless Service (`06-postgres-headless-service.yaml`)
*   **ClusterIP: None:** To kluczowa linijka. Standardowy serwis działa jako Load Balancer (ma jeden wirtualny adres IP). Serwis Headless **nie ma adresu IP**.
*   **Mechanizm działania:** Zamiast routować ruch, serwis Headless modyfikuje DNS klastra, zwracając bezpośrednie adresy IP podów wchodzących w skład setu. Pozwala to aplikacji klienckiej (lub innym węzłom bazy) na bezpośrednie połączenie z konkretną instancją bazy.

### VolumeClaimTemplates
Wewnątrz StatefulSetu zdefiniowano szablon wolumenu. Dzięki temu Kubernetes automatycznie tworzy PVC (`postgres-data-postgres-0`) dedykowane dla konkretnego poda. To automatyzacja zarządzania dyskami.

---

## 4. Warstwa Aplikacyjna (Backend & Resilience)

### Deployment (`08-backend-deployment.yaml`)
*   **Skalowalność Horyzontalna:** `replicas: 2` zapewnia, że awaria jednego kontenera nie przerywa działania usługi.
*   **Konfiguracja środowiskowa:** Użycie `valueFrom: configMapKeyRef` oraz `secretKeyRef` wstrzykuje konfigurację jako zmienne środowiskowe. Aplikacja jest "nieświadoma" bycia w Kubernetesie (zgodne z 12-Factor App).

### Zaawansowany Health Checking (Probes)
Największa zaleta wdrożenia - rozpoznawanie stanów awaryjnych.
1.  **LivenessProbe (`/health`):** "Czy żyję?"
    *   Sprawdza czy proces Node.js odpowiada. Jeśli nastąpi Deadlock i aplikacja "wisi", Kubernetes restartuje kontener (Kill & Restart).
    *   `initialDelaySeconds: 30`: Daje aplikacji czas na tzw. "warm-up" i nawiązanie połączenia z bazą przed pierwszym sprawdzeniem.
2.  **ReadinessProbe (`/health`):** "Czy jestem gotowy do pracy?"
    *   Sprawdza to samo, ale reakcja jest inna. Jeśli failuje -> Kubernetes **nie restartuje** kontenera, ale **wyjmuje go z load balancera** (Service).
    *   *Scenariusz:* Jeśli backend traci połączenie z bazą, przestaje być "Ready". Ruch nie trafia do niego, ale kontener dalej działa, próbując odzyskać połączenie. To zapobiega wysyłaniu użytkowników na błędy 500.

### Ochrona Zasobów (Resources)
Zdefiniowanie `requests` i `limits` kategoryzuje pody do klasy QoS (Quality of Service) typu **Burstable**.
*   `requests`: Gwarancja, że scheduler umieści poda tylko tam, gdzie jest min. 100m CPU i 128Mi RAM.
*   `limits`: Zabezpieczenie węzła przed wyciekiem pamięci w aplikacji. Jeśli Node.js przekroczy 256Mi RAM, zostanie ubity przez OOMKiller (Out Of Memory Killer), chroniąc resztę systemu.

---

## 5. Warstwa Frontendowa i Szeregowanie (Scheduling)

### Deployment (`10-frontend-deployment.yaml`)
Frontend jest bezstanowy, co jest proste, ale dodano tu zaawansowany mechanizm **Pod Anti-Affinity**.
```yaml
affinity:
  podAntiAffinity:
    preferredDuringSchedulingIgnoredDuringExecution:
      - weight: 100
        podAffinityTerm:
          labelSelector:
            matchLabels:
              app: fourest
              component: frontend
          topologyKey: kubernetes.io/hostname
```
**Tłumaczenie logiki:**
"Kubernetesie, bardzo cię proszę (`preferred...`, waga 100), abyś nie umieszczał poda frontendu na maszynie (`topologyKey: hostname`), na której już działa inny pod frontendu."

**Efekt:** Wymuszenie rozproszenia geograficznego (na poziomie węzłów) aplikacji. Zwiększa to odporność na awarię sprzętową pojedynczego serwera.

---

## 6. Routing Ruchu (Ingress)

### Ingress Controller (`12-ingress.yaml`)
Wdrożenie używa NGINX Ingress Controller jako Reverse Proxy.
*   **Rewrite Target:**
    *   `nginx.ingress.kubernetes.io/rewrite-target: /$2` w połączeniu z path `/api(/|$)(.*)`.
    *   To rozwiązuje klasyczny problem routingu SPA (Single Page Application). Frontend odpytuje `/api/users`. Ingress przechwytuje to żądanie, wycina `/api` i przesyła do backendu samo `/users`.
    *   Dzięki temu backend nie musi implementować prefiksu `/api` w swoim kodzie routera (np. w Express.js), co czyni kod czystszym.
*   **Separacja reguł:** Zdefiniowano osobne reguły dla frontendu (root `/`) i backendu (`/api`). Pozwala to na hostowanie całej aplikacji pod jedną domeną, unikając problemów z CORS (Cross-Origin Resource Sharing).

---

## Podsumowanie

Prezentowane rozwiązanie to **kompletna architektura mikroserwisowa**. Nie jest to tylko zbiór instrukcji uruchomieniowych, ale przemyślany system zapewniający:
1.  **Data Safety** (StorageClass Retain, StatefulSet).
2.  **High Availability** (Replicas, Anti-Affinity).
3.  **Self-Healing** (Liveness/Readiness Probes).
4.  **Security** (RBAC, Secrets, Separation of Concerns).

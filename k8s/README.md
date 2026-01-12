# Fourest - Kubernetes (Minikube) Deployment

## Szybki start

### Wymagania
- **Docker** - https://docs.docker.com/get-docker/
- **Minikube** - https://minikube.sigs.k8s.io/docs/start/
- **kubectl** - https://kubernetes.io/docs/tasks/tools/

### Uruchomienie (jedna komenda!)

```bash
./k8s/deploy.sh
```

Skrypt automatycznie:
1. Uruchomi Minikube (jeśli nie działa)
2. Włączy wymagane dodatki (ingress, storage)
3. Zbuduje obrazy Docker
4. Wdroży wszystkie komponenty
5. Wyświetli adres aplikacji

---

## Architektura

```
┌─────────────────────────────────────────────────────────────────────┐
│                         NAMESPACE: fourest                          │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │                        INGRESS                                │  │
│  │   nginx.ingress.kubernetes.io/rewrite-target                 │  │
│  │                                                               │  │
│  │   /api/* ──────────► backend:3000                            │  │
│  │   /*     ──────────► frontend:80                             │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                              │                                      │
│              ┌───────────────┴───────────────┐                     │
│              ▼                               ▼                      │
│  ┌─────────────────────┐         ┌─────────────────────┐          │
│  │   FRONTEND          │         │    BACKEND          │          │
│  │   (Deployment)      │         │    (Deployment)     │          │
│  │                     │         │                     │          │
│  │   Replicas: 2       │         │   Replicas: 2       │          │
│  │   Image: nginx      │         │   ServiceAccount    │          │
│  │   Port: 80          │         │   Port: 3000        │          │
│  │                     │         │                     │          │
│  │   Resources:        │         │   Resources:        │          │
│  │   CPU: 100m-500m    │         │   CPU: 100m-500m    │          │
│  │   RAM: 128Mi-256Mi  │         │   RAM: 128Mi-256Mi  │          │
│  └─────────────────────┘         └─────────────────────┘          │
│                                              │                      │
│                                              ▼                      │
│                              ┌─────────────────────────┐           │
│                              │      PostgreSQL         │           │
│                              │      (StatefulSet)      │           │
│                              │                         │           │
│                              │  Headless Service       │           │
│                              │  PersistentVolume       │           │
│                              │                         │           │
│                              │  Resources:             │           │
│                              │  CPU: 250m-1000m        │           │
│                              │  RAM: 256Mi-512Mi       │           │
│                              └─────────────────────────┘           │
│                                              │                      │
│                              ┌───────────────┴───────────────┐     │
│                              ▼                               ▼      │
│                     ┌────────────────┐           ┌────────────────┐│
│                     │  ConfigMap     │           │    Secret      ││
│                     │  (env vars)    │           │  (passwords)   ││
│                     └────────────────┘           └────────────────┘│
│                                                                     │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │                          RBAC                                 │  │
│  │   ServiceAccount: fourest-backend-sa                         │  │
│  │   Role: fourest-backend-role                                 │  │
│  │   RoleBinding: fourest-backend-rolebinding                   │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                     │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │                     StorageClass                              │  │
│  │   fourest-storage (microk8s.io/hostpath)                     │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

## Wymagania

- MicroK8s zainstalowany i działający
- Docker (do budowania obrazów)
- Minimum 4GB RAM
- Minimum 2 CPU

## Struktura plików

```
k8s/
├── 00-namespace.yaml           # Dedykowany namespace
├── 01-storageclass.yaml        # StorageClass dla dynamicznego provisioning
├── 02-configmap.yaml           # Konfiguracja (nieczułe dane)
├── 03-secret.yaml              # Sekrety (hasła, klucze JWT)
├── 04-rbac.yaml                # ServiceAccount, Role, RoleBinding
├── 05-postgres-pvc.yaml        # PersistentVolumeClaim (opcjonalny)
├── 06-postgres-headless-service.yaml  # Headless Service dla StatefulSet
├── 07-postgres-statefulset.yaml       # PostgreSQL ze stabilną tożsamością
├── 08-backend-deployment.yaml  # Bezstanowy backend
├── 09-backend-service.yaml     # Service dla backendu
├── 10-frontend-deployment.yaml # Bezstanowy frontend
├── 11-frontend-service.yaml    # Service dla frontendu
├── 12-ingress.yaml             # Ingress z routingiem
├── kustomization.yaml          # Kustomize config
├── deploy.sh                   # Skrypt wdrożenia
├── cleanup.sh                  # Skrypt czyszczenia
└── README.md                   # Ta dokumentacja
```

## Szybkie wdrożenie

### 1. Włącz wymagane dodatki MicroK8s

```bash
microk8s enable dns storage ingress rbac
```

### 2. Zbuduj obrazy Docker

```bash
# Backend
docker build -t fourest-backend:latest -f backend/Dockerfile.prod backend/

# Frontend
docker build -t fourest-frontend:latest -f frontend/Dockerfile.prod frontend/
```

### 3. Zaimportuj obrazy do MicroK8s

```bash
docker save fourest-backend:latest | microk8s ctr image import -
docker save fourest-frontend:latest | microk8s ctr image import -
```

### 4. Wdróż aplikację

**Opcja A: Użyj skryptu automatycznego**
```bash
chmod +x k8s/deploy.sh
./k8s/deploy.sh
```

**Opcja B: Użyj Kustomize**
```bash
microk8s kubectl apply -k k8s/
```

**Opcja C: Wdróż ręcznie**
```bash
microk8s kubectl apply -f k8s/00-namespace.yaml
microk8s kubectl apply -f k8s/01-storageclass.yaml
microk8s kubectl apply -f k8s/02-configmap.yaml
microk8s kubectl apply -f k8s/03-secret.yaml
microk8s kubectl apply -f k8s/04-rbac.yaml
microk8s kubectl apply -f k8s/06-postgres-headless-service.yaml
microk8s kubectl apply -f k8s/07-postgres-statefulset.yaml
microk8s kubectl apply -f k8s/08-backend-deployment.yaml
microk8s kubectl apply -f k8s/09-backend-service.yaml
microk8s kubectl apply -f k8s/10-frontend-deployment.yaml
microk8s kubectl apply -f k8s/11-frontend-service.yaml
microk8s kubectl apply -f k8s/12-ingress.yaml
```

## Dostęp do aplikacji

Po wdrożeniu aplikacja jest dostępna pod:

- **Frontend**: http://localhost/
- **API Backend**: http://localhost/api/

## Monitorowanie

### Sprawdź status podów
```bash
microk8s kubectl get pods -n fourest
```

### Sprawdź logi
```bash
# Backend
microk8s kubectl logs -f deployment/backend -n fourest

# Frontend
microk8s kubectl logs -f deployment/frontend -n fourest

# PostgreSQL
microk8s kubectl logs -f statefulset/postgres -n fourest
```

### Sprawdź status serwisów
```bash
microk8s kubectl get svc -n fourest
```

### Sprawdź Ingress
```bash
microk8s kubectl get ingress -n fourest
microk8s kubectl describe ingress fourest-ingress -n fourest
```

## Skalowanie

### Skalowanie backendu
```bash
microk8s kubectl scale deployment backend --replicas=3 -n fourest
```

### Skalowanie frontendu
```bash
microk8s kubectl scale deployment frontend --replicas=3 -n fourest
```

## Usuwanie wdrożenia

```bash
# Użyj skryptu
chmod +x k8s/cleanup.sh
./k8s/cleanup.sh

# Lub ręcznie usuń namespace (usuwa wszystko)
microk8s kubectl delete namespace fourest
```

## Zasady architektury

### 1. Izolacja i tożsamość
- ✅ Dedykowany Namespace `fourest`
- ✅ Backend jako bezstanowy Deployment
- ✅ PostgreSQL jako StatefulSet ze stabilną tożsamością

### 2. Zarządzanie stanem i pamięcią
- ✅ StorageClass `fourest-storage` dla dynamicznego provisioning
- ✅ PersistentVolumeClaim dla PostgreSQL
- ✅ Headless Service dla bezpośredniej komunikacji z PostgreSQL

### 3. Decoupling konfiguracji
- ✅ ConfigMap dla ustawień środowiskowych
- ✅ Secret dla haseł i kluczy JWT
- ✅ Brak hardcoded wartości w obrazach

### 4. Komunikacja sieciowa
- ✅ Ingress jako centralny punkt wejścia
- ✅ Routing oparty na ścieżkach (`/` → frontend, `/api` → backend)
- ✅ Adnotacja `rewrite-target` dla backendu

### 5. Stabilność i limity
- ✅ Zdefiniowane requests i limits dla CPU i pamięci
- ✅ Liveness i Readiness probes
- ✅ Pod Anti-Affinity dla rozproszenia replik

### 6. Bezpieczeństwo (RBAC)
- ✅ ServiceAccount dla backendu
- ✅ Role z minimalnymi uprawnieniami
- ✅ RoleBinding przypisujący role do ServiceAccount

## Troubleshooting

### Pod nie startuje
```bash
microk8s kubectl describe pod <pod-name> -n fourest
```

### Problemy z połączeniem do bazy
```bash
# Sprawdź czy PostgreSQL jest gotowy
microk8s kubectl get pods -l component=database -n fourest

# Sprawdź logi PostgreSQL
microk8s kubectl logs statefulset/postgres -n fourest
```

### Problemy z Ingress
```bash
# Sprawdź czy Ingress Controller działa
microk8s kubectl get pods -n ingress

# Sprawdź konfigurację Ingress
microk8s kubectl describe ingress fourest-ingress -n fourest
```

## Bezpieczeństwo - produkcja

⚠️ **Przed wdrożeniem na produkcję:**

1. Zmień hasła w `03-secret.yaml` (wygeneruj nowe base64):
   ```bash
   echo -n 'twoje-silne-haslo' | base64
   ```

2. Użyj zewnętrznego systemu zarządzania sekretami (np. Vault, Sealed Secrets)

3. Włącz TLS w Ingress:
   ```yaml
   spec:
     tls:
       - hosts:
           - twoja-domena.com
         secretName: tls-secret
   ```

4. Skonfiguruj NetworkPolicies dla izolacji sieciowej

5. Włącz auditing i monitoring (Prometheus, Grafana)

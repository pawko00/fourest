# Fourest - Kubernetes

Aplikacja Focus Forest na Kubernetes (Minikube).

## Pliki

| Plik                                | Co zawiera                                      |
| ----------------------------------- | ----------------------------------------------- |
| `00-namespace.yaml`                 | Namespace `fourest`                             |
| `01-storageclass.yaml`              | StorageClass dla minikube-hostpath              |
| `02-configmap.yaml`                 | Zmienne środowiskowe (DB_HOST, PORT, CORS)      |
| `03-secret.yaml`                    | Hasła i JWT w base64                            |
| `04-rbac.yaml`                      | ServiceAccount, Role, RoleBinding dla backendu  |
| `05-postgres-pvc.yaml`              | PVC 5Gi dla PostgreSQL                          |
| `06-postgres-headless-service.yaml` | Headless Service dla StatefulSet                |
| `07-postgres-statefulset.yaml`      | PostgreSQL 15 jako StatefulSet                  |
| `08-backend-deployment.yaml`        | Deployment backendu (2 repliki)                 |
| `09-backend-service.yaml`           | ClusterIP Service dla backendu                  |
| `10-frontend-deployment.yaml`       | Deployment frontendu (2 repliki)                |
| `11-frontend-service.yaml`          | ClusterIP Service dla frontendu                 |
| `12-ingress.yaml`                   | Ingress nginx: `/api` → backend, `/` → frontend |

#!/bin/bash

# Skrypt do wdrożenia aplikacji Fourest na Minikube
set -e

echo "=========================================="
echo "  Fourest - Minikube Deployment Script"
echo "=========================================="

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

log_info() { echo -e "${GREEN}[INFO]${NC} $1"; }
log_warn() { echo -e "${YELLOW}[WARN]${NC} $1"; }
log_error() { echo -e "${RED}[ERROR]${NC} $1"; }

# Sprawdzenie czy Docker jest zainstalowany
if ! command -v docker &> /dev/null; then
    log_error "Docker nie jest zainstalowany!"
    log_info "Zainstaluj Docker: https://docs.docker.com/get-docker/"
    exit 1
fi

# Sprawdzenie czy Minikube jest zainstalowany
if ! command -v minikube &> /dev/null; then
    log_error "Minikube nie jest zainstalowany!"
    log_info "Zainstaluj Minikube: https://minikube.sigs.k8s.io/docs/start/"
    exit 1
fi

# Sprawdzenie czy kubectl jest zainstalowany
if ! command -v kubectl &> /dev/null; then
    log_error "kubectl nie jest zainstalowany!"
    log_info "Zainstaluj kubectl: https://kubernetes.io/docs/tasks/tools/"
    exit 1
fi

# Sprawdzenie statusu Minikube
log_info "Sprawdzanie statusu Minikube..."
if ! minikube status 2>/dev/null | grep -q "Running"; then
    log_warn "Minikube nie jest uruchomiony. Uruchamiam..."
    minikube start --memory=4096 --cpus=2
fi

# Włączenie wymaganych dodatków
log_info "Włączanie wymaganych dodatków Minikube..."
minikube addons enable ingress
minikube addons enable storage-provisioner

log_info "Oczekiwanie na gotowość Ingress Controller..."
sleep 10

# Konfiguracja Docker do używania Minikube
log_info "Konfiguracja środowiska Docker dla Minikube..."
eval $(minikube docker-env)

# Przejście do katalogu głównego projektu
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$SCRIPT_DIR/.."

# Budowanie obrazów Docker (bezpośrednio w Minikube)
log_info "Budowanie obrazów Docker..."

log_info "Budowanie obrazu backendu..."
docker build -t fourest-backend:v2 -f backend/Dockerfile.prod backend/

log_info "Budowanie obrazu frontendu..."
docker build -t fourest-frontend:v2 -f frontend/Dockerfile.prod frontend/

# Wdrożenie manifestów Kubernetes
log_info "Wdrażanie manifestów Kubernetes..."
cd k8s

kubectl apply -f 00-namespace.yaml
log_info "Namespace utworzony"

kubectl apply -f 01-storageclass.yaml
log_info "StorageClass utworzony"

kubectl apply -f 02-configmap.yaml
log_info "ConfigMap utworzony"

kubectl apply -f 03-secret.yaml
log_info "Secret utworzony"

kubectl apply -f 04-rbac.yaml
log_info "RBAC skonfigurowany"

kubectl apply -f 06-postgres-headless-service.yaml
log_info "Headless Service dla PostgreSQL utworzony"

kubectl apply -f 07-postgres-statefulset.yaml
log_info "StatefulSet PostgreSQL utworzony"

log_info "Oczekiwanie na gotowość PostgreSQL..."
kubectl wait --for=condition=ready pod -l component=database -n fourest --timeout=180s

kubectl apply -f 08-backend-deployment.yaml
log_info "Deployment backendu utworzony"

kubectl apply -f 09-backend-service.yaml
log_info "Service backendu utworzony"

log_info "Oczekiwanie na gotowość backendu..."
kubectl wait --for=condition=ready pod -l component=backend -n fourest --timeout=180s || log_warn "Backend może potrzebować więcej czasu..."

kubectl apply -f 10-frontend-deployment.yaml
log_info "Deployment frontendu utworzony"

kubectl apply -f 11-frontend-service.yaml
log_info "Service frontendu utworzony"

kubectl apply -f 12-ingress.yaml
log_info "Ingress utworzony"

echo ""
log_info "=========================================="
log_info "  Wdrożenie zakończone!"
log_info "=========================================="
echo ""

log_info "Status podów:"
kubectl get pods -n fourest

echo ""
log_info "Status serwisów:"
kubectl get svc -n fourest

MINIKUBE_IP=$(minikube ip)

echo ""
log_info "=========================================="
log_info "  Aplikacja dostępna pod adresem:"
log_info "  http://${MINIKUBE_IP}"
log_info "  API: http://${MINIKUBE_IP}/api"
log_info ""
log_info "  Alternatywnie uruchom: minikube tunnel"
log_info "  wtedy dostęp przez: http://localhost"
log_info "=========================================="

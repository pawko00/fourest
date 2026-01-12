#!/bin/bash

# Skrypt do usunięcia wdrożenia Fourest z Minikube
set -e

echo "=========================================="
echo "  Fourest - Cleanup Script"
echo "=========================================="

GREEN='\033[0;32m'
NC='\033[0m'

log_info() { echo -e "${GREEN}[INFO]${NC} $1"; }

read -p "Czy na pewno chcesz usunąć całe wdrożenie Fourest? [y/N] " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    log_info "Anulowano."
    exit 0
fi

log_info "Usuwanie namespace fourest (usuwa wszystkie zasoby)..."
kubectl delete namespace fourest --ignore-not-found

log_info "Usuwanie StorageClass..."
kubectl delete storageclass fourest-storage --ignore-not-found

log_info "=========================================="
log_info "  Wdrożenie zostało usunięte."
log_info "=========================================="

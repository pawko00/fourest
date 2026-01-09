#!/bin/bash

# FocusForest Kubernetes Cleanup Script

set -e

echo "🗑️  Cleaning up FocusForest Kubernetes deployment..."

# Delete all resources in the namespace
kubectl delete -f k8s/ingress.yaml --ignore-not-found
kubectl delete -f k8s/hpa.yaml --ignore-not-found
kubectl delete -f k8s/network-policy.yaml --ignore-not-found
kubectl delete -f k8s/frontend.yaml --ignore-not-found
kubectl delete -f k8s/stats-service.yaml --ignore-not-found
kubectl delete -f k8s/session-service.yaml --ignore-not-found
kubectl delete -f k8s/auth-service.yaml --ignore-not-found
kubectl delete -f k8s/postgres.yaml --ignore-not-found
kubectl delete -f k8s/rbac.yaml --ignore-not-found
kubectl delete -f k8s/namespace.yaml --ignore-not-found

echo "✅ Cleanup completed!"

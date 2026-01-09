#!/bin/bash

# FocusForest Kubernetes Deployment Script
# This script deploys the entire application to Kubernetes

set -e

echo "🚀 Starting FocusForest Kubernetes Deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if kubectl is installed
if ! command -v kubectl &> /dev/null; then
    echo -e "${RED}kubectl is not installed. Please install kubectl first.${NC}"
    exit 1
fi

# Check if docker is installed
if ! command -v docker &> /dev/null; then
    echo -e "${RED}docker is not installed. Please install docker first.${NC}"
    exit 1
fi

# Set project root
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

echo -e "${YELLOW}📦 Building Docker images...${NC}"

# Build microservices images
echo "Building auth-service..."
docker build -t focusforest-auth-service:latest "$PROJECT_ROOT/services/auth-service"

echo "Building session-service..."
docker build -t focusforest-session-service:latest "$PROJECT_ROOT/services/session-service"

echo "Building stats-service..."
docker build -t focusforest-stats-service:latest "$PROJECT_ROOT/services/stats-service"

echo "Building frontend..."
docker build -t focusforest-frontend:latest "$PROJECT_ROOT/frontend"

echo -e "${GREEN}✅ Docker images built successfully${NC}"

# Deploy to Kubernetes
echo -e "${YELLOW}🎯 Deploying to Kubernetes...${NC}"

# Create namespace first
echo "Creating namespace..."
kubectl apply -f "$PROJECT_ROOT/k8s/namespace.yaml"

# Wait a moment for namespace to be created
sleep 2

# Apply RBAC
echo "Applying RBAC configuration..."
kubectl apply -f "$PROJECT_ROOT/k8s/rbac.yaml"

# Deploy PostgreSQL
echo "Deploying PostgreSQL..."
kubectl apply -f "$PROJECT_ROOT/k8s/postgres.yaml"

# Wait for PostgreSQL to be ready
echo "Waiting for PostgreSQL to be ready..."
kubectl wait --for=condition=ready pod -l app=postgres -n focusforest --timeout=120s

# Deploy microservices
echo "Deploying auth-service..."
kubectl apply -f "$PROJECT_ROOT/k8s/auth-service.yaml"

echo "Deploying session-service..."
kubectl apply -f "$PROJECT_ROOT/k8s/session-service.yaml"

echo "Deploying stats-service..."
kubectl apply -f "$PROJECT_ROOT/k8s/stats-service.yaml"

# Deploy frontend
echo "Deploying frontend..."
kubectl apply -f "$PROJECT_ROOT/k8s/frontend.yaml"

# Apply NetworkPolicy
echo "Applying NetworkPolicy..."
kubectl apply -f "$PROJECT_ROOT/k8s/network-policy.yaml"

# Apply HPA
echo "Applying HorizontalPodAutoscaler..."
kubectl apply -f "$PROJECT_ROOT/k8s/hpa.yaml"

# Apply Ingress (requires NGINX Ingress Controller to be installed)
echo "Applying Ingress..."
kubectl apply -f "$PROJECT_ROOT/k8s/ingress.yaml"

echo -e "${GREEN}✅ Deployment completed successfully!${NC}"

# Display status
echo -e "\n${YELLOW}📊 Deployment Status:${NC}"
kubectl get pods -n focusforest
echo ""
kubectl get services -n focusforest
echo ""
kubectl get ingress -n focusforest

echo -e "\n${GREEN}🎉 FocusForest is now deployed!${NC}"
echo -e "Add '127.0.0.1 focusforest.local' to your /etc/hosts file"
echo -e "Then access the application at: http://focusforest.local"

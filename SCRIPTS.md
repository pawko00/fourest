# Development Scripts

## Quick Commands

### Start Everything (Docker)
```powershell
docker-compose up -d
```

### Stop Everything
```powershell
docker-compose down
```

### View Logs
```powershell
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f postgres
```

### Rebuild After Code Changes
```powershell
docker-compose down
docker-compose up -d --build
```

### Database Commands
```powershell
# Connect to PostgreSQL
docker-compose exec postgres psql -U focusforest -d focusforest

# Backup database
docker-compose exec postgres pg_dump -U focusforest focusforest > backup.sql

# Restore database
docker-compose exec -T postgres psql -U focusforest focusforest < backup.sql
```

### Install Dependencies
```powershell
# Backend
cd backend; npm install; cd ..

# Frontend  
cd frontend; npm install; cd ..
```

### Run Tests (gdy będą dodane)
```powershell
# Backend
cd backend; npm test

# Frontend
cd frontend; npm test
```

### Build for Production
```powershell
# Backend
cd backend; npm run build

# Frontend
cd frontend; npm run build
```

### Clean Everything
```powershell
# Remove all containers and volumes
docker-compose down -v

# Remove node_modules
Remove-Item -Recurse -Force backend/node_modules, frontend/node_modules

# Remove build artifacts
Remove-Item -Recurse -Force backend/dist, frontend/dist
```

## Kubernetes Commands

### Deploy
```powershell
kubectl apply -f k8s/
```

### Check Status
```powershell
kubectl get pods
kubectl get services
kubectl get deployments
```

### View Logs
```powershell
kubectl logs -f deployment/backend
kubectl logs -f deployment/frontend
```

### Scale
```powershell
# Scale backend to 5 replicas
kubectl scale deployment backend --replicas=5

# Scale frontend to 3 replicas
kubectl scale deployment frontend --replicas=3
```

### Delete
```powershell
kubectl delete -f k8s/
```

## Common Issues

### Port Already in Use
```powershell
# Find process using port 3000
netstat -ano | findstr :3000

# Kill process (replace <PID> with actual PID)
taskkill /PID <PID> /F
```

### Docker Out of Space
```powershell
# Remove unused containers
docker container prune

# Remove unused images
docker image prune -a

# Remove unused volumes
docker volume prune
```

### Reset Database
```powershell
docker-compose down -v
docker-compose up -d
```

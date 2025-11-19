# Deployment Guide for Custom Domains

## Overview
This guide explains how to deploy the CyberGuard application to:
- Frontend: https://purdue-tech120-dev.ishmeet.net
- Backend API: https://api.purdue-tech120-dev.ishmeet.net

## Prerequisites
- Domain DNS configured to point to your server
- SSL certificates for HTTPS (Let's Encrypt recommended)
- Server with Docker and Docker Compose installed
- Nginx or similar reverse proxy

## Step 1: Update Environment Variables

### Backend (.env)
Create `backend/.env` with:
```env
DATABASE_URL=postgresql://postgres:your-secure-password@postgres:5432/cybersecurity_game
SECRET_KEY=your-very-secure-secret-key-change-this-in-production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

### Frontend (.env.local)
Update `frontend/.env.local`:
```env
NEXT_PUBLIC_API_URL=https://api.purdue-tech120-dev.ishmeet.net
```

## Step 2: Update CORS Configuration

Update `backend/app/main.py` to allow your domain:
```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://purdue-tech120-dev.ishmeet.net",
        "http://localhost:3000",  # Keep for local development
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

## Step 3: Production Docker Compose

Create `docker-compose.prod.yml`:
```yaml
version: '3.8'

services:
  postgres:
    image: postgres:15-alpine
    container_name: cyberguard-db
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: ${DB_PASSWORD}
      POSTGRES_DB: cybersecurity_game
    volumes:
      - postgres_data:/var/lib/postgresql/data
    restart: unless-stopped
    networks:
      - cyberguard-network

  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile.prod
    container_name: cyberguard-backend
    environment:
      DATABASE_URL: postgresql://postgres:${DB_PASSWORD}@postgres:5432/cybersecurity_game
      SECRET_KEY: ${SECRET_KEY}
      ALGORITHM: HS256
      ACCESS_TOKEN_EXPIRE_MINUTES: 30
    depends_on:
      - postgres
    restart: unless-stopped
    networks:
      - cyberguard-network

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile.prod
    container_name: cyberguard-frontend
    environment:
      NEXT_PUBLIC_API_URL: https://api.purdue-tech120-dev.ishmeet.net
    restart: unless-stopped
    networks:
      - cyberguard-network

volumes:
  postgres_data:

networks:
  cyberguard-network:
    driver: bridge
```

## Step 4: Production Dockerfiles

### Backend Production Dockerfile
Create `backend/Dockerfile.prod`:
```dockerfile
FROM python:3.11-slim

WORKDIR /app

RUN apt-get update && apt-get install -y \
    gcc \
    postgresql-client \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--workers", "4"]
```

### Frontend Production Dockerfile
Create `frontend/Dockerfile.prod`:
```dockerfile
FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM node:18-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000

CMD ["node", "server.js"]
```

Update `frontend/next.config.js`:
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
}

module.exports = nextConfig
```

## Step 5: Nginx Configuration

Create `/etc/nginx/sites-available/cyberguard`:
```nginx
# Backend API
server {
    listen 80;
    server_name api.purdue-tech120-dev.ishmeet.net;
    
    location / {
        return 301 https://$server_name$request_uri;
    }
}

server {
    listen 443 ssl http2;
    server_name api.purdue-tech120-dev.ishmeet.net;

    ssl_certificate /etc/letsencrypt/live/api.purdue-tech120-dev.ishmeet.net/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/api.purdue-tech120-dev.ishmeet.net/privkey.pem;

    location / {
        proxy_pass http://localhost:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}

# Frontend
server {
    listen 80;
    server_name purdue-tech120-dev.ishmeet.net;
    
    location / {
        return 301 https://$server_name$request_uri;
    }
}

server {
    listen 443 ssl http2;
    server_name purdue-tech120-dev.ishmeet.net;

    ssl_certificate /etc/letsencrypt/live/purdue-tech120-dev.ishmeet.net/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/purdue-tech120-dev.ishmeet.net/privkey.pem;

    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable the site:
```bash
sudo ln -s /etc/nginx/sites-available/cyberguard /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

## Step 6: SSL Certificates with Let's Encrypt

```bash
# Install certbot
sudo apt-get update
sudo apt-get install certbot python3-certbot-nginx

# Get certificates
sudo certbot --nginx -d purdue-tech120-dev.ishmeet.net
sudo certbot --nginx -d api.purdue-tech120-dev.ishmeet.net

# Auto-renewal is set up automatically
```

## Step 7: Deploy

```bash
# Create .env file with production secrets
cat > .env << EOF
DB_PASSWORD=your-secure-database-password
SECRET_KEY=your-very-secure-secret-key-min-32-chars
EOF

# Build and start services
docker-compose -f docker-compose.prod.yml up --build -d

# Check logs
docker-compose -f docker-compose.prod.yml logs -f
```

## Step 8: Update Frontend Environment

Update `frontend/.env.local` (or set in Docker):
```env
NEXT_PUBLIC_API_URL=https://api.purdue-tech120-dev.ishmeet.net
```

Rebuild frontend:
```bash
docker-compose -f docker-compose.prod.yml up --build -d frontend
```

## Quick Deployment Checklist

- [ ] DNS A records pointing to your server IP
- [ ] SSL certificates obtained
- [ ] Backend .env configured with secure secrets
- [ ] Frontend .env.local updated with API URL
- [ ] CORS origins updated in backend/app/main.py
- [ ] Nginx configured and running
- [ ] Docker containers built and running
- [ ] Database initialized and seeded
- [ ] Test registration and login
- [ ] Test question answering
- [ ] Verify leaderboard

## Monitoring

```bash
# Check container status
docker-compose -f docker-compose.prod.yml ps

# View logs
docker-compose -f docker-compose.prod.yml logs -f backend
docker-compose -f docker-compose.prod.yml logs -f frontend

# Check Nginx
sudo systemctl status nginx
sudo tail -f /var/log/nginx/error.log
```

## Troubleshooting

### CORS Errors
- Verify CORS origins in `backend/app/main.py`
- Check that API URL in frontend matches exactly

### SSL Issues
- Verify certificates: `sudo certbot certificates`
- Check Nginx config: `sudo nginx -t`

### Database Connection
- Check DATABASE_URL in backend .env
- Verify postgres container is running

### Frontend Not Loading
- Check NEXT_PUBLIC_API_URL is set correctly
- Verify frontend container is running
- Check Nginx proxy configuration

## Security Notes

1. **Change default passwords** in production
2. **Use strong SECRET_KEY** (min 32 characters)
3. **Enable firewall** (ufw or iptables)
4. **Regular backups** of PostgreSQL database
5. **Keep Docker images updated**
6. **Monitor logs** for suspicious activity

## Backup Database

```bash
# Backup
docker exec cyberguard-db pg_dump -U postgres cybersecurity_game > backup.sql

# Restore
docker exec -i cyberguard-db psql -U postgres cybersecurity_game < backup.sql

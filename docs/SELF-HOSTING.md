# Self-Hosting Workout-Cool

Deploy **Workout-Cool** on your own server using Docker. This guide provides two deployment options with step-by-step instructions.

---

## 📑 Table of Contents

- [Prerequisites](#-prerequisites)
- [Quick Start](#-quick-start)
  - [Common Setup Steps](#common-setup-steps)
  - [Option 1: Docker Compose (All-in-One)](#option-1-docker-compose-all-in-one)
  - [Option 2: Docker Only (External Database)](#option-2-docker-only-external-database)
- [Management Commands](#️-management-commands)
- [Mapping Your Domain & Enabling HTTPS](#-mapping-your-domain--enabling-https)
- [Troubleshooting](#-troubleshooting)
- [Resources & Support](#-resources--support)

---

## 📋 Prerequisites

Before you begin, ensure your server meets these requirements:

- **Operating System**: Linux server or VPS (Ubuntu 20.04+ recommended)
- **Docker**: [Install Docker](https://docs.docker.com/get-docker/)
- **Docker Compose**: [Install Docker Compose](https://docs.docker.com/compose/install/)
- **Git**: [Install Git](https://git-scm.com/downloads)
- **Basic Knowledge**: Familiarity with command line operations

---


## 🚀 Quick Start

**Prefer watching?** Watch our [3-minute video guide on self-hosting Workout.Cool](https://www.youtube.com/watch?v=HQecjb0CfAo):

<p align="center">
  <a href="https://www.youtube.com/watch?v=HQecjb0CfAo">
    <img src="https://img.youtube.com/vi/HQecjb0CfAo/maxresdefault.jpg" alt="Self-Host Workout.Cool in 3 Minutes Video Guide" style="max-width: 400px;">
  </a>
</p>

### Common Setup Steps

These steps are required for both deployment options:

#### 1. Connect to Your Server

```bash
ssh your-user@your-server-ip
```

#### 2. Clone the Repository

```bash
mkdir -p ~/apps
cd ~/apps
git clone https://github.com/Snouzy/workout-cool.git
cd workout-cool
```

#### 3. Configure Environment Variables

```bash
cp .env.example .env
nano .env
```

**Essential Environment Variables:**

```bash
# Application Configuration (Required for both options)
BETTER_AUTH_URL=http://your-server-ip:3000
BETTER_AUTH_SECRET=your-secret-key-here

# Optional: Seed sample data on first run
SEED_SAMPLE_DATA=true
```

#### 4. Customize Sample Data (Optional)

```bash
nano data/sample-exercises.csv
```

**📚 See [Exercise Database Import section in the README](../README.md#exercise-database-import).**

---

### Option 1: Docker Compose (All-in-One)

This option automatically sets up both the application and PostgreSQL database.

**Additional Environment Variables:**

```bash
# Database Configuration (Docker Compose)
POSTGRES_USER=my-user
POSTGRES_PASSWORD=my-password
POSTGRES_DB=workout-cool
DB_HOST=postgres
DB_PORT=5432

DATABASE_URL=postgresql://username:password@postgres:5432/workout-cool
```

**Deploy:**

```bash
docker compose up -d
```

**Access:**

Visit `http://your-server-ip:3000`

---

### Option 2: Docker Only (External Database)

Use this option if you have an existing PostgreSQL database.

**Additional Environment Variables:**

```bash
# Database Configuration (External Database)
DATABASE_URL=postgresql://username:password@your-db-host:5432/workout-cool
```

**Deploy:**

```bash
docker build -t workout-cool .
docker run -d --name workout-cool -p 3000:3000 --env-file .env workout-cool
```

**Access:**

Visit `http://your-server-ip:3000`

---

## 🌐 Mapping Your Domain & Enabling HTTPS

Make your app accessible via your own domain and secure it with HTTPS. Here's how:

### 1. Point Your Domain

1. Log in to your domain registrar.
2. Create an **A record** for `yourdomain.com` pointing to your server's IP.
3. (Optional) Create a **CNAME** record for `www` pointing to `yourdomain.com`.

### 2. Set Up HTTPS with a Reverse Proxy

#### Option A: Caddy (Recommended)

Caddy provides automatic HTTPS and a simpler config.

1. **Install Caddy:**
    ```bash
    sudo apt install -y debian-keyring debian-archive-keyring apt-transport-https
    curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' | sudo gpg --dearmor -o /usr/share/keyrings/caddy-stable-archive-keyring.gpg
    echo "deb [signed-by=/usr/share/keyrings/caddy-stable-archive-keyring.gpg] https://dl.cloudsmith.io/public/caddy/stable/deb/debian all main" | sudo tee /etc/apt/sources.list.d/caddy-stable.list
    sudo apt update
    sudo apt install caddy
    ```
2. **Configure Caddy:**
    ```bash
    sudo nano /etc/caddy/Caddyfile
    ```
    Add:
    ```
    yourdomain.com {
        reverse_proxy localhost:3000
    }
    ```
3. **Reload Caddy:**
    ```bash
    sudo systemctl reload caddy
    ```

✅ Caddy will:
- Automatically request and install an SSL certificate via Let’s Encrypt
- Renew it automatically
- Proxy requests to your app running on port `3000`

#### Option B: Nginx + Let's Encrypt

Use this if you're more familiar with Nginx.

1. **Install Nginx & Certbot:**
    ```bash
    sudo apt update && sudo apt install nginx certbot python3-certbot-nginx
    ```
2. **Create Nginx config:**

    ```bash
    sudo nano /etc/nginx/sites-available/workout-cool
    ```

    Add:
    ```
    server {
        listen 80;
        server_name yourdomain.com www.yourdomain.com;

        location / {
            proxy_pass http://localhost:3000;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }
    }
    ```
3.  **Enable and reload:**
    ```bash
    sudo ln -s /etc/nginx/sites-available/workout-cool /etc/nginx/sites-enabled/
    sudo nginx -t && sudo systemctl reload nginx
    ```
4. **Get an HTTPS certificate:**
    ```bash
    sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
    ```

### 3. Update Environment

Update your `.env` file with the new domain

```env
BETTER_AUTH_URL=https://yourdomain.com
NEXT_PUBLIC_APP_URL=https://yourdomain.com
```

---

## 🛠️ Management Commands

### Docker Compose Commands

```bash
# Start/Stop services
docker compose up -d
docker compose down

# View logs
docker compose logs -f

# Update and restart
git pull
docker compose down
docker compose up -d --build
```

### Docker Commands

```bash
# Start/Stop container
docker start workout-cool
docker stop workout-cool

# View logs
docker logs -f workout-cool

# Update application
git pull
docker build -t workout-cool .
docker stop workout-cool
docker rm workout-cool
docker run -d --name workout-cool -p 3000:3000 --env-file .env workout-cool
```

---

## 🐛 Troubleshooting

### Common Issues

#### Application Won't Start
```bash
# Check logs
docker compose logs workout_cool  # or docker logs workout-cool

# Verify environment variables using docker compose
docker compose exec workout_cool env | grep DATABASE_URL  # or docker exec workout-cool env | grep DATABASE_URL
```

#### Database Connection Issues
```bash
# Test database connectivity (Docker Compose)
docker compose exec postgres psql -U postgres -d workout_cool -c "SELECT 1;"

# Check database status
docker compose ps postgres
```

#### Port Already in Use
```bash
# Check what's using port 3000
sudo lsof -i :3000

# Change port in docker-compose.yml
# ports:
#   - "3001:3000"  # Use port 3001 instead
```

### Getting Help

If you encounter issues:

1. **Check the logs**: Use `docker compose logs` or `docker logs`
2. **Verify configuration**: Ensure all environment variables are set correctly
3. **Database connectivity**: Test database connection manually
4. **Search existing issues** or create a new one on [GitHub](https://github.com/Snouzy/workout-cool/issues)
5. **Join our [Discord community](https://discord.gg/NtrsUBuHUB)** for support

---

## 📚 Resources & Support

### Documentation
- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Next.js Deployment Guide](https://nextjs.org/docs/deployment)
- [Caddy Documentation](https://caddyserver.com/docs/install)

### Community & Support
- **GitHub**: [Repository](https://github.com/Snouzy/workout-cool) | [Issues](https://github.com/Snouzy/workout-cool/issues)
- **Discord**: [Join our community](https://discord.gg/NtrsUBuHUB)

---

*Last updated: July 2025*

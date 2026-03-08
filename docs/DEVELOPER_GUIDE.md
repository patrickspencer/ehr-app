# Developer Guide

This guide walks you through setting up the EHR app for local development on Linux (Ubuntu/Debian). It assumes you're starting from scratch.

## 1. Install prerequisites

Open a terminal and run:

```bash
# Update packages
sudo apt update && sudo apt upgrade -y

# Install Git, Java 17, Node.js 20, Docker
sudo apt install -y git curl openjdk-17-jdk

# Node.js 20 via NodeSource
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Docker
curl -fsSL https://get.docker.com | sudo sh
sudo usermod -aG docker $USER
```

**Log out and back in** after the Docker step (so the group membership takes effect).

Verify everything:

```bash
java --version    # should show 17.x
node --version    # should show 20.x
npm --version     # should show 10.x
docker --version  # should show 27.x
```

## 2. Install VS Code + Claude Code

1. Download VS Code from https://code.visualstudio.com/ (grab the `.deb` package)
2. Install it: `sudo dpkg -i code_*.deb`
3. Open VS Code, go to Extensions (Ctrl+Shift+X), search for **Claude Code**, and install it
4. Open the Claude Code panel and sign in with your Anthropic account

## 3. Clone the repo

```bash
git clone https://github.com/patrickspencer/ehr-app.git
cd ehr-app
```

## 4. Start the database

The app needs PostgreSQL running locally. Docker makes this easy:

```bash
docker compose up -d postgres
```

This starts Postgres on port **5433** with database `ehr`, user `ehr`, password `ehr`.

## 5. Run the backend

```bash
cd backend
./gradlew bootRun
```

The first run downloads dependencies and takes a few minutes. Once you see:

```
Started EhrBackendApplicationKt in X seconds
```

The backend is running on http://localhost:8091. Flyway automatically creates all tables and seeds sample data.

## 6. Run the frontend

In a new terminal:

```bash
cd frontend
npm install
npm run dev
```

The frontend is running on http://localhost:3000. Open it in your browser — you should see the user login screen.

## 7. Verify it works

- Open http://localhost:3000
- Click on a user (e.g. "Sarah Roberts, MD") to sign in
- You should see the patient list with 19 patients
- Click a patient to see their chart, encounters, and notes

## Project structure

```
ehr-app/
├── backend/          # Spring Boot + Kotlin API
│   └── src/main/kotlin/com/ehr/
│       ├── controller/   # REST endpoints
│       ├── service/       # Business logic (JPA and FHIR implementations)
│       ├── model/         # JPA entities
│       ├── repository/    # Spring Data repositories
│       ├── mapper/        # Entity → DTO mappers
│       ├── dto/           # Data transfer objects
│       └── config/        # Spring configuration
├── frontend/         # Next.js + React + Tailwind
│   └── src/
│       ├── app/           # Pages (file-based routing)
│       ├── components/    # UI components
│       ├── contexts/      # React contexts (auth, tabs)
│       ├── lib/           # API client, utilities
│       └── types/         # TypeScript types
├── deploy/           # Ansible playbook for production
├── docker-compose.yml         # Local dev (Postgres + HAPI FHIR)
└── docker-compose.prod.yml    # Production (all services)
```

## Development workflow

### Making changes

1. Create a branch: `git checkout -b my-feature`
2. Make your changes
3. Test locally (backend on :8091, frontend on :3000)
4. Commit and push: `git push origin my-feature`
5. Open a pull request on GitHub

### Using Claude Code

Claude Code can help you with most tasks. Some useful things to ask:

- "Add a new API endpoint for allergies"
- "Fix the bug where ..."
- "Explain how the encounter service works"
- "Run the tests"

### Running tests

The integration tests require both Postgres and HAPI FHIR to be running:

```bash
docker compose up -d postgres hapi-fhir
cd backend
./gradlew test
```

### Common commands

| What | Command |
|------|---------|
| Start Postgres only | `docker compose up -d postgres` |
| Start all Docker services | `docker compose up -d` |
| Run backend | `cd backend && ./gradlew bootRun` |
| Run frontend | `cd frontend && npm run dev` |
| Run backend tests | `cd backend && ./gradlew test` |
| Stop Docker services | `docker compose down` |

## Deploying to production

The app is deployed on a DigitalOcean droplet at **<DEPLOY_HOST>**.

### First-time setup (SSH access)

Ask Patrick to add your SSH public key to the server. If you don't have one:

```bash
ssh-keygen -t ed25519
cat ~/.ssh/id_ed25519.pub
# Send this to Patrick
```

Once your key is added, verify access:

```bash
ssh root@<DEPLOY_HOST> "echo connected"
```

### Deploying changes

After merging to `main`:

```bash
# Install Ansible if you haven't
sudo apt install -y ansible
ansible-galaxy collection install community.docker

# Deploy
cd deploy
ansible-playbook -i inventory.ini playbook.yml
```

This pulls the latest code on the server, rebuilds Docker images, and restarts services. It takes a few minutes.

### Checking the deployment

```bash
# Is it up?
curl http://<DEPLOY_HOST>/api/patients/count

# Check container status
ssh root@<DEPLOY_HOST> "cd /opt/ehr-app && docker compose -f docker-compose.prod.yml ps"

# View backend logs
ssh root@<DEPLOY_HOST> "cd /opt/ehr-app && docker compose -f docker-compose.prod.yml logs backend --tail 30"
```

## Architecture overview

The app has two backend modes controlled by Spring profiles:

- **JPA mode (default)** — stores clinical data directly in Postgres. This is what production uses.
- **FHIR mode** (`spring.profiles.active=fhir`) — stores clinical data in a HAPI FHIR server. Used for integration tests.

Both modes share the same REST API, DTOs, and controllers. The service layer has two implementations (`JpaPatientService` vs `FhirPatientService`, etc.) that are swapped via `@Profile` annotations.

Lookup tables (users, ICD-10 codes, CPT codes) always live in Postgres regardless of mode.

```
Browser → Caddy → /api/*  → Spring Boot (:8091) → Postgres
                → /*      → Next.js (:3000)
```

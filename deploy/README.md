# Deploying to DigitalOcean

## Prerequisites

- [Ansible](https://docs.ansible.com/ansible/latest/installation_guide/) installed locally
- A DigitalOcean Droplet (1 GB RAM / 1 vCPU, Ubuntu 24.04)
- SSH access to the Droplet as `root`
- The repo pushed to a Git remote the Droplet can access

## Quick Start

1. **Add your Droplet IP** to `deploy/inventory.ini`:

   ```ini
   [droplet]
   123.45.67.89 ansible_user=root
   ```

2. **Set environment variables** (optional):

   ```bash
   export REPO_URL=https://github.com/youruser/ehr-app.git
   export DOMAIN=ehr.example.com   # omit for plain HTTP on the IP
   export POSTGRES_PASSWORD=something-secure
   ```

3. **Run the playbook**:

   ```bash
   cd deploy
   ansible-playbook -i inventory.ini playbook.yml
   ```

This will:
- Create a 2 GB swap file (prevents OOM on the $6 tier)
- Install Docker and Docker Compose
- Clone the repo to `/opt/ehr-app`
- Build and start all containers (postgres, hapi-fhir, backend, frontend, caddy)

## Verify

```bash
# Health check
curl http://<droplet-ip>/api/patients/count

# Open in browser
open http://<droplet-ip>
```

## Custom Domain with HTTPS

1. Point your domain's A record to the Droplet IP
2. Set `DOMAIN=yourdomain.com` before running the playbook
3. Caddy will automatically obtain a Let's Encrypt certificate

## Updating

Re-run the playbook — it pulls the latest code and rebuilds:

```bash
cd deploy
ansible-playbook -i inventory.ini playbook.yml
```

## Architecture

```
Internet → Caddy (:80/:443) → /api/*  → backend (:8091)
                              → /*     → frontend (:3000)
           Postgres (:5432) ← backend
           HAPI FHIR (:8080) ← backend
```

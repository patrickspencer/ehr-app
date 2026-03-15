"use client";

import Link from "next/link";
import { CodeBlock, InlineCode, Table, GuideNav } from "./components";

const sections = [
  { id: "prerequisites", title: "1. Install prerequisites" },
  { id: "vscode", title: "2. VS Code + Claude Code" },
  { id: "clone", title: "3. Clone the repo" },
  { id: "database", title: "4. Start the database" },
  { id: "backend", title: "5. Run the backend" },
  { id: "frontend", title: "6. Run the frontend" },
  { id: "verify", title: "7. Verify it works" },
  { id: "structure", title: "Project structure" },
  { id: "workflow", title: "Development workflow" },
  { id: "deploying", title: "Deploying to production" },
  { id: "architecture", title: "Architecture overview" },
];

export default function GuidePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Top bar */}
      <header className="sticky top-0 z-20 border-b border-gray-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
          <h1 className="text-lg font-bold text-slate-700">Developer Guide</h1>
          <Link
            href="/"
            className="text-sm text-slate-500 hover:text-slate-700"
          >
            &larr; Back to app
          </Link>
        </div>
      </header>

      <GuideNav active="setup" />

      <div className="mx-auto flex max-w-6xl gap-8 px-6 py-8">
        {/* Sidebar TOC */}
        <nav className="hidden w-56 shrink-0 lg:block">
          <div className="sticky top-20">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
              On this page
            </p>
            <ul className="space-y-1.5 border-l border-gray-200 pl-3">
              {sections.map((s) => (
                <li key={s.id}>
                  <a
                    href={`#${s.id}`}
                    className="block text-sm text-gray-500 hover:text-slate-800"
                  >
                    {s.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </nav>

        {/* Main content */}
        <article className="min-w-0 max-w-3xl flex-1 text-gray-700">
          <p className="mb-8 text-gray-500">
            This guide walks you through setting up the EHR app for local
            development. It assumes you&apos;re starting from scratch.
          </p>

          {/* Section 1 */}
          <section id="prerequisites" className="mb-12 scroll-mt-20">
            <h2 className="mb-4 text-xl font-bold text-slate-800">
              1. Install prerequisites
            </h2>
            <p className="mb-4">
              You need <strong>Git</strong>, <strong>Java 17</strong>,{" "}
              <strong>Node.js 20</strong>, and <strong>Docker</strong>.
            </p>

            <h3 className="mb-2 mt-4 text-base font-semibold text-slate-700">
              macOS
            </h3>
            <CodeBlock lang="bash">{`# Install Homebrew if you don't have it
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install prerequisites
brew install git openjdk@17 node@20

# Docker — install Docker Desktop from https://www.docker.com/products/docker-desktop
# Then open Docker Desktop and let it finish setup`}</CodeBlock>

            <h3 className="mb-2 mt-4 text-base font-semibold text-slate-700">
              Ubuntu / Debian
            </h3>
            <CodeBlock lang="bash">{`sudo apt update && sudo apt upgrade -y
sudo apt install -y git curl openjdk-17-jdk

# Node.js 20 via NodeSource
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Docker
curl -fsSL https://get.docker.com | sudo sh
sudo usermod -aG docker $USER`}</CodeBlock>
            <p className="mb-2 text-sm text-amber-700">
              Log out and back in after the Docker step so the group membership
              takes effect.
            </p>

            <h3 className="mb-2 mt-4 text-base font-semibold text-slate-700">
              Fedora / RHEL
            </h3>
            <CodeBlock lang="bash">{`sudo dnf install -y git java-17-openjdk nodejs20 docker
sudo systemctl enable --now docker
sudo usermod -aG docker $USER`}</CodeBlock>

            <p className="mb-2 mt-4">Verify everything (all platforms):</p>
            <CodeBlock lang="bash">{`java --version    # should show 17.x
node --version    # should show 20.x
npm --version     # should show 10.x
docker --version  # should show 27.x`}</CodeBlock>
          </section>

          {/* Section 2 */}
          <section id="vscode" className="mb-12 scroll-mt-20">
            <h2 className="mb-4 text-xl font-bold text-slate-800">
              2. Install VS Code + Claude Code
            </h2>
            <ol className="list-inside list-decimal space-y-2">
              <li>
                Download VS Code from{" "}
                <a
                  href="https://code.visualstudio.com/"
                  className="text-blue-600 hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  code.visualstudio.com
                </a>
              </li>
              <li>
                Open VS Code, go to Extensions (Ctrl+Shift+X / Cmd+Shift+X), search for{" "}
                <strong>Claude Code</strong>, and install it
              </li>
              <li>
                Open the Claude Code panel and sign in with your Anthropic
                account
              </li>
            </ol>
          </section>

          {/* Section 3 */}
          <section id="clone" className="mb-12 scroll-mt-20">
            <h2 className="mb-4 text-xl font-bold text-slate-800">
              3. Clone the repo
            </h2>
            <CodeBlock lang="bash">{`git clone https://github.com/patrickspencer/ehr-app.git
cd ehr-app`}</CodeBlock>
          </section>

          {/* Section 4 */}
          <section id="database" className="mb-12 scroll-mt-20">
            <h2 className="mb-4 text-xl font-bold text-slate-800">
              4. Start the database
            </h2>
            <p className="mb-2">
              The app needs PostgreSQL running locally. Docker makes this easy:
            </p>
            <CodeBlock lang="bash">docker compose up -d postgres</CodeBlock>
            <p>
              This starts Postgres on port <InlineCode>5433</InlineCode> with
              database <InlineCode>ehr</InlineCode>, user{" "}
              <InlineCode>ehr</InlineCode>, password{" "}
              <InlineCode>ehr</InlineCode>.
            </p>
          </section>

          {/* Section 5 */}
          <section id="backend" className="mb-12 scroll-mt-20">
            <h2 className="mb-4 text-xl font-bold text-slate-800">
              5. Run the backend
            </h2>
            <CodeBlock lang="bash">{`cd backend
./gradlew bootRun`}</CodeBlock>
            <p className="mb-2">
              The first run downloads dependencies and takes a few minutes. Once
              you see:
            </p>
            <CodeBlock>{`Started EhrBackendApplicationKt in X seconds`}</CodeBlock>
            <p>
              The backend is running on{" "}
              <InlineCode>http://localhost:8091</InlineCode>. Flyway
              automatically creates all tables and seeds sample data.
            </p>
          </section>

          {/* Section 6 */}
          <section id="frontend" className="mb-12 scroll-mt-20">
            <h2 className="mb-4 text-xl font-bold text-slate-800">
              6. Run the frontend
            </h2>
            <p className="mb-2">In a new terminal:</p>
            <CodeBlock lang="bash">{`cd frontend
npm install
npm run dev`}</CodeBlock>
            <p>
              The frontend is running on{" "}
              <InlineCode>http://localhost:3000</InlineCode>. Open it in your
              browser — you should see the user login screen.
            </p>
          </section>

          {/* Section 7 */}
          <section id="verify" className="mb-12 scroll-mt-20">
            <h2 className="mb-4 text-xl font-bold text-slate-800">
              7. Verify it works
            </h2>
            <ul className="list-inside list-disc space-y-1">
              <li>
                Open <InlineCode>http://localhost:3000</InlineCode>
              </li>
              <li>
                Click on a user (e.g. &quot;Sarah Roberts, MD&quot;) to sign in
              </li>
              <li>You should see the patient list with 30 patients</li>
              <li>
                Click a patient to see their chart, encounters, and notes
              </li>
            </ul>
          </section>

          {/* Project structure */}
          <section id="structure" className="mb-12 scroll-mt-20">
            <h2 className="mb-4 text-xl font-bold text-slate-800">
              Project structure
            </h2>
            <CodeBlock>{`ehr-app/
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
└── docker-compose.prod.yml    # Production (all services)`}</CodeBlock>
          </section>

          {/* Development workflow */}
          <section id="workflow" className="mb-12 scroll-mt-20">
            <h2 className="mb-4 text-xl font-bold text-slate-800">
              Development workflow
            </h2>

            <h3 className="mb-3 mt-6 text-lg font-semibold text-slate-700">
              Making changes
            </h3>
            <ol className="list-inside list-decimal space-y-1">
              <li>
                Create a branch:{" "}
                <InlineCode>git checkout -b my-feature</InlineCode>
              </li>
              <li>Make your changes</li>
              <li>
                Test locally (backend on :8091, frontend on :3000)
              </li>
              <li>
                Commit and push:{" "}
                <InlineCode>git push origin my-feature</InlineCode>
              </li>
              <li>Open a pull request on GitHub</li>
            </ol>

            <h3 className="mb-3 mt-6 text-lg font-semibold text-slate-700">
              Using Claude Code
            </h3>
            <p className="mb-2">
              Claude Code can help you with most tasks. Some useful things to
              ask:
            </p>
            <ul className="list-inside list-disc space-y-1 text-gray-600">
              <li>&quot;Add a new API endpoint for allergies&quot;</li>
              <li>&quot;Fix the bug where ...&quot;</li>
              <li>&quot;Explain how the encounter service works&quot;</li>
              <li>&quot;Run the tests&quot;</li>
            </ul>

            <h3 className="mb-3 mt-6 text-lg font-semibold text-slate-700">
              Running tests
            </h3>
            <p className="mb-2">
              The integration tests require both Postgres and HAPI FHIR to be
              running:
            </p>
            <CodeBlock lang="bash">{`docker compose up -d postgres hapi-fhir
cd backend
./gradlew test`}</CodeBlock>

            <h3 className="mb-3 mt-6 text-lg font-semibold text-slate-700">
              Common commands
            </h3>
            <Table
              headers={["What", "Command"]}
              rows={[
                ["Start Postgres only", "docker compose up -d postgres"],
                ["Start all Docker services", "docker compose up -d"],
                ["Run backend", "cd backend && ./gradlew bootRun"],
                ["Run frontend", "cd frontend && npm run dev"],
                ["Run backend tests", "cd backend && ./gradlew test"],
                ["Stop Docker services", "docker compose down"],
              ]}
            />
          </section>

          {/* Deploying */}
          <section id="deploying" className="mb-12 scroll-mt-20">
            <h2 className="mb-4 text-xl font-bold text-slate-800">
              Deploying to production
            </h2>
            <p className="mb-2">
              The app is deployed on a DigitalOcean droplet at{" "}
              <InlineCode>{"<DEPLOY_HOST>"}</InlineCode>.
            </p>

            <h3 className="mb-3 mt-6 text-lg font-semibold text-slate-700">
              First-time setup (SSH access)
            </h3>
            <p className="mb-2">
              Ask Patrick to add your SSH public key to the server. If you
              don&apos;t have one:
            </p>
            <CodeBlock lang="bash">{`ssh-keygen -t ed25519
cat ~/.ssh/id_ed25519.pub
# Send this to Patrick`}</CodeBlock>
            <p className="mb-2">Once your key is added, verify access:</p>
            <CodeBlock lang="bash">{`ssh root@<DEPLOY_HOST> "echo connected"`}</CodeBlock>

            <h3 className="mb-3 mt-6 text-lg font-semibold text-slate-700">
              Deploying changes
            </h3>
            <p className="mb-2">
              After merging to <InlineCode>main</InlineCode>:
            </p>
            <CodeBlock lang="bash">{`# Install Ansible if you haven't
sudo apt install -y ansible
ansible-galaxy collection install community.docker

# Deploy
cd deploy
ansible-playbook -i inventory.ini playbook.yml`}</CodeBlock>
            <p className="mb-4">
              This pulls the latest code on the server, rebuilds Docker images,
              and restarts services. It takes a few minutes.
            </p>

            <h3 className="mb-3 mt-6 text-lg font-semibold text-slate-700">
              Checking the deployment
            </h3>
            <CodeBlock lang="bash">{`# Is it up?
curl http://<DEPLOY_HOST>/api/patients/count

# Check container status
ssh root@<DEPLOY_HOST> "cd /opt/ehr-app && docker compose -f docker-compose.prod.yml ps"

# View backend logs
ssh root@<DEPLOY_HOST> "cd /opt/ehr-app && docker compose -f docker-compose.prod.yml logs backend --tail 30"`}</CodeBlock>
          </section>

          {/* Architecture */}
          <section id="architecture" className="mb-12 scroll-mt-20">
            <h2 className="mb-4 text-xl font-bold text-slate-800">
              Architecture overview
            </h2>
            <p className="mb-4">
              The app has two backend modes controlled by Spring profiles:
            </p>
            <ul className="mb-4 list-inside list-disc space-y-2">
              <li>
                <strong>JPA mode (default)</strong> — stores clinical data
                directly in Postgres. This is what production uses.
              </li>
              <li>
                <strong>FHIR mode</strong> (
                <InlineCode>spring.profiles.active=fhir</InlineCode>) — stores
                clinical data in a HAPI FHIR server. Used for integration tests.
              </li>
            </ul>
            <p className="mb-4">
              Both modes share the same REST API, DTOs, and controllers. The
              service layer has two implementations (
              <InlineCode>JpaPatientService</InlineCode> vs{" "}
              <InlineCode>FhirPatientService</InlineCode>, etc.) that are
              swapped via <InlineCode>@Profile</InlineCode> annotations.
            </p>
            <p className="mb-4">
              Lookup tables (users, ICD-10 codes, CPT codes) always live in
              Postgres regardless of mode.
            </p>
            <CodeBlock>{`Browser → Caddy → /api/*  → Spring Boot (:8091) → Postgres
                → /*      → Next.js (:3000)`}</CodeBlock>
          </section>
        </article>
      </div>
    </div>
  );
}

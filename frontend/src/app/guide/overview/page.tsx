"use client";

import { CodeBlock, InlineCode, Table, GuideNav } from "../components";

const sections = [
  { id: "stack", title: "Tech stack at a glance" },
  { id: "backend", title: "Backend" },
  { id: "frontend", title: "Frontend" },
  { id: "data", title: "Data layer" },
  { id: "infra", title: "Infrastructure" },
  { id: "request-flow", title: "Request flow" },
];

export default function OverviewPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Top bar */}
      <header className="sticky top-0 z-20 border-b border-gray-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
          <h1 className="text-lg font-bold text-slate-700">Developer Guide</h1>
          <a
            href="/"
            className="text-sm text-slate-500 hover:text-slate-700"
          >
            &larr; Back to app
          </a>
        </div>
      </header>

      <GuideNav active="overview" />

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
            A high-level overview of the technologies, architecture, and how the
            pieces of the EHR app fit together.
          </p>

          {/* Tech stack at a glance */}
          <section id="stack" className="mb-12 scroll-mt-20">
            <h2 className="mb-4 text-xl font-bold text-slate-800">
              Tech stack at a glance
            </h2>
            <Table
              headers={["Layer", "Technology", "Version"]}
              rows={[
                ["Language (backend)", "Kotlin", "1.9.25"],
                ["Framework (backend)", "Spring Boot", "3.5.0"],
                ["Build tool", "Gradle", "8.x (Kotlin DSL)"],
                ["Clinical data", "HAPI FHIR", "7.6.0"],
                ["Database", "PostgreSQL", "15"],
                ["Migrations", "Flyway", "10.x"],
                ["Language (frontend)", "TypeScript", "5.x"],
                ["UI framework", "React", "19"],
                ["Meta-framework", "Next.js", "16"],
                ["CSS", "Tailwind CSS", "4"],
                ["Containers", "Docker Compose", "—"],
                ["Reverse proxy", "Caddy", "2.x"],
                ["Deployment", "Ansible", "—"],
                ["Hosting", "DigitalOcean", "—"],
              ]}
            />
          </section>

          {/* Backend */}
          <section id="backend" className="mb-12 scroll-mt-20">
            <h2 className="mb-4 text-xl font-bold text-slate-800">Backend</h2>

            <h3 className="mb-3 mt-4 text-lg font-semibold text-slate-700">
              Kotlin + Spring Boot
            </h3>
            <p className="mb-4">
              The backend is a <strong>Kotlin 1.9.25</strong> application built
              on <strong>Spring Boot 3.5.0</strong>. It exposes a REST API on
              port <InlineCode>8091</InlineCode> that the frontend consumes.
            </p>

            <h3 className="mb-3 mt-6 text-lg font-semibold text-slate-700">
              Gradle build
            </h3>
            <p className="mb-4">
              The project uses <strong>Gradle with the Kotlin DSL</strong> (
              <InlineCode>build.gradle.kts</InlineCode>). Dependencies are
              declared there and the Spring Boot Gradle plugin handles packaging
              into a runnable JAR.
            </p>

            <h3 className="mb-3 mt-6 text-lg font-semibold text-slate-700">
              Key dependencies
            </h3>
            <ul className="mb-4 list-inside list-disc space-y-2">
              <li>
                <strong>Spring Data JPA</strong> — ORM layer for Postgres.
                Repositories extend{" "}
                <InlineCode>JpaRepository</InlineCode> for standard CRUD.
              </li>
              <li>
                <strong>HAPI FHIR 7.6.0</strong> — Java library for working
                with FHIR R4 resources. Used to store and retrieve clinical data
                (patients, encounters, notes, diagnoses, procedures) from a HAPI
                FHIR server.
              </li>
              <li>
                <strong>Flyway</strong> — runs SQL migrations on startup to
                create tables and seed sample data in Postgres.
              </li>
              <li>
                <strong>Spring Security</strong> — configured to allow
                unauthenticated access in development (user selection screen
                instead of a login form).
              </li>
            </ul>

            <h3 className="mb-3 mt-6 text-lg font-semibold text-slate-700">
              Service layer pattern
            </h3>
            <p className="mb-4">
              Each domain area (patients, encounters, notes, etc.) has a{" "}
              <strong>service interface</strong> with two implementations:
            </p>
            <ul className="mb-4 list-inside list-disc space-y-1">
              <li>
                <InlineCode>JpaPatientService</InlineCode> — reads/writes
                Postgres via JPA
              </li>
              <li>
                <InlineCode>FhirPatientService</InlineCode> — reads/writes the
                HAPI FHIR server
              </li>
            </ul>
            <p className="mb-4">
              Spring&apos;s{" "}
              <InlineCode>@Profile(&quot;jpa&quot;)</InlineCode> and{" "}
              <InlineCode>@Profile(&quot;fhir&quot;)</InlineCode> annotations
              control which implementation is active. Controllers and DTOs are
              shared across both modes.
            </p>
          </section>

          {/* Frontend */}
          <section id="frontend" className="mb-12 scroll-mt-20">
            <h2 className="mb-4 text-xl font-bold text-slate-800">Frontend</h2>

            <h3 className="mb-3 mt-4 text-lg font-semibold text-slate-700">
              Next.js + React + TypeScript
            </h3>
            <p className="mb-4">
              The frontend is a <strong>Next.js 16</strong> app using{" "}
              <strong>React 19</strong> and <strong>TypeScript</strong>. It uses
              Next.js&apos;s App Router with file-based routing under{" "}
              <InlineCode>src/app/</InlineCode>.
            </p>

            <h3 className="mb-3 mt-6 text-lg font-semibold text-slate-700">
              Tailwind CSS
            </h3>
            <p className="mb-4">
              All styling uses <strong>Tailwind CSS 4</strong> utility classes
              directly in JSX. There are no separate CSS files or CSS-in-JS
              libraries.
            </p>

            <h3 className="mb-3 mt-6 text-lg font-semibold text-slate-700">
              File-based routing
            </h3>
            <p className="mb-2">
              Pages live under <InlineCode>src/app/</InlineCode>. Key routes:
            </p>
            <Table
              headers={["Route", "Page"]}
              rows={[
                ["/", "Login / user selection"],
                ["/patients", "Patient list"],
                ["/patients/[id]", "Patient chart (encounters, notes, diagnoses)"],
                ["/guide", "Developer setup guide"],
                ["/guide/overview", "This page — tech overview"],
              ]}
            />

            <h3 className="mb-3 mt-6 text-lg font-semibold text-slate-700">
              API client
            </h3>
            <p className="mb-4">
              All backend communication goes through a centralized API client in{" "}
              <InlineCode>src/lib/api.ts</InlineCode>. It reads the base URL
              from <InlineCode>NEXT_PUBLIC_API_BASE_URL</InlineCode> (defaults
              to <InlineCode>http://localhost:8091</InlineCode> in development)
              and provides typed functions for each endpoint.
            </p>
          </section>

          {/* Data layer */}
          <section id="data" className="mb-12 scroll-mt-20">
            <h2 className="mb-4 text-xl font-bold text-slate-800">
              Data layer
            </h2>

            <h3 className="mb-3 mt-4 text-lg font-semibold text-slate-700">
              PostgreSQL
            </h3>
            <p className="mb-4">
              PostgreSQL stores <strong>lookup tables</strong> that are the same
              regardless of backend mode:
            </p>
            <ul className="mb-4 list-inside list-disc space-y-1">
              <li>
                <InlineCode>app_user</InlineCode> — provider accounts (doctors, nurses)
              </li>
              <li>
                <InlineCode>icd10_code</InlineCode> — diagnosis code lookup (ICD-10)
              </li>
              <li>
                <InlineCode>cpt_code</InlineCode> — procedure code lookup (CPT)
              </li>
              <li>
                <InlineCode>fhir_id_mapping</InlineCode> — bridges numeric IDs
                (used by the frontend) to FHIR string IDs
              </li>
            </ul>

            <h3 className="mb-3 mt-6 text-lg font-semibold text-slate-700">
              HAPI FHIR server
            </h3>
            <p className="mb-4">
              Clinical data — patients, encounters, clinical notes, diagnoses,
              and procedures — is stored as FHIR R4 resources in a{" "}
              <strong>HAPI FHIR server</strong> (port{" "}
              <InlineCode>8092</InlineCode> in development). The backend
              communicates with it using the HAPI FHIR Java client library.
            </p>

            <h3 className="mb-3 mt-6 text-lg font-semibold text-slate-700">
              Dual-mode architecture
            </h3>
            <p className="mb-4">
              The backend supports two Spring profiles that control where
              clinical data is stored:
            </p>
            <Table
              headers={["Profile", "Clinical data in", "Used for"]}
              rows={[
                ["jpa (default)", "PostgreSQL via JPA", "Production"],
                ["fhir", "HAPI FHIR server", "Integration tests"],
              ]}
            />
            <p className="mb-4">
              This means you can run the app with just Postgres (JPA mode) for
              simple development, or spin up the full HAPI FHIR stack for
              testing FHIR interoperability.
            </p>
          </section>

          {/* Infrastructure */}
          <section id="infra" className="mb-12 scroll-mt-20">
            <h2 className="mb-4 text-xl font-bold text-slate-800">
              Infrastructure
            </h2>

            <h3 className="mb-3 mt-4 text-lg font-semibold text-slate-700">
              Docker Compose (development)
            </h3>
            <p className="mb-4">
              <InlineCode>docker-compose.yml</InlineCode> defines the local
              development services:
            </p>
            <ul className="mb-4 list-inside list-disc space-y-1">
              <li>
                <InlineCode>postgres</InlineCode> — PostgreSQL 15 on port 5433
              </li>
              <li>
                <InlineCode>hapi-fhir</InlineCode> — HAPI FHIR server on port 8092
                (only needed for integration tests)
              </li>
            </ul>
            <p className="mb-4">
              The backend and frontend run directly on your machine (not in
              Docker) during development for fast reloading.
            </p>

            <h3 className="mb-3 mt-6 text-lg font-semibold text-slate-700">
              Docker Compose (production)
            </h3>
            <p className="mb-4">
              <InlineCode>docker-compose.prod.yml</InlineCode> runs{" "}
              <strong>everything</strong> in containers:
            </p>
            <ul className="mb-4 list-inside list-disc space-y-1">
              <li>
                <InlineCode>caddy</InlineCode> — reverse proxy, routes traffic
              </li>
              <li>
                <InlineCode>backend</InlineCode> — Spring Boot app
              </li>
              <li>
                <InlineCode>frontend</InlineCode> — Next.js app
              </li>
              <li>
                <InlineCode>postgres</InlineCode> — database
              </li>
            </ul>

            <h3 className="mb-3 mt-6 text-lg font-semibold text-slate-700">
              Caddy reverse proxy
            </h3>
            <p className="mb-4">
              In production, <strong>Caddy</strong> sits in front of both the
              backend and frontend. It routes requests based on path:
            </p>
            <ul className="mb-4 list-inside list-disc space-y-1">
              <li>
                <InlineCode>/api/*</InlineCode> → Spring Boot backend
              </li>
              <li>
                Everything else → Next.js frontend
              </li>
            </ul>

            <h3 className="mb-3 mt-6 text-lg font-semibold text-slate-700">
              Ansible deployment
            </h3>
            <p className="mb-4">
              The <InlineCode>deploy/</InlineCode> directory contains an Ansible
              playbook that deploys to a DigitalOcean droplet. It pulls the
              latest code, rebuilds Docker images, and restarts services.
            </p>
          </section>

          {/* Request flow */}
          <section id="request-flow" className="mb-12 scroll-mt-20">
            <h2 className="mb-4 text-xl font-bold text-slate-800">
              Request flow
            </h2>
            <p className="mb-4">
              Here&apos;s how a request flows through the production stack:
            </p>
            <CodeBlock>{`┌─────────┐     ┌───────┐     ┌──────────────┐     ┌──────────┐
│ Browser │────▶│ Caddy │────▶│ Spring Boot  │────▶│ Postgres │
└─────────┘     │       │     │   (:8091)    │     └──────────┘
                │       │     └──────────────┘
                │       │
                │       │     ┌──────────────┐
                │       │────▶│   Next.js    │
                └───────┘     │   (:3000)    │
                              └──────────────┘

Routing rules:
  /api/*  → Spring Boot (backend)
  /*      → Next.js (frontend)`}</CodeBlock>

            <p className="mb-4">In local development, the flow is simpler:</p>
            <CodeBlock>{`Browser ──▶ Next.js (:3000)         # pages & static assets
Browser ──▶ Spring Boot (:8091)     # API calls (via NEXT_PUBLIC_API_BASE_URL)`}</CodeBlock>
            <p className="mb-4">
              The frontend makes API calls directly to the backend on port 8091.
              There&apos;s no reverse proxy in development — the{" "}
              <InlineCode>.env</InlineCode> file sets the API base URL to{" "}
              <InlineCode>http://localhost:8091</InlineCode>.
            </p>
          </section>
        </article>
      </div>
    </div>
  );
}

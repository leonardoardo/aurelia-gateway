# Aurelia Gateway

![Aurelia Gateway](https://via.placeholder.com/1000x250.png?text=Aurelia+Gateway)  

[![CI](https://github.com/your-org/aurelia-gateway/actions/workflows/ci.yml/badge.svg)](https://github.com/your-org/aurelia-gateway/actions/workflows/ci.yml)
[![Coverage Status](https://img.shields.io/codecov/c/github/your-org/aurelia-gateway?style=flat-square)](https://codecov.io/gh/your-org/aurelia-gateway)
![Node.js Version](https://img.shields.io/badge/node-20%2B-green?style=flat-square&logo=node.js)
![Docker](https://img.shields.io/badge/docker-ready-blue?style=flat-square&logo=docker)
![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)

Aurelia Gateway is a **Node.js + NestJS** microservice designed with **Domain-Driven Design (DDD)** principles.  
It acts as an entry point for handling messages, publishing them to Kafka, persisting to MongoDB, and exposing APIs for retrieval.  

This project also integrates **observability** (Prometheus, Loki, Grafana, OpenTelemetry) and is ready for **CI/CD** with GitHub Actions.

---

## ✨ Features

- **Domain-Driven Design (DDD)** layered structure (`domain`, `application`, `infrastructure`, `interface`).
- REST API built with **NestJS**.
- **Kafka** integration via [kafkajs](https://kafka.js.org/).
- **MongoDB persistence** with Mongoose.
- **Observability** stack:
  - Prometheus for metrics
  - Grafana dashboards
  - Loki + Promtail for logs
  - OpenTelemetry tracing
- **Testing** with Jest (unit + e2e).
- **CI/CD** pipelines (GitHub Actions).

---

## 🏗 Project Structure

```

aurelia-gateway/
├── 📁 observability        # Prometheus, Loki, Promtail configs
├── 📁 src
│   ├── application         # Use cases (business logic)
│   ├── domain              # Entities, repositories, interfaces
│   ├── infrastructure      # Kafka, Mongo, Observability adapters
│   ├── interface           # Controllers, DTOs, Pipes
│   ├── message             # Message module
│   ├── app.module.ts       # Root NestJS module
│   └── main.ts             # Application entrypoint
├── 📁 test                 # e2e test configuration
├── docker-compose.yml      # Services (Kafka, Mongo, App)
├── docker-compose.observability.yml
├── jest.config.mjs
├── eslint.config.mjs
├── tsconfig.json
└── README.md

````

---

## 📦 Requirements

- Node.js **v20+** (v24 recommended)
- Yarn **v1.22+**
- Docker & Docker Compose
- Git

---

## 🚀 Getting Started

### 1. Clone repository
```bash
git clone https://github.com/your-org/aurelia-gateway.git
cd aurelia-gateway
````

### 2. Install dependencies

```bash
yarn install
```

### 3. Run locally (dev mode)

```bash
yarn start:dev
```

### 4. Run with Docker

```bash
docker-compose up -d
```

---

## 🧪 Running Tests

* Run all tests:

```bash
yarn test
```

* Watch mode:

```bash
yarn test:watch
```

* End-to-End (E2E) tests:

```bash
yarn test:e2e
```

* Coverage:

```bash
yarn test:cov
```

---

## 📊 Observability

Start observability stack:

```bash
docker-compose -f docker-compose.observability.yml up -d
```

Services included:

* **Prometheus** → `http://localhost:9090`
* **Grafana** → `http://localhost:3000`
* **Loki** → `http://localhost:3100`
* **Promtail** (log collection)

NestJS exposes metrics at:

```
GET http://localhost:3000/metrics
```

---

## 🔄 CI/CD

This project includes **GitHub Actions workflows**:

* **CI**:

  * Lint
  * Unit + e2e tests
  * Build
  * Docker image publish
* **CD** (optional):

  * Deploys to server using `docker-compose pull && docker-compose up -d`

---

## 🧩 Tech Stack

* **Backend**: NestJS (TypeScript)
* **Message Broker**: Kafka
* **Database**: MongoDB (Mongoose)
* **Observability**: Prometheus, Grafana, Loki, OpenTelemetry
* **Testing**: Jest + Supertest

---

## 📖 License

This project is licensed under the **MIT License** – see the [LICENSE](LICENSE) file for details.
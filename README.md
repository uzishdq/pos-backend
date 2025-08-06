# 🧾 Backend POS (Point of Sale API) – WIP

A modern, scalable, and secure **backend API** for a Point of Sale (POS) system, built with:

- 🟨 TypeScript
- ⚡ Express.js
- 🧩 Drizzle ORM
- 🐘 PostgreSQL
- 🔐 JWT Auth with role-based access control
- ✅ Unit & Integration testing (Vitest + Supertest)

> 🚧 **Status: Work in Progress** – Not fully completed yet. Contributions are welcome!

---

## ✨ Features

- 🔐 Secure Auth system (Login, Register, Refresh, Logout)
- 🧠 Role-based authorization (admin, cashier, etc.)
- 📦 Product CRUD
- 🧾 Transaction recording
- ✅ Input validation using Zod
- 📄 RESTful API structure
- 🧪 Unit & integration tests
- 🌱 Scalable folder architecture (Services, Controllers, Middleware, etc.)

---

## 🔗 API Routes Overview

| Method | Endpoint           | Description                 | Protected | Role    |
| ------ | ------------------ | --------------------------- | --------- | ------- |
| POST   | /api/auth/login    | Login with credentials      | ❌        | -       |
| POST   | /api/auth/register | Register new user           | ❌        | -       |
| POST   | /api/auth/refresh  | Refresh access token        | ❌        | -       |
| POST   | /api/auth/logout   | Logout and invalidate token | ✅        | any     |
| GET    | /api/products      | Get all products            | ✅        | any     |
| POST   | /api/products      | Create new product          | ✅        | admin   |
| PUT    | /api/products      | Update product (from body)  | ✅        | admin   |
| DELETE | /api/products      | Delete product (from body)  | ✅        | admin   |
| POST   | /api/transactions  | Create new transaction      | ✅        | cashier |

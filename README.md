# PetCare

PetCare is a web application built with **Next.js, PostgreSQL, Prisma, and Stripe**. It is designed for pet care providers to manage pets efficiently and streamline their subscription-based service.

---

## Features

- User registration and authentication
- One-time subscription payment via **Stripe**
- Add, edit, and manage pet details including **name, image, and additional information**
- Checkout pets when owners pick them up

---

## 🛠 Tech Stack

- **Frontend:** Next.js
- **Backend:** Next.js Server Actions
- **Database ORM:** Prisma
- **Database:** PostgreSQL
- **Payment Integration:** Stripe
- **Package Manager:** npm

---

## 🚀 Installation & Setup

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd <your-repo-folder>
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Variables

Create a .env file in the root directory with the required variables:

```bash
env
# PostgreSQL Database
DATABASE_URL="<your-postgres-database-url>"

# Auth secret for NextAuth or JWT
AUTH_SECRET="<your-auth-secret>"

# Neon / Stack Auth (if using Neon Auth)
NEXT_PUBLIC_STACK_PROJECT_ID="<your-stack-project-id>"
NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY="<your-stack-publishable-client-key>"
STACK_SECRET_SERVER_KEY="<your-stack-secret-server-key>"

# Stripe (test or live keys)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="<your-stripe-publishable-key>"
STRIPE_SECRET_KEY="<your-stripe-secret-key>"
STRIPE_PRICE_ID="<your-stripe-price-id>"
STRIPE_WEBHOOK_SECRET="<your-stripe-webhook-secret>"
```

### 4. Run Database Migrations

```bash

npx prisma migrate dev
```

You can also open Prisma Studio to explore your database:

```bash
npx prisma studio 5. Start the Development Server
```

```bash
npm run dev
```

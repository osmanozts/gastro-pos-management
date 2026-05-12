# gastro-pos-management

A REST API backend for a restaurant point-of-sale system, built as an NX monorepo. It covers the full lifecycle of a restaurant order — from table management and menu configuration, through kitchen/service workflows, to partial and full payment processing.

---

## What it does

- **Tables** — manage table inventory and track occupancy status (`FREE` / `OCCUPIED` / `PARTIALLY_PAID`)
- **Menu** — categories with sorted menu items; items can be toggled available/unavailable
- **Orders** — create orders per table, add items with optional addon/topping lines, send to kitchen, track item-level kitchen and service status
- **Payments** — partial payment support via item-level allocations; order and table status update automatically as items are paid
- **Kitchen / Service views** — covered by `GET /orders` with status filters; no separate module needed
- **Auth** — cookie-based session authentication via Better Auth; all endpoints are protected

---

## Monorepo structure

```
gastro-pos-management/
├── apps/
│   └── api/                  # NestJS REST API
│       ├── src/
│       │   ├── auth/         # Better Auth integration
│       │   ├── user/         # Current user endpoint
│       │   ├── menu/         # Categories + menu items
│       │   ├── table/        # Table CRUD + status
│       │   ├── order/        # Order lifecycle + kitchen flow
│       │   └── payment/      # Payments + item allocations
│       └── prisma/
│           ├── schema.prisma
│           └── seed.ts
└── libs/
    └── api-client/           # Framework-agnostic HTTP client (shared across frontend apps)
        └── src/lib/
            ├── client.ts         # Base fetch wrapper
            ├── types.ts          # Response types (manually maintained)
            ├── types.generated.ts # Request types (auto-generated from OpenAPI)
            ├── request-types.ts  # Named re-exports of generated request types
            ├── auth.api.ts
            ├── tables.api.ts
            ├── menu.api.ts
            ├── orders.api.ts
            └── payments.api.ts
```

---

## Tech stack

| Layer           | Technology                                     |
| --------------- | ---------------------------------------------- |
| Runtime         | Node.js                                        |
| Framework       | NestJS 11                                      |
| Database        | PostgreSQL                                     |
| ORM             | Prisma 7 (PrismaPg adapter)                    |
| Auth            | Better Auth (cookie sessions)                  |
| Validation      | class-validator + class-transformer            |
| API docs        | @nestjs/swagger (Swagger UI at `/docs` in dev) |
| Type generation | openapi-typescript                             |
| Monorepo        | NX 22                                          |

---

## Getting started

### Prerequisites

- Node.js 20+
- PostgreSQL (or Docker)

### 1. Environment

Create `apps/api/.env`:

```env
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/gastro_pos"
BETTER_AUTH_SECRET="your-secret-here"
BETTER_AUTH_URL="http://localhost:3000"
FRONTEND_URL="http://localhost:4200"
NODE_ENV="development"
```

### 2. Install dependencies

```sh
npm install
```

### 3. Database setup

```sh
cd apps/api
npx prisma migrate dev
npm run db:seed        # seeds tables, categories, and menu items
```

### 4. Run the API

```sh
npx nx serve api
# → http://localhost:3000
# → http://localhost:3000/docs  (Swagger UI, dev only)
```

---

## API overview

| Module   | Endpoints                                                                                                                                                                                 |
| -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Auth     | `POST /auth/sign-up` `POST /auth/sign-in` `POST /auth/sign-out`                                                                                                                           |
| User     | `GET /user/me`                                                                                                                                                                            |
| Menu     | `GET/POST /menu/categories` `PATCH/DELETE /menu/categories/:id` `GET/POST /menu/items` `PATCH/DELETE /menu/items/:id` `PATCH /menu/items/:id/toggle`                                      |
| Tables   | `GET/POST /tables` `GET/PATCH/DELETE /tables/:id` `PATCH /tables/:id/status`                                                                                                              |
| Orders   | `GET/POST /orders` `GET /orders/:id` `POST /orders/:id/items` `DELETE /orders/:id/items/:itemId` `PATCH /orders/:id/send` `GET /orders/:id/bill` `PATCH /orders/:id/items/:itemId/status` |
| Payments | `POST /payments` `GET /payments/order/:id`                                                                                                                                                |

Query filters on `GET /orders`: `?tableId=` `?status=` `?tableStatus=`

---

## Shared api-client

The `libs/api-client` library provides typed API functions and can be imported by any frontend app in the monorepo.

```ts
// In any app
import { configureApiClient, ordersApi, paymentsApi } from '@libs/api-client';
import type { Order, Bill, CreateOrderDto } from '@libs/api-client';

configureApiClient({ baseUrl: 'http://localhost:3000' });

const order = await ordersApi.getById('clx123');
const bill = await ordersApi.getBill('clx123');
```

---

## Type generation

Request body types in `types.generated.ts` are auto-generated from the live OpenAPI spec. Run this after any DTO change:

```sh
npm run generate:types
```

This command:

1. Boots the NestJS app headless and writes `openapi.json`
2. Runs `openapi-typescript` to regenerate `libs/api-client/src/lib/types.generated.ts`

Response types (`Order`, `Bill`, `Table`, etc.) in `types.ts` are maintained manually.

---

## Scripts

| Script                     | Description                                 |
| -------------------------- | ------------------------------------------- |
| `npx nx serve api`         | Start API in dev mode                       |
| `npx nx build api`         | Production build                            |
| `npm run db:seed`          | Seed database with sample data              |
| `npm run generate:openapi` | Write `openapi.json` from running app       |
| `npm run generate:types`   | Full type generation (openapi → TypeScript) |

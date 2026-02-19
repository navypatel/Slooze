# Architecture & Design Document

## System Architecture

### Overview
The Slooze Food Ordering App is a full-stack application following a client-server architecture pattern with clear separation between frontend and backend.

```
┌─────────────────┐
│   Next.js App   │  (Frontend - Port 3000)
│   (React/TS)    │
└────────┬────────┘
         │ HTTP/GraphQL
         │
┌────────▼────────┐
│  NestJS Server  │  (Backend - Port 4000)
│  (GraphQL API)  │
└────────┬────────┘
         │
┌────────▼────────┐
│  Prisma ORM     │
└────────┬────────┘
         │
┌────────▼────────┐
│   SQLite DB     │
└─────────────────┘
```

## Backend Architecture

### Technology Stack
- **Framework**: NestJS (Node.js)
- **API**: GraphQL (Apollo Server)
- **ORM**: Prisma
- **Database**: SQLite (easily switchable to PostgreSQL/MySQL)
- **Authentication**: JWT + Passport.js

### Module Structure

```
backend/
├── src/
│   ├── app.module.ts          # Root module
│   ├── main.ts                # Application entry point
│   ├── auth/                   # Authentication module
│   │   ├── auth.module.ts
│   │   ├── auth.service.ts    # Login, register logic
│   │   ├── auth.resolver.ts    # GraphQL mutations/queries
│   │   ├── jwt.strategy.ts    # JWT validation
│   │   └── dto/               # Data transfer objects
│   ├── users/                  # User management
│   ├── restaurants/            # Restaurant & menu management
│   ├── orders/                 # Order management
│   ├── payment-methods/        # Payment method management
│   ├── prisma/                 # Prisma service
│   └── common/                 # Shared utilities
│       ├── guards/             # Auth & role guards
│       └── decorators/          # Custom decorators
└── prisma/
    ├── schema.prisma           # Database schema
    └── seed.ts                 # Seed data
```

### Authentication Flow

1. User submits login credentials
2. `AuthService.validateUser()` checks credentials
3. JWT token generated with user info
4. Token returned to client
5. Client stores token in localStorage
6. Subsequent requests include token in Authorization header
7. `JwtStrategy` validates token and loads user
8. `JwtAuthGuard` ensures authenticated requests
9. `RolesGuard` checks role permissions

### Role-Based Access Control (RBAC)

Implemented using:
- **Guards**: `JwtAuthGuard`, `RolesGuard`
- **Decorators**: `@Roles()`, `@CurrentUser()`
- **Metadata**: Stored via `SetMetadata()` and read by guards

```typescript
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN, Role.MANAGER)
@Mutation(() => Order)
async checkout(...) { ... }
```

### Country-Based Access (Re-BAC)

Implemented in:
- **RestaurantsResolver**: Filters restaurants by user country
- **OrdersService**: Validates country access when creating/accessing orders
- **CountryGuard**: (Optional) Can be used for additional validation

Logic:
- Admin: No country restrictions
- Manager/Member: Only access data from their assigned country

## Frontend Architecture

### Technology Stack
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **GraphQL Client**: Apollo Client
- **State Management**: React hooks + localStorage

### Page Structure

```
frontend/
├── app/
│   ├── layout.tsx              # Root layout with Apollo provider
│   ├── page.tsx                # Home/redirect page
│   ├── login/
│   │   └── page.tsx            # Login page
│   ├── dashboard/
│   │   └── page.tsx            # Main dashboard (restaurants)
│   ├── checkout/
│   │   └── page.tsx            # Checkout page
│   ├── orders/
│   │   └── page.tsx            # Orders list
│   └── payment-methods/
│       └── page.tsx            # Payment methods management
└── lib/
    ├── apollo-wrapper.tsx      # Apollo Client setup
    └── auth.ts                 # Auth utilities
```

### State Management

- **Server State**: Managed by Apollo Client (GraphQL queries/mutations)
- **Client State**: React useState + localStorage
  - Cart: Stored in localStorage
  - User: Stored in localStorage
  - Token: Stored in localStorage

### Authentication Flow (Frontend)

1. User enters credentials on login page
2. `login` mutation sent to GraphQL API
3. Token and user data received
4. Stored in localStorage
5. Apollo Client configured to include token in headers
6. Protected routes check for user in localStorage
7. Logout clears localStorage and redirects

## Database Schema

### Entity Relationship Diagram

```
User (1) ────< (N) Order
User (1) ────< (N) PaymentMethod

Restaurant (1) ────< (N) MenuItem
Restaurant (1) ────< (N) Order

Order (1) ────< (N) OrderItem
MenuItem (1) ────< (N) OrderItem

Order (N) ────> (1) PaymentMethod
```

### Key Models

**User**
- Roles: ADMIN, MANAGER, MEMBER
- Country: Optional (INDIA, AMERICA)
- Used for RBAC and Re-BAC

**Restaurant**
- Country: Required (INDIA, AMERICA)
- Used for country-based filtering

**Order**
- Status: PENDING, CONFIRMED, CANCELLED, COMPLETED
- Links User, Restaurant, and PaymentMethod

**OrderItem**
- Links Order and MenuItem
- Stores quantity and price snapshot

**PaymentMethod**
- Type: credit_card, debit_card, paypal
- Can be set as default

## Security Considerations

### Implemented
- Password hashing with bcryptjs
- JWT token-based authentication
- Role-based access control
- Country-based access control
- Input validation with class-validator

### Production Recommendations
- Use httpOnly cookies instead of localStorage for tokens
- Implement rate limiting
- Add CSRF protection
- Use environment variables for secrets
- Implement proper error handling (don't expose stack traces)
- Add request logging and monitoring
- Use HTTPS in production
- Implement refresh tokens
- Add input sanitization
- Use a production database (PostgreSQL/MySQL)

## API Design

### GraphQL Schema

The GraphQL schema is auto-generated from TypeScript decorators and Prisma models.

**Queries:**
- `me` - Get current user
- `restaurants` - List restaurants (filtered by country)
- `restaurant(id)` - Get single restaurant
- `menuItems(restaurantId)` - Get menu items
- `myOrders` - Get user's orders
- `order(id)` - Get single order
- `myPaymentMethods` - Get user's payment methods

**Mutations:**
- `login(input)` - Authenticate user
- `register(input)` - Register new user
- `createOrder(input)` - Create new order
- `checkout(orderId, paymentMethodId)` - Complete order
- `cancelOrder(orderId)` - Cancel order
- `createPaymentMethod(input)` - Add payment method
- `updatePaymentMethod(id, input)` - Update payment method

## Deployment Considerations

### Backend
- Build: `npm run build`
- Start: `npm run start:prod`
- Environment variables required
- Database migrations: `npm run prisma:migrate deploy`

### Frontend
- Build: `npm run build`
- Start: `npm start`
- Environment variables: `NEXT_PUBLIC_GRAPHQL_URL`

### Database
- SQLite for development
- PostgreSQL/MySQL recommended for production
- Run migrations before deployment
- Seed initial data if needed

## Scalability Considerations

### Current Limitations
- SQLite database (single file)
- No caching layer
- No load balancing
- Stateless authentication (good for scaling)

### Scaling Options
1. **Database**: Migrate to PostgreSQL/MySQL with connection pooling
2. **Caching**: Add Redis for session/user caching
3. **CDN**: Serve static assets via CDN
4. **Load Balancing**: Multiple backend instances behind load balancer
5. **Microservices**: Split into separate services if needed
6. **GraphQL**: Already supports efficient data fetching

## Testing Strategy

### Recommended Tests
- Unit tests for services
- Integration tests for resolvers
- E2E tests for critical flows
- Role-based access tests
- Country-based access tests

### Test Accounts
See README.md for test account credentials.

## Future Enhancements

1. Real-time order updates (GraphQL subscriptions)
2. Email notifications
3. Order history pagination
4. Search and filtering
5. Restaurant ratings and reviews
6. Multiple payment gateways
7. Order tracking
8. Admin dashboard
9. Analytics and reporting
10. Mobile app (React Native)

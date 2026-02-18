# Slooze Food Ordering App

A full-stack, role-based food ordering web application built with NestJS, GraphQL, Prisma, Next.js, and TypeScript.

## Features

- **Role-Based Access Control (RBAC)**: Admin, Manager, and Member roles with different permissions
- **Country-Based Access (Re-BAC)**: Managers and Members can only access data from their assigned country
- **Restaurant & Menu Management**: View restaurants and menu items
- **Order Management**: Create orders, checkout, and cancel orders (based on role)
- **Payment Methods**: Add and modify payment methods (Admin only)

## Tech Stack

### Backend
- **NestJS** - Progressive Node.js framework
- **GraphQL** - API query language
- **Prisma** - Next-generation ORM
- **SQLite** - Database (can be easily switched to PostgreSQL/MySQL)
- **JWT** - Authentication
- **Passport** - Authentication middleware

### Frontend
- **Next.js 14** - React framework
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **Apollo Client** - GraphQL client

## Project Structure

```
.
├── backend/                 # NestJS backend
│   ├── prisma/             # Prisma schema and migrations
│   ├── src/
│   │   ├── auth/           # Authentication module
│   │   ├── users/          # User management
│   │   ├── restaurants/    # Restaurant & menu items
│   │   ├── orders/         # Order management
│   │   ├── payment-methods/ # Payment method management
│   │   └── common/         # Shared guards and decorators
│   └── package.json
├── frontend/               # Next.js frontend
│   ├── app/               # Next.js app directory
│   ├── lib/               # Utilities and Apollo client
│   └── package.json
└── README.md
```

## Prerequisites

- Node.js 18+ and npm
- Git

## Installation & Setup

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Set up the database:
```bash
# Generate Prisma Client
npm run prisma:generate

# Run migrations
npm run prisma:migrate

# Seed the database with initial data
npm run prisma:seed
```

4. Start the development server:
```bash
npm run start:dev
```

The GraphQL playground will be available at `http://localhost:4000/graphql`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## Default Users

The seed script creates the following test users (all passwords: `password123`):

| Name | Email | Role | Country |
|------|-------|------|---------|
| Nick Fury | nick.fury@slooze.com | ADMIN | - |
| Captain Marvel | captain.marvel@slooze.com | MANAGER | INDIA |
| Captain America | captain.america@slooze.com | MANAGER | AMERICA |
| Thanos | thanos@slooze.com | MEMBER | INDIA |
| Thor | thor@slooze.com | MEMBER | INDIA |
| Travis | travis@slooze.com | MEMBER | AMERICA |

## Role-Based Access Control

### Feature Matrix

| Feature | Admin | Manager | Member |
|---------|-------|---------|--------|
| View restaurants & menu items | ✅ | ✅ | ✅ |
| Create order (add food items) | ✅ | ✅ | ✅ |
| Place order (checkout & pay) | ✅ | ✅ | ❌ |
| Cancel order | ✅ | ✅ | ❌ |
| Add/Modify payment methods | ✅ | ❌ | ❌ |

### Country-Based Access (Re-BAC)

- **Admin**: Can access all restaurants and data regardless of country
- **Manager**: Can only access restaurants and data from their assigned country
- **Member**: Can only access restaurants and data from their assigned country

## API Documentation

### GraphQL Endpoints

All GraphQL queries and mutations are available at `http://localhost:4000/graphql`

### Authentication

```graphql
mutation Login($input: LoginInput!) {
  login(input: $input) {
    access_token
    user {
      id
      email
      name
      role
      country
    }
  }
}
```

### Restaurants

```graphql
query GetRestaurants {
  restaurants {
    id
    name
    description
    country
    address
    menuItems {
      id
      name
      description
      price
    }
  }
}
```

### Orders

```graphql
mutation CreateOrder($input: CreateOrderInput!) {
  createOrder(input: $input) {
    id
    status
    totalAmount
  }
}

mutation Checkout($orderId: String!, $paymentMethodId: String!) {
  checkout(orderId: $orderId, paymentMethodId: $paymentMethodId) {
    id
    status
  }
}

mutation CancelOrder($orderId: String!) {
  cancelOrder(orderId: $orderId) {
    id
    status
  }
}
```

### Payment Methods

```graphql
mutation CreatePaymentMethod($input: CreatePaymentMethodInput!) {
  createPaymentMethod(input: $input) {
    id
    type
    cardNumber
    isDefault
  }
}
```

## Environment Variables

### Backend (.env)

```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="your-super-secret-jwt-key-change-in-production"
JWT_EXPIRES_IN="7d"
```

### Frontend (.env.local)

```env
NEXT_PUBLIC_GRAPHQL_URL=http://localhost:4000/graphql
```

## Database Schema

The application uses the following main entities:

- **User**: Users with roles (ADMIN, MANAGER, MEMBER) and optional country assignment
- **Restaurant**: Restaurants with country assignment
- **MenuItem**: Menu items belonging to restaurants
- **Order**: Orders with status tracking
- **OrderItem**: Individual items in an order
- **PaymentMethod**: Payment methods for users

## Development

### Backend Commands

```bash
# Development
npm run start:dev

# Build
npm run build

# Production
npm run start:prod

# Database
npm run prisma:generate    # Generate Prisma Client
npm run prisma:migrate     # Run migrations
npm run prisma:seed        # Seed database
npm run prisma:studio      # Open Prisma Studio
```

### Frontend Commands

```bash
# Development
npm run dev

# Build
npm run build

# Production
npm start
```

## Testing the Application

1. **Login** with any of the test accounts
2. **View Restaurants** - All users can see restaurants (filtered by country for Managers/Members)
3. **Add Items to Cart** - All users can add items
4. **Checkout** - Only Admins and Managers can checkout
5. **View Orders** - Only Admins and Managers can view orders
6. **Cancel Orders** - Only Admins and Managers can cancel orders
7. **Manage Payment Methods** - Only Admins can add/modify payment methods

## Country-Based Access Testing

1. Login as **Captain Marvel** (Manager - India)
   - Should only see Indian restaurants
   - Cannot access American restaurants

2. Login as **Travis** (Member - America)
   - Should only see American restaurants
   - Cannot access Indian restaurants

3. Login as **Nick Fury** (Admin)
   - Should see all restaurants from both countries

## Troubleshooting

### Database Issues

If you encounter database issues:

```bash
# Reset the database
cd backend
rm prisma/dev.db
npm run prisma:migrate
npm run prisma:seed
```

### Port Conflicts

If ports 3000 or 4000 are already in use:

- **Backend**: Change port in `backend/src/main.ts`
- **Frontend**: Change port in `frontend/package.json` scripts or use `PORT=3001 npm run dev`

## License

ISC

## Notes

- The application uses SQLite for simplicity. For production, consider PostgreSQL or MySQL
- JWT tokens are stored in localStorage (consider httpOnly cookies for production)
- Password hashing uses bcryptjs
- All passwords in seed data are `password123` - change in production!

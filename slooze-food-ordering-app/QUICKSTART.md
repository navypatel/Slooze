# Quick Start Guide

Follow these steps to get the application running locally.

## Prerequisites Check

Ensure you have:
- Node.js 18+ installed (`node --version`)
- npm installed (`npm --version`)

## Step-by-Step Setup

### 1. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Generate Prisma Client
npm run prisma:generate

# Create database and run migrations
npm run prisma:migrate

# Seed the database with test data
npm run prisma:seed

# Start the backend server
npm run start:dev
```

The backend will start on `http://localhost:4000`
GraphQL Playground: `http://localhost:4000/graphql`

### 2. Frontend Setup

Open a **new terminal** window:

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start the frontend server
npm run dev
```

The frontend will start on `http://localhost:3000`

### 3. Login

Open your browser and navigate to `http://localhost:3000`

Use one of these test accounts:

**Admin (Full Access):**
- Email: `nick.fury@slooze.com`
- Password: `password123`

**Manager - India:**
- Email: `captain.marvel@slooze.com`
- Password: `password123`

**Manager - America:**
- Email: `captain.america@slooze.com`
- Password: `password123`

**Member - India:**
- Email: `thanos@slooze.com`
- Password: `password123`

**Member - America:**
- Email: `travis@slooze.com`
- Password: `password123`

## Testing Features

### As Admin (Nick Fury)
1. ✅ View all restaurants (India + America)
2. ✅ Add items to cart
3. ✅ Checkout and pay
4. ✅ View orders
5. ✅ Cancel orders
6. ✅ Add/Modify payment methods

### As Manager (Captain Marvel - India)
1. ✅ View only Indian restaurants
2. ✅ Add items to cart
3. ✅ Checkout and pay
4. ✅ View orders
5. ✅ Cancel orders
6. ❌ Cannot add/modify payment methods

### As Member (Thanos - India)
1. ✅ View only Indian restaurants
2. ✅ Add items to cart
3. ❌ Cannot checkout (button hidden)
4. ❌ Cannot view orders
5. ❌ Cannot cancel orders
6. ❌ Cannot add/modify payment methods

## Troubleshooting

### Backend won't start
- Check if port 4000 is available
- Ensure all dependencies are installed: `npm install`
- Check `.env` file exists in backend directory
- Try deleting `node_modules` and reinstalling

### Frontend won't start
- Check if port 3000 is available
- Ensure all dependencies are installed: `npm install`
- Check `.env.local` file exists in frontend directory

### Database errors
- Delete `backend/prisma/dev.db` and run migrations again
- Run `npm run prisma:generate` before migrations

### GraphQL errors
- Ensure backend is running on port 4000
- Check browser console for CORS errors
- Verify token is stored in localStorage after login

### Can't login
- Check backend logs for errors
- Verify database is seeded: `npm run prisma:seed`
- Try clearing browser localStorage

## Next Steps

- Explore the GraphQL Playground at `http://localhost:4000/graphql`
- Check the README.md for detailed documentation
- Review ARCHITECTURE.md for system design details

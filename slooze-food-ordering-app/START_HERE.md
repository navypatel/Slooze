# 🚀 How to Start the Project

Follow these steps **in order** to get the application running.

## Prerequisites

Make sure you have:
- **Node.js 18+** installed (check with `node --version`)
- **npm** installed (check with `npm --version`)

## Step-by-Step Instructions

### ⚙️ Backend Setup (Terminal 1)

Open your terminal/PowerShell and run these commands:

```bash
# 1. Navigate to backend directory
cd "c:\Users\navyp\OneDrive\Desktop\New Project\Slooze Food Ordering app\backend"

# 2. Install dependencies
npm install --legacy-peer-deps

# 3. Generate Prisma Client
npm run prisma:generate

# 4. Create database and run migrations
npm run prisma:migrate
# When prompted, name it "init" or just press Enter

# 5. Seed the database with test data
npm run prisma:seed

# 6. Start the backend server
npm run start:dev
```

**✅ Success indicators:**
- You should see: `🚀 Server running on http://localhost:4000/graphql`
- GraphQL Playground available at: http://localhost:4000/graphql

**⚠️ Keep this terminal open!** The backend needs to keep running.

---

### 🎨 Frontend Setup (Terminal 2)

Open a **NEW** terminal/PowerShell window and run:

```bash
# 1. Navigate to frontend directory
cd "c:\Users\navyp\OneDrive\Desktop\New Project\Slooze Food Ordering app\frontend"

# 2. Install dependencies
npm install

# 3. Start the frontend server
npm run dev
```

**✅ Success indicators:**
- You should see: `Ready on http://localhost:3000`
- The app will automatically open in your browser

---

## 🎯 Access the Application

1. Open your browser and go to: **http://localhost:3000**
2. You'll be redirected to the login page

## 🔐 Test Accounts

All passwords are: `password123`

| Role | Email | Access Level |
|------|-------|--------------|
| **Admin** | `nick.fury@slooze.com` | Full access, all countries |
| **Manager (India)** | `captain.marvel@slooze.com` | Can checkout, India only |
| **Manager (America)** | `captain.america@slooze.com` | Can checkout, America only |
| **Member (India)** | `thanos@slooze.com` | View only, India only |
| **Member (America)** | `travis@slooze.com` | View only, America only |

## 🧪 Testing Features

### As Admin (nick.fury@slooze.com):
- ✅ View all restaurants (India + America)
- ✅ Add items to cart
- ✅ Checkout and pay
- ✅ View orders
- ✅ Cancel orders
- ✅ Manage payment methods

### As Manager (captain.marvel@slooze.com):
- ✅ View only Indian restaurants
- ✅ Add items to cart
- ✅ Checkout and pay
- ✅ View orders
- ✅ Cancel orders
- ❌ Cannot manage payment methods

### As Member (thanos@slooze.com):
- ✅ View only Indian restaurants
- ✅ Add items to cart
- ❌ Cannot checkout (button hidden)
- ❌ Cannot view orders
- ❌ Cannot cancel orders

## 🐛 Troubleshooting

### Backend Issues

**Problem: Port 4000 already in use**
```bash
# Find and kill the process using port 4000
# Windows PowerShell:
netstat -ano | findstr :4000
taskkill /PID <PID> /F
```

**Problem: Database errors**
```bash
# Delete the database and start fresh
cd backend
del prisma\dev.db
npm run prisma:migrate
npm run prisma:seed
```

**Problem: Prisma generate fails**
- Make sure you have internet connection (Prisma needs to download binaries)
- Try: `npx prisma generate`

### Frontend Issues

**Problem: Port 3000 already in use**
```bash
# Use a different port
npm run dev -- -p 3001
```

**Problem: Can't connect to backend**
- Make sure backend is running on port 4000
- Check `.env.local` file exists in frontend directory
- Verify `NEXT_PUBLIC_GRAPHQL_URL=http://localhost:4000/graphql`

**Problem: Login doesn't work**
- Check browser console for errors
- Verify backend is running
- Try clearing browser localStorage:
  ```javascript
  localStorage.clear()
  ```

### General Issues

**Problem: npm install fails**
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
rmdir /s node_modules
npm install --legacy-peer-deps
```

**Problem: Module not found errors**
- Make sure you ran `npm install` in both backend and frontend
- Try deleting `node_modules` and reinstalling

## 📝 Quick Commands Reference

### Backend
```bash
cd backend
npm run start:dev          # Start development server
npm run prisma:studio     # Open Prisma Studio (database GUI)
npm run build             # Build for production
```

### Frontend
```bash
cd frontend
npm run dev               # Start development server
npm run build             # Build for production
npm run start             # Start production server
```

## 🎉 You're All Set!

Once both servers are running:
- **Backend**: http://localhost:4000/graphql (GraphQL Playground)
- **Frontend**: http://localhost:3000 (Web App)

Happy coding! 🚀

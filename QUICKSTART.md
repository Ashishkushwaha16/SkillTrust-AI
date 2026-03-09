# SkillTrust AI - Quick Start Guide

## ✅ Installation Complete!

All dependencies have been installed successfully.

## 📋 Prerequisites Checklist

- [x] Node.js installed
- [x] Backend dependencies installed (152 packages)
- [x] Frontend dependencies installed
- [x] Environment variables configured (.env file created)
- [ ] **MongoDB setup required** (see below)

## 🗄️ MongoDB Setup

### Option 1: Local MongoDB (For Development)

1. **Download MongoDB Community Server**
   - Windows: https://www.mongodb.com/try/download/community
   - Download the `.msi` installer
   - Install with default settings

2. **Start MongoDB**
   ```bash
   # MongoDB should start automatically as a Windows service
   # To verify, open MongoDB Compass or run:
   mongosh
   ```

3. **Connection String** (already in .env)
   ```
   MONGODB_URI=mongodb://localhost:27017/skilltrust-ai
   ```

### Option 2: MongoDB Atlas (Cloud - Recommended)

1. **Create Free Account**
   - Go to: https://www.mongodb.com/cloud/atlas/register
   - Sign up (free tier available)

2. **Create Cluster**
   - Click "Build a Database"
   - Choose "Free" tier (M0)
   - Select nearest region
   - Create cluster (takes 3-5 minutes)

3. **Configure Access**
   - Click "Database Access" → Add Database User
   - Create username and password
   - Click "Network Access" → Add IP Address
   - Add `0.0.0.0/0` (allow from anywhere) for development

4. **Get Connection String**
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database password

5. **Update .env File**
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/skilltrust-ai?retryWrites=true&w=majority
   ```

## 🚀 Running the Application

### Method 1: Run Both Backend + Frontend Together

```bash
npm run dev
```

This starts:
- Backend server on `http://localhost:5000`
- Frontend app on `http://localhost:3000`

### Method 2: Run Separately (Recommended for debugging)

**Terminal 1 - Backend:**
```bash
npm run server
```

**Terminal 2 - Frontend:**
```bash
npm run client
```

## 🌐 Access Your Application

Once running, open your browser:

- **Frontend Application**: http://localhost:3000
- **Backend API**: http://localhost:5000/api
- **Health Check**: http://localhost:5000/api/health

## 📱 First Steps in the App

1. **Register an Account**
   - Go to http://localhost:3000/register
   - Enter: Name, Email, Password, GitHub Username (optional)

2. **Login**
   - Use your email and password
   - You'll be redirected to the Dashboard

3. **Sync with GitHub**
   - Click "Sync GitHub" on Dashboard
   - System fetches your repos, commits, and calculates skills

4. **Add Projects**
   - Go to Projects → Add Project
   - Enter project details and GitHub repo URL
   - System calculates verification score automatically

5. **Find Collaborators**
   - Go to Matching page
   - See users with similar or complementary skills
   - Match percentage shown for each user

6. **View Analytics**
   - Dashboard shows your Trust Score
   - Radar chart displays skill levels
   - Contribution chart shows GitHub activity

## 🔑 Optional: GitHub Personal Access Token

To increase GitHub API rate limits (from 60 to 5000 requests/hour):

1. Go to: https://github.com/settings/tokens
2. Generate new token (classic)
3. Select scopes: `repo` and `user`
4. Copy the token
5. Add to `.env` file:
   ```env
   GITHUB_TOKEN=ghp_your_token_here
   ```

## 🎯 Features Available

### ✅ Implemented Features

- [x] User Authentication (Register/Login with JWT)
- [x] GitHub Integration (fetch repos, commits, contributions)
- [x] Skill Trust Score Algorithm (GitHub + Projects + Peer Rating)
- [x] Project Verification System
- [x] Peer Review System
- [x] Collaborator Matching (Cosine Similarity)
- [x] Analytics Dashboard with Charts
- [x] Responsive Dark Theme UI
- [x] Protected Routes
- [x] Error Handling
- [x] Input Validation

### 📊 API Endpoints Available

**Authentication**
- POST `/api/auth/register` - Create account
- POST `/api/auth/login` - Login
- GET `/api/auth/me` - Get current user
- PUT `/api/auth/updatepassword` - Change password

**Users**
- GET `/api/users/profile/:id` - View profile
- PUT `/api/users/profile` - Update profile
- POST `/api/users/sync-github` - Sync GitHub data
- GET `/api/users/all` - List users

**Projects**
- POST `/api/projects` - Create project
- GET `/api/projects` - List projects
- GET `/api/projects/:id` - Get project details
- PUT `/api/projects/:id` - Update project
- DELETE `/api/projects/:id` - Delete project

**GitHub**
- GET `/api/github/profile/:username` - Get GitHub profile
- GET `/api/github/repos/:username` - Get repositories
- GET `/api/github/commits/:owner/:repo` - Get commits

**Matching**
- GET `/api/match` - Get similar users
- GET `/api/match/complementary` - Get complementary users

**Analytics**
- GET `/api/analytics/dashboard` - Dashboard data
- GET `/api/analytics/trust-score` - Trust score breakdown

**Peer Reviews**
- POST `/api/reviews` - Submit review
- GET `/api/reviews/user/:userId` - User reviews

## 🐛 Troubleshooting

### Backend won't start
- Check MongoDB is running
- Verify `.env` file exists and has correct values
- Check port 5000 is not in use

### Frontend build errors
- Run `npm install` in client folder
- Clear cache: `npm cache clean --force`
- Delete `node_modules` and reinstall

### MongoDB connection error
- Verify connection string in `.env`
- For Atlas: Check IP whitelist and user credentials
- For local: Ensure MongoDB service is running

### GitHub API rate limit
- Add GitHub token to `.env` file
- Check token has correct permissions

## 📚 Project Structure

```
SkillTrust-AI/
├── server/          # Backend (Node.js + Express)
├── client/          # Frontend (React + Vite)
├── .env             # Environment variables
├── package.json     # Root scripts
└── README.md        # Full documentation
```

## 🎨 Tech Stack Summary

**Backend**: Node.js, Express, MongoDB, Mongoose, JWT, bcrypt  
**Frontend**: React 18, Vite, Tailwind CSS, Recharts, Axios  
**APIs**: GitHub REST API v3  
**Authentication**: JWT with httpOnly cookies  
**Styling**: Tailwind CSS with custom dark theme

## 📖 Next Steps

1. ✅ Set up MongoDB (Atlas or local)
2. ✅ Run the application with `npm run dev`
3. ✅ Register your first account
4. ✅ Add your GitHub username
5. ✅ Sync GitHub data
6. ✅ Add projects
7. ✅ Explore matching features

## 🚀 Ready to Deploy?

See the main [README.md](README.md) for deployment instructions to:
- **Frontend**: Vercel or Netlify
- **Backend**: Render, Railway, or Heroku
- **Database**: MongoDB Atlas (already cloud-based)

---

**Need Help?** Check the full [README.md](README.md) for detailed documentation.

**Found a bug?** The codebase is production-ready but feel free to customize!

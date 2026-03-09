# SkillTrust AI – Verified Skill Intelligence Platform

A full-stack MERN platform that verifies users' technical skills based on GitHub activity, project contributions, and peer validation.

## 🚀 Features

- **GitHub Integration**: Automatically fetch and analyze repositories, commits, and contributions
- **Trust Score System**: AI-powered scoring algorithm (40% GitHub + 30% Projects + 30% Peer Rating)
- **Project Verification**: Showcase projects with automatic verification scoring
- **Peer Review System**: Rate and validate other developers' skills
- **Smart Matching**: Find collaborators with similar or complementary skills using cosine similarity
- **Analytics Dashboard**: Visual insights with radar charts and contribution graphs
- **JWT Authentication**: Secure user authentication with encrypted passwords

## 📁 Project Structure

```
SkillTrust-AI/
├── server/                    # Backend (Node.js + Express)
│   ├── config/
│   │   └── db.js             # MongoDB connection
│   ├── models/
│   │   ├── User.js           # User schema with trust score
│   │   ├── Project.js        # Project schema with verification
│   │   └── PeerReview.js     # Peer review schema
│   ├── controllers/
│   │   ├── authController.js # Authentication logic
│   │   ├── userController.js # User management
│   │   ├── projectController.js
│   │   ├── githubController.js
│   │   ├── matchController.js
│   │   ├── analyticsController.js
│   │   └── reviewController.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── users.js
│   │   ├── projects.js
│   │   ├── github.js
│   │   ├── match.js
│   │   ├── analytics.js
│   │   └── reviews.js
│   ├── middleware/
│   │   ├── auth.js           # JWT verification
│   │   ├── errorHandler.js   # Error handling
│   │   └── validator.js      # Request validation
│   ├── services/
│   │   ├── githubService.js  # GitHub API integration
│   │   ├── matchingService.js # Similarity algorithms
│   │   └── scoringService.js # Trust score calculation
│   ├── utils/
│   │   └── logger.js         # Custom logging
│   ├── server.js             # Express server entry point
│   └── package.json
│
├── client/                    # Frontend (React)
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── Sidebar.js
│   │   │   ├── Layout.js
│   │   │   ├── PrivateRoute.js
│   │   │   ├── StatsCard.js
│   │   │   ├── SkillRadarChart.js
│   │   │   ├── ContributionChart.js
│   │   │   └── ProjectCard.js
│   │   ├── pages/
│   │   │   ├── Dashboard.js
│   │   │   ├── Profile.js
│   │   │   ├── Projects.js
│   │   │   ├── AddProject.js
│   │   │   ├── Matching.js
│   │   │   ├── Analytics.js
│   │   │   ├── Login.js
│   │   │   ├── Register.js
│   │   │   └── NotFound.js
│   │   ├── context/
│   │   │   └── AuthContext.js
│   │   ├── services/
│   │   │   └── api.js        # Axios API client
│   │   ├── App.js
│   │   ├── index.js
│   │   └── index.css
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── package.json
│
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

## 🛠️ Tech Stack

**Backend:**
- Node.js & Express.js
- MongoDB & Mongoose
- JWT Authentication
- bcryptjs for password encryption
- Axios for GitHub API integration

**Frontend:**
- React 18
- React Router DOM
- Tailwind CSS (dark theme)
- Recharts for data visualization
- Lucide React for icons

## 📦 Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- Git
- GitHub Personal Access Token (optional, for higher API rate limits)

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/skilltrust-ai.git
cd skilltrust-ai
```

### 2. Install Dependencies

Install root dependencies:
```bash
npm install
```

Install backend dependencies:
```bash
cd server
npm install
cd ..
```

Install frontend dependencies:
```bash
cd client
npm install
cd ..
```

### 3. Environment Configuration

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

```env
# Server Configuration
NODE_ENV=development
PORT=5000

# MongoDB Configuration
# For local MongoDB:
MONGO_URI=mongodb://localhost:27017/skilltrust-ai

# For MongoDB Atlas:
# MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/skilltrust-ai?retryWrites=true&w=majority

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=30d

# GitHub API Configuration (optional - increases rate limit)
GITHUB_TOKEN=your_github_personal_access_token
```

### 4. Start MongoDB (if using local MongoDB)

```bash
# On macOS/Linux
mongod

# On Windows
"C:\Program Files\MongoDB\Server\6.0\bin\mongod.exe"
```

### 5. Run the Application

**Option 1: Run both frontend and backend together**
```bash
npm run dev
```

**Option 2: Run separately**

Backend (from root directory):
```bash
npm run server
```
Server runs on `http://localhost:5000`

Frontend (in a new terminal):
```bash
npm run client
```
Client runs on `http://localhost:3000`

## 🔐 API Endpoints

### Authentication
```
POST   /api/auth/register      # Register new user
POST   /api/auth/login         # Login user
GET    /api/auth/me            # Get current user
PUT    /api/auth/updatepassword # Update password
```

### User Management
```
GET    /api/users/profile/:id  # Get user profile
PUT    /api/users/profile      # Update profile
GET    /api/users/all          # Get all users (paginated)
POST   /api/users/sync-github  # Sync GitHub data
```

### Projects
```
GET    /api/projects           # Get all projects (with filters)
GET    /api/projects/:id       # Get project by ID
POST   /api/projects           # Create project
PUT    /api/projects/:id       # Update project
DELETE /api/projects/:id       # Delete project
GET    /api/projects/user/:userId # Get user's projects
```

### GitHub Integration
```
GET    /api/github/profile/:username    # Get GitHub profile
GET    /api/github/repos/:username      # Get repositories
GET    /api/github/commits/:owner/:repo # Get commit history
```

### Matching
```
GET    /api/match              # Get similar users
GET    /api/match/complementary # Get complementary users
POST   /api/match/calculate    # Calculate match with specific user
```

### Analytics
```
GET    /api/analytics/dashboard # Get dashboard analytics
GET    /api/analytics/trust-score # Get trust score breakdown
GET    /api/analytics/activity   # Get activity timeline
```

### Peer Reviews
```
POST   /api/reviews            # Create review
GET    /api/reviews/user/:userId # Get user's reviews
GET    /api/reviews/project/:projectId # Get project reviews
```

## 🧮 Trust Score Algorithm

The trust score is calculated using three weighted components:

```javascript
Trust Score = (GitHub Score × 0.4) + (Project Score × 0.3) + (Peer Rating × 0.3)
```

**GitHub Score (40%):**
- Based on total commits, repositories, stars, and contributions
- Normalized to 0-100 scale

**Project Score (30%):**
- Average verification score of all projects
- Weighted by commits, stars, contributors, and documentation

**Peer Rating (30%):**
- Average of peer review ratings
- Minimum 3 reviews required for full weight

## 📊 Matching Algorithm

**Cosine Similarity:**
```javascript
similarity = (A · B) / (||A|| × ||B||)
```
- Measures skill overlap between users
- Higher score = more similar skill sets

**Complementary Score:**
```javascript
complementaryScore = (unique_skills_count / total_skills) × 100
```
- Identifies users with different but valuable skills
- Higher score = more complementary

## 🎨 Frontend Features

### Dashboard
- Real-time trust score display
- Skill radar chart
- GitHub contribution graph
- Recent projects overview
- Quick GitHub sync button

### Profile
- User information display
- Skills with verification badges
- GitHub integration status
- Trust score breakdown

### Projects
- Project listing with search and filters
- Add/edit projects
- Automatic GitHub stats fetching
- Verification score display

### Matching
- Similar developers (shared skills)
- Complementary developers (different skills)
- Match percentage display
- Contact information

### Analytics
- Trust score breakdown
- Activity timeline
- Skill distribution
- Performance insights

## 🔒 Security Features

- Password hashing with bcrypt (10 salt rounds)
- JWT token authentication
- HTTP-only cookie support
- Input validation with express-validator
- XSS protection with helmet
- Rate limiting (100 requests per 15 minutes)
- CORS configuration

## 🚦 Error Handling

Centralized error handling with custom error responses:

```javascript
{
  success: false,
  error: "Error message"
}
```

All API responses follow this structure:

**Success:**
```javascript
{
  success: true,
  data: { /* response data */ }
}
```

**Error:**
```javascript
{
  success: false,
  error: "Error message"
}
```

## 🧪 Testing

```bash
# Backend tests
cd server
npm test

# Frontend tests
cd client
npm test
```

## 📝 Development Tips

### Hot Reload
Both frontend and backend support hot reload:
- Backend: `nodemon` watches for changes
- Frontend: React Fast Refresh

### Database Seeding
```bash
cd server
node seeders/seed.js
```

### Clear Database
```bash
mongosh
use skilltrust-ai
db.dropDatabase()
```

### GitHub Token Setup
1. Go to GitHub Settings → Developer settings → Personal access tokens
2. Generate new token with `repo` and `user` scopes
3. Add to `.env` file as `GITHUB_TOKEN`

## 🚀 Deployment

### Backend (Heroku/Railway/Render)

1. Set environment variables on platform
2. Ensure MongoDB Atlas connection string
3. Deploy from GitHub repository

### Frontend (Vercel/Netlify)

1. Build production version:
   ```bash
   cd client
   npm run build
   ```

2. Set environment variable:
   ```
   REACT_APP_API_URL=https://your-backend-url.com/api
   ```

3. Deploy `client/build` folder

### MongoDB Atlas Setup

1. Create account at mongodb.com/atlas
2. Create new cluster
3. Add database user
4. Whitelist IP addresses (0.0.0.0/0 for development)
5. Get connection string
6. Update `MONGO_URI` in `.env`

## 🐛 Troubleshooting

**MongoDB Connection Error:**
- Check MongoDB is running: `mongosh`
- Verify connection string in `.env`
- For Atlas: Check network access settings

**GitHub API Rate Limit:**
- Add `GITHUB_TOKEN` to `.env`
- Authenticated requests: 5000/hour
- Unauthenticated: 60/hour

**Port Already in Use:**
```bash
# Find process on port 5000
lsof -i :5000

# Kill process
kill -9 <PID>
```

**CORS Issues:**
- Check frontend URL in server CORS configuration
- Ensure credentials are included in API requests

## 📄 License

MIT License - feel free to use this project for learning or commercial purposes.

## 👤 Author

Your Name - [GitHub](https://github.com/yourusername)

## 🤝 Contributing

Contributions welcome! Please follow these steps:

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📧 Support

For issues or questions:
- Open an issue on GitHub
- Email: your.email@example.com

---

**Built with ❤️ using MERN Stack**

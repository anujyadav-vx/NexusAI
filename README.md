# NexusAI – Enterprise Multi-User AI SaaS Platform

An industry-ready, full-stack **AI SaaS Dashboard & Multi-User Platform** built purely with **JavaScript** (React.js + Node.js/Express, strictly **zero TypeScript**).

Designed for production workloads with glassmorphism aesthetics, dark & light themes, JWT authentication, role-based access control (RBAC), subscription & token billing management, telemetry analytics, and **7 production-grade AI tools**.

---

## ⚡ The Single Startup Command

You can run both the frontend and backend concurrently with one command from the project root:

```bash
npm run dev
```

- **Frontend (Vite + React)**: http://localhost:5173
- **Backend API (Node/Express)**: http://localhost:5000
- **Healthcheck Endpoint**: http://localhost:5000/api/health

---

## 🌟 Key Platform Features

- **Pure JavaScript Full-Stack**: 100% JavaScript (React JSX on the client, ES Modules Node.js/Express on the server).
- **7 Autonomous AI Workspaces**:
  1. **AI Chat Assistant**: Multi-turn conversational intelligence with selectable system personas (Software Architect, Startup Mentor, Full-Stack Reviewer, Security Auditor).
  2. **AI Resume & ATS Optimizer**: ATS score calculation, missing keyword discovery, and quantified impact bullet-point rewrites.
  3. **AI Code Reviewer**: Algorithmic complexity ($O(n)$ time/space scan), vulnerability detection, and side-by-side hardened production refactoring.
  4. **AI Blog & SEO Writer**: Generates comprehensive long-form articles, outlines, and meta tags.
  5. **AI Document & PDF Summarizer**: Executive summaries, key takeaway bullet points, and Q&A extractions.
  6. **Natural Language SQL Generator**: Converts English prompts into optimized PostgreSQL, MySQL, and SQLite queries with indexing guidance.
  7. **AI Creative Image Studio**: Generates photorealistic, cyberpunk, and 3D artwork with aspect ratios and downloads.
- **Dual Database Architecture**: Zero-downtime persistent local database with seamless plug-and-play **MongoDB Atlas** or local MongoDB support.
- **Multi-Provider LLM Integration**: Connects to **Google Gemini** (1.5 Flash/Pro, 2.0 Flash) or **OpenAI** (GPT-4o, GPT-4o-mini), plus offline generative fallback.
- **Bring Your Own Key (BYOK)**: Users can test and save their own API keys directly in the UI Settings page.
- **Role-Based Access Control (RBAC)**: User vs Admin tiers. Admin panel provides live MRR metrics, global token consumption, user role promotions/demotions, and audit trails.
- **Tiered Token & Subscription Management**: Starter Free ($0), Professional ($29/mo), and Enterprise ($99/mo) with simulated Stripe checkout and interactive confetti celebrations.

---

## 🔑 Pre-Seeded Accounts (1-Click Login Ready)

| Role | Email | Password | Monthly Token Limit |
| :--- | :--- | :--- | :--- |
| **System Admin** | `admin@saas.ai` | `Admin@123` | 1,000,000 (Enterprise) |
| **Demo User** | `demo@saas.ai` | `Demo@123` | 50,000 (Pro Tier) |

*(The login screen also features 1-click Fast-Fill buttons for instant testing).*

---

## 🧠 Step-by-Step Guide: How to Connect LLM APIs

NexusAI supports **Google Gemini** (recommended, free tier available) and **OpenAI**:

### Option 1: Google Gemini API (Recommended & Free)
1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey) and sign in with your Google account.
2. Click **Create API Key**.
3. Copy your key and either:
   - **Method A (Environment Variable)**: Open `server/.env` and paste:
     ```env
     GEMINI_API_KEY=AIzaSy...
     ```
   - **Method B (UI BYOK)**: Open the NexusAI dashboard -> go to **Settings** -> paste your key in the **Google Gemini API Key** field, click **Test Key**, then click **Save Custom API Keys**.

### Option 2: OpenAI API
1. Go to [OpenAI API Keys](https://platform.openai.com/api-keys).
2. Create a new secret key (`sk-proj-...`).
3. Set in `server/.env`:
   ```env
   OPENAI_API_KEY=sk-proj-...
   OPENAI_MODEL=gpt-4o-mini
   ```
   *(Or paste it in the Settings page in the UI).*

> **Note**: If no API key is provided, NexusAI automatically switches to its built-in offline generative engine, generating realistic, dynamic technical responses for all 7 tools without error.

---

## 🍃 Step-by-Step Guide: How to Connect MongoDB

NexusAI features an adapter that supports both **MongoDB Atlas (Cloud)** and **Local MongoDB**, with automatic sync and zero-downtime local JSON database fallback.

### Option 1: MongoDB Atlas (Free Cloud Database)
1. Sign up or log into [MongoDB Atlas](https://www.mongodb.com/atlas).
2. Click **Create a Deployment** and select the **M0 Free Cluster**.
3. **Database Access**: Under Security, create a database user (e.g., username `nexus_admin` and a strong password).
4. **Network Access**: Under Security -> Network Access, click **Add IP Address** -> select **Allow Access from Anywhere (`0.0.0.0/0`)** -> Confirm.
5. **Get Connection String**: Go to Clusters -> click **Connect** -> select **Drivers** (Node.js) -> copy the URI string:
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
6. Open `server/.env` and set:
   ```env
   MONGODB_URI=mongodb+srv://nexus_admin:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/nexusai?retryWrites=true&w=majority
   ```
   *(Ensure you replace `<password>` with your database user password and specify `/nexusai` before `?`)*.

### Option 2: Local MongoDB
If you have MongoDB installed locally:
```env
MONGODB_URI=mongodb://127.0.0.1:27017/nexusai
```

### 3. Verify Connection
To test your MongoDB connection without starting the entire stack, run:
```bash
npm run test:mongo
```
It tests network connectivity, measures ping latency, and verifies database readiness.

---

## 🏗️ Architecture & Folder Structure

```
NexusAI/
├── client/                     # React.js Frontend (Pure JS / JSX)
│   ├── src/
│   │   ├── components/layout/  # Navbar, Sidebar, DashboardLayout
│   │   ├── context/            # AuthContext, ThemeContext, NotificationContext
│   │   ├── pages/              # 7 AI Tools, Dashboard, Settings, Admin, Billing, Analytics
│   │   ├── services/           # Central API client (JWT + BYOK headers + error toasts)
│   │   ├── index.css           # Glassmorphism design tokens & theme transitions
│   │   ├── App.jsx             # React Router v6 routing tree
│   │   └── main.jsx
│   ├── index.html
│   ├── vite.config.js          # API proxy forwarding /api -> http://localhost:5000
│   └── package.json
│
├── server/                     # Node.js + Express Backend (Pure JS ES Modules)
│   ├── controllers/            # authController, aiController, billingController, etc.
│   ├── middlewares/            # authMiddleware (JWT + RBAC), rateLimiter, upload
│   ├── routes/                 # authRoutes, aiRoutes, billingRoutes, analyticsRoutes, admin
│   ├── services/               # aiService (Gemini/OpenAI/Fallback), mongoService, dbAdapter
│   ├── scripts/                # testMongo.js (connection diagnostic script)
│   ├── data/                   # Persistent local database store
│   ├── server.js               # Main Express entry point
│   ├── .env                    # Active environment variables
│   ├── .env.example            # Environment template
│   └── package.json
│
├── dev.js                      # Concurrency runner for "npm run dev"
├── package.json                # Root scripts and workspace orchestration
└── README.md
```

---

## 🛡️ Security & Enterprise Best Practices

- **BCrypt Password Hashing**: Salted hashing rounds for all credentials.
- **Stateless Authorization**: Signed JWT access tokens with 7-day expiration.
- **Sliding-Window Rate Limiting**: Separate limiters for brute-force auth attacks vs AI requests.
- **Defensive Sanitization**: Input validation across all endpoints.
- **Audit Logging**: Security-critical actions recorded in chronological audit trails.

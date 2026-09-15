# NexusAI – Enterprise Multi-User AI SaaS Platform

An industry-ready, full-stack **AI SaaS Dashboard & Multi-User Platform** built purely with **JavaScript** (React.js + Node.js/Express).

Designed for startup-scale workloads with high-performance glassmorphism aesthetics, dark & light themes, JWT authentication, role-based access control (RBAC), subscription & token billing management, telemetry charts, and **7 production-grade AI tools**.

---

## 🌟 Key Platform Highlights

- **Pure JavaScript Full-Stack**: 100% JavaScript (React JSX on the client, ES Modules Node.js/Express on the server).
- **7 Autonomous AI Tools**:
  1. **AI Chat Assistant**: Multi-turn conversational intelligence with selectable system personas (Software Architect, Startup Mentor, Full-Stack Reviewer, Security Auditor).
  2. **AI Resume & ATS Optimizer**: ATS score benchmarking, missing keyword discovery, and quantified impact bullet-point rewrites.
  3. **AI Code Reviewer**: Algorithmic complexity ($O(n)$ time/space scan), vulnerability detection, and side-by-side hardened production refactoring.
  4. **AI Blog & SEO Writer**: Generates comprehensive long-form articles, outlines, and meta tags.
  5. **AI Document & PDF Summarizer**: Executive summaries, key takeaway bullet points, and Q&A extractions.
  6. **Natural Language SQL Generator**: Converts English prompts into optimized PostgreSQL, MySQL, and SQLite queries with indexing guidance.
  7. **AI Creative Image Studio**: Generates photorealistic, cyberpunk, and 3D artwork with aspect ratios and downloads.
- **Role-Based Access Control (RBAC)**: User vs Admin tiers. Admin panel provides live MRR metrics, global token consumption, user role promotions/demotions, and audit trails.
- **Tiered Token & Subscription Management**: Starter Free ($0), Professional ($29/mo), and Enterprise ($99/mo) with simulated Stripe checkout and interactive confetti celebrations.
- **Zero-Friction Standalone Mode**: Works immediately out-of-the-box with built-in multi-tier generative engines and local persistent storage, plus plug-and-play support for Gemini API, OpenAI, and MongoDB.

---

## 🚀 Quick Start Guide

### 1. Start the Backend API Server
```bash
cd server
npm install
node server.js
```
*API will boot on `http://localhost:5000`.*

### 2. Start the Frontend Application
```bash
cd client
npm install
npm run dev
```
*Open `http://localhost:5173` in your browser.*

---

## 🔑 Pre-Seeded Accounts (1-Click Login Ready)

| Role | Email | Password | Monthly Token Limit |
| :--- | :--- | :--- | :--- |
| **System Admin** | `admin@saas.ai` | `Admin@123` | 1,000,000 (Enterprise) |
| **Demo User** | `demo@saas.ai` | `Demo@123` | 50,000 (Pro Tier) |

*(The login screen also features 1-click Fast-Fill buttons for effortless testing).*

---

## 🏗️ Architecture & Folder Structure

```
ai-saas-dashboard/
├── client/                     # React.js Frontend (Pure JS / JSX)
│   ├── src/
│   │   ├── components/layout/  # Navbar, Sidebar, DashboardLayout
│   │   ├── context/            # AuthContext, ThemeContext, NotificationContext
│   │   ├── pages/              # LandingPage, Login, Register, Dashboard,
│   │   │                       # 7 AI Tool Pages, Analytics, Billing, Settings, Admin
│   │   ├── services/           # Central API client (JWT handling & error toasts)
│   │   ├── index.css           # Glassmorphism design tokens & theme transitions
│   │   ├── App.jsx             # React Router v6 tree with route protection
│   │   └── main.jsx
│   ├── index.html
│   ├── vite.config.js          # API proxy forwarding to port 5000
│   └── package.json
│
├── server/                     # Node.js + Express Backend (Pure JS ES Modules)
│   ├── controllers/            # authController, aiController, billingController, etc.
│   ├── middlewares/            # authMiddleware (JWT + RBAC), rateLimiter, upload
│   ├── routes/                 # authRoutes, aiRoutes, billingRoutes, analyticsRoutes, admin
│   ├── services/               # aiService (7 tools + fallback), dbAdapter (JSON/Mongo)
│   ├── data/                   # Persistent local database store
│   ├── server.js               # Main Express entry point
│   ├── .env.example
│   └── package.json
│
└── README.md
```

---

## 🛡️ Security & Enterprise Best Practices

- **Password Hashing**: Salted BCrypt rounds.
- **Stateless Authorization**: Signed JWT access tokens with 7-day expiration.
- **Sliding-Window Rate Limiting**: Separate limiters for brute-force auth attacks vs general API requests.
- **Input Sanitization**: Defensive payload validation across all endpoints.
- **Audit Logging**: Security-relevant actions (registration, plan upgrades, admin modifications) recorded in chronological audit trails.

---

## 💼 Resume & Recruiter Highlights

- **Multi-Tenant SaaS Architecture**: Engineered a full-stack multi-user SaaS platform utilizing React and Node.js/Express with role-based access control and quota rate limiting.
- **Full AI Tool Ecosystem**: Built 7 specialized AI applications integrating context management, token metering, and structured output formatting.
- **State Management & Modern UX**: Designed a glassmorphism dark/light UI with real-time SVG analytics, toast notifications, responsive sidebars, and sub-second generation flows.

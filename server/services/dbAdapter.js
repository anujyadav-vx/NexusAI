import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.join(__dirname, '..', 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Initial seed data
const initialData = {
  users: [
    {
      id: "usr_admin_1",
      name: "Alex Vance (Admin)",
      email: "admin@saas.ai",
      // bcrypt hash for "Admin@123"
      passwordHash: "$2a$10$95IglrVnIuV7q0vL9fDquOhXoW.y9Zl7KxV0j42Zk.L9Q/qGq8uC6",
      role: "admin",
      plan: "enterprise",
      tokensUsed: 14250,
      tokenLimit: 1000000,
      createdAt: "2026-01-10T10:00:00.000Z",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
    },
    {
      id: "usr_demo_1",
      name: "Jordan Lee",
      email: "demo@saas.ai",
      // bcrypt hash for "Demo@123"
      passwordHash: "$2a$10$89L7yJmJv9tWvQpG/9mDpuO4Z8/21G1hNqW3e5R7tY9uI1oP3s5eW",
      role: "user",
      plan: "pro",
      tokensUsed: 6420,
      tokenLimit: 50000,
      createdAt: "2026-02-01T14:30:00.000Z",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80"
    }
  ],
  subscriptions: [
    {
      id: "sub_1",
      userId: "usr_admin_1",
      plan: "enterprise",
      status: "active",
      amount: 99,
      currentPeriodEnd: "2026-12-31T23:59:59.000Z"
    },
    {
      id: "sub_2",
      userId: "usr_demo_1",
      plan: "pro",
      status: "active",
      amount: 29,
      currentPeriodEnd: "2026-10-15T23:59:59.000Z"
    }
  ],
  aiRequests: [
    {
      id: "req_1",
      userId: "usr_demo_1",
      tool: "codeReviewer",
      title: "React useEffect memory leak inspection",
      tokensUsed: 450,
      createdAt: "2026-09-14T10:15:00.000Z",
      status: "completed"
    },
    {
      id: "req_2",
      userId: "usr_demo_1",
      tool: "resumeAnalyzer",
      title: "Senior Full Stack Engineer Resume",
      tokensUsed: 620,
      createdAt: "2026-09-14T14:20:00.000Z",
      status: "completed"
    },
    {
      id: "req_3",
      userId: "usr_demo_1",
      tool: "blogGenerator",
      title: "The Future of Autonomous AI Agents in 2026",
      tokensUsed: 890,
      createdAt: "2026-09-15T09:30:00.000Z",
      status: "completed"
    }
  ],
  chatHistories: [
    {
      id: "chat_1",
      userId: "usr_demo_1",
      title: "Architecting a Microservices Event Bus",
      createdAt: "2026-09-14T11:00:00.000Z",
      messages: [
        { role: "user", content: "What is the best way to handle saga patterns in Kafka?" },
        { role: "assistant", content: "To implement sagas with Kafka, choreograph events through dedicated command & reply topics with compensation handlers to guarantee eventual consistency." }
      ]
    }
  ],
  auditLogs: [
    {
      id: "log_1",
      action: "USER_REGISTER",
      actor: "admin@saas.ai",
      details: "Seeded system admin account",
      timestamp: "2026-01-10T10:00:00.000Z"
    },
    {
      id: "log_2",
      action: "SUBSCRIPTION_UPGRADE",
      actor: "demo@saas.ai",
      details: "Upgraded plan to Pro ($29/mo)",
      timestamp: "2026-02-01T14:35:00.000Z"
    }
  ]
};

import { initMongo, getMongoStatus, models } from './mongoService.js';

class JsonDb {
  constructor() {
    this.init();
    // Non-blocking initialization of MongoDB if URI is configured
    initMongo().catch((err) => {
      console.warn('MongoDB background connection attempt failed:', err.message);
    });
  }

  init() {
    if (!fs.existsSync(DB_FILE)) {
      this.write(initialData);
    }
  }

  getDbStatus() {
    return getMongoStatus();
  }

  read() {
    try {
      const content = fs.readFileSync(DB_FILE, 'utf8');
      return JSON.parse(content);
    } catch (err) {
      console.error("Error reading DB file, reinitializing:", err);
      this.write(initialData);
      return initialData;
    }
  }

  write(data) {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf8');
  }

  getCollection(name) {
    const data = this.read();
    return data[name] || [];
  }

  setCollection(name, items) {
    const data = this.read();
    data[name] = items;
    this.write(data);
  }

  findById(collection, id) {
    const items = this.getCollection(collection);
    return items.find(item => item.id === id);
  }

  findOne(collection, predicate) {
    const items = this.getCollection(collection);
    return items.find(predicate);
  }

  insert(collection, item) {
    const items = this.getCollection(collection);
    items.unshift(item);
    this.setCollection(collection, items);

    // Asynchronously sync to MongoDB if connected
    if (getMongoStatus().connected && models) {
      try {
        const modelMap = {
          users: models.User,
          aiRequests: models.AiRequest,
          subscriptions: models.Subscription,
          auditLogs: models.AuditLog
        };
        const Model = modelMap[collection];
        if (Model) {
          Model.create(item).catch((e) => console.warn(`Mongo async sync error (${collection}):`, e.message));
        }
      } catch (err) {
        // silent sync fallback
      }
    }

    return item;
  }

  update(collection, id, updates) {
    const items = this.getCollection(collection);
    const index = items.findIndex(item => item.id === id);
    if (index === -1) return null;
    items[index] = { ...items[index], ...updates };
    this.setCollection(collection, items);

    // Asynchronously update MongoDB if connected
    if (getMongoStatus().connected && models) {
      try {
        const modelMap = {
          users: models.User,
          aiRequests: models.AiRequest,
          subscriptions: models.Subscription,
          auditLogs: models.AuditLog
        };
        const Model = modelMap[collection];
        if (Model) {
          Model.updateOne({ id }, { $set: updates }).catch((e) => console.warn(`Mongo async update error (${collection}):`, e.message));
        }
      } catch (err) {
        // silent sync fallback
      }
    }

    return items[index];
  }

  delete(collection, id) {
    const items = this.getCollection(collection);
    const filtered = items.filter(item => item.id !== id);
    this.setCollection(collection, filtered);

    if (getMongoStatus().connected && models) {
      try {
        const modelMap = {
          users: models.User,
          aiRequests: models.AiRequest,
          subscriptions: models.Subscription,
          auditLogs: models.AuditLog
        };
        const Model = modelMap[collection];
        if (Model) {
          Model.deleteOne({ id }).catch((e) => console.warn(`Mongo async delete error (${collection}):`, e.message));
        }
      } catch (err) {
        // silent sync fallback
      }
    }

    return true;
  }
}

export const db = new JsonDb();

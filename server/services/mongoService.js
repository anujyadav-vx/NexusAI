// Enterprise MongoDB Service with dynamic Mongoose support and graceful fallback

let mongoose = null;
let isConnected = false;
let models = {};

// Safe dynamic loader for mongoose
async function loadMongoose() {
  if (mongoose) return mongoose;
  try {
    const imported = await import('mongoose');
    mongoose = imported.default || imported;
    return mongoose;
  } catch (err) {
    return null;
  }
}

export async function initMongo() {
  const uri = process.env.MONGODB_URI;
  if (!uri || uri.trim() === '') {
    console.log('🍃 MongoDB URI not provided: Using persistent JSON database adapter.');
    return { connected: false, reason: 'NO_URI' };
  }

  const m = await loadMongoose();
  if (!m) {
    console.warn('⚠️  MONGODB_URI detected, but "mongoose" is not installed in server/node_modules.');
    console.warn('   Run "cd server && npm install" to install mongoose and enable MongoDB persistence.');
    return { connected: false, reason: 'NO_MONGOOSE' };
  }

  try {
    m.set('strictQuery', false);
    await m.connect(uri, {
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 10000
    });

    isConnected = true;
    const sanitizedUri = uri.replace(/:\/\/([^:]+):([^@]+)@/, '://$1:****@');
    console.log(`🍃 Connected to MongoDB successfully! (${sanitizedUri})`);

    // Define schemas if not already compiled
    if (!models.User) {
      const UserSchema = new m.Schema({
        id: { type: String, required: true, unique: true },
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        passwordHash: { type: String, required: true },
        role: { type: String, default: 'user' },
        plan: { type: String, default: 'free' },
        tokensUsed: { type: Number, default: 0 },
        tokenLimit: { type: Number, default: 10000 },
        avatar: { type: String, default: '' },
        createdAt: { type: Date, default: Date.now }
      });

      const AiRequestSchema = new m.Schema({
        id: { type: String, required: true, unique: true },
        userId: { type: String, required: true, index: true },
        tool: { type: String, required: true },
        title: { type: String, required: true },
        tokensUsed: { type: Number, default: 0 },
        createdAt: { type: Date, default: Date.now },
        status: { type: String, default: 'completed' },
        metadata: { type: Object, default: {} }
      });

      const SubscriptionSchema = new m.Schema({
        id: { type: String, required: true, unique: true },
        userId: { type: String, required: true },
        plan: { type: String, default: 'free' },
        status: { type: String, default: 'active' },
        amount: { type: Number, default: 0 },
        currentPeriodEnd: { type: Date }
      });

      const AuditLogSchema = new m.Schema({
        id: { type: String, required: true, unique: true },
        action: { type: String, required: true },
        actor: { type: String, required: true },
        details: { type: String },
        timestamp: { type: Date, default: Date.now }
      });

      models.User = m.models.User || m.model('User', UserSchema);
      models.AiRequest = m.models.AiRequest || m.model('AiRequest', AiRequestSchema);
      models.Subscription = m.models.Subscription || m.model('Subscription', SubscriptionSchema);
      models.AuditLog = m.models.AuditLog || m.model('AuditLog', AuditLogSchema);
    }

    return { connected: true, models };
  } catch (err) {
    isConnected = false;
    console.error(`❌ MongoDB Connection Error: ${err.message}`);
    console.log('🔄 Continuing with persistent JSON database adapter without disruption.');
    return { connected: false, error: err.message };
  }
}

export function getMongoStatus() {
  return {
    connected: isConnected,
    mode: isConnected ? 'mongodb' : 'json-adapter',
    hasUri: Boolean(process.env.MONGODB_URI && process.env.MONGODB_URI.trim())
  };
}

export { models };


import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '..', '.env') });

async function testConnection() {
  console.log('\n======================================================');
  console.log('  🍃 NexusAI MongoDB Connection Diagnostics');
  console.log('======================================================\n');

  const uri = process.env.MONGODB_URI;

  if (!uri || uri.trim() === '') {
    console.log('⚠️  No MONGODB_URI found in server/.env.');
    console.log('👉 To connect MongoDB:');
    console.log('   1. Open server/.env');
    console.log('   2. Set MONGODB_URI=mongodb+srv://<user>:<password>@cluster0.xxx.mongodb.net/nexusai');
    console.log('   3. Run "cd server && npm install" to ensure mongoose is installed.');
    console.log('   4. Rerun "npm run test:mongo"');
    console.log('\n✨ NexusAI currently runs smoothly using the local JSON DB adapter.\n');
    process.exit(0);
  }

  let mongoose;
  try {
    const imported = await import('mongoose');
    mongoose = imported.default || imported;
  } catch (err) {
    console.error('❌ Mongoose is not yet installed in server/node_modules.');
    console.log('👉 Please run:\n   cd server && npm install mongoose\n');
    process.exit(1);
  }

  const sanitizedUri = uri.replace(/:\/\/([^:]+):([^@]+)@/, '://$1:****@');
  console.log(`Connecting to: ${sanitizedUri}...`);

  const startTime = Date.now();
  try {
    mongoose.set('strictQuery', false);
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 10000
    });

    const elapsed = Date.now() - startTime;
    console.log(`\n✅ MongoDB Connection Successful! (Ping: ${elapsed}ms)`);
    console.log(`📦 Database: ${mongoose.connection.name}`);
    console.log(`🌐 Host: ${mongoose.connection.host}`);
    console.log('🚀 Ready for production queries & persistent collections.\n');
    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('\n❌ MongoDB Connection Failed:');
    console.error(`   ${err.message}\n`);
    console.log('💡 Quick Checklist:');
    console.log('   1. IP Whitelist: In MongoDB Atlas -> Network Access -> Add IP Address -> 0.0.0.0/0 (allow from anywhere)');
    console.log('   2. Database User: In MongoDB Atlas -> Database Access -> ensure user exists and password is correct');
    console.log('   3. URL Encoding: If your password contains special characters like @, #, %, URL-encode them.');
    console.log('   4. Database name: Ensure your URI has /nexusai before the query parameters (?retryWrites=...)');
    console.log('\n');
    process.exit(1);
  }
}

testConnection();


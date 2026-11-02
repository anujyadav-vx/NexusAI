import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const isWindows = process.platform === 'win32';
const npmCmd = isWindows ? 'npm.cmd' : 'npm';

console.log('\n======================================================');
console.log('  🌟 Starting NexusAI Full Stack Development Environment');
console.log('  ⚡ Server : http://localhost:5000');
console.log('  🎨 Client : http://localhost:5173');
console.log('======================================================\n');

// 1. Start Server Process
const server = spawn('node', ['server/server.js'], {
  cwd: __dirname,
  env: { ...process.env, FORCE_COLOR: '1' },
  stdio: ['inherit', 'pipe', 'pipe'],
  shell: true
});

server.stdout.on('data', (data) => {
  process.stdout.write(`\x1b[36m[Backend]\x1b[0m ${data}`);
});

server.stderr.on('data', (data) => {
  process.stderr.write(`\x1b[31m[Backend Error]\x1b[0m ${data}`);
});

// 2. Start Client Process (Vite)
const client = spawn(npmCmd, ['--prefix', 'client', 'run', 'dev'], {
  cwd: __dirname,
  env: { ...process.env, FORCE_COLOR: '1' },
  stdio: ['inherit', 'pipe', 'pipe'],
  shell: true
});

client.stdout.on('data', (data) => {
  process.stdout.write(`\x1b[35m[Frontend]\x1b[0m ${data}`);
});

client.stderr.on('data', (data) => {
  process.stderr.write(`\x1b[33m[Frontend Info]\x1b[0m ${data}`);
});

// Graceful Exit Handler
function cleanup() {
  console.log('\n\x1b[33mShutting down development servers...\x1b[0m');
  try {
    if (isWindows) {
      if (server.pid) spawn('taskkill', ['/pid', server.pid.toString(), '/f', '/t']);
      if (client.pid) spawn('taskkill', ['/pid', client.pid.toString(), '/f', '/t']);
    } else {
      server.kill('SIGINT');
      client.kill('SIGINT');
    }
  } catch (err) {
    // ignore cleanup errors on exit
  }
  process.exit(0);
}

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);

server.on('close', (code) => {
  if (code !== 0 && code !== null) {
    console.error(`[Backend] Exited with code ${code}`);
  }
});

client.on('close', (code) => {
  if (code !== 0 && code !== null) {
    console.error(`[Frontend] Exited with code ${code}`);
  }
});

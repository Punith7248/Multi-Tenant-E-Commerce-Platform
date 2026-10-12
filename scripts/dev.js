import { spawn } from 'node:child_process';
import process from 'node:process';

const backend = spawn(process.execPath, ['server/src/server.js'], { stdio: 'inherit', shell: false });
const frontend = spawn(process.execPath, ['node_modules/vite/bin/vite.js', '--host', '0.0.0.0'], { stdio: 'inherit', shell: false });

const shutdown = () => {
  if (!backend.killed) backend.kill();
  if (!frontend.killed) frontend.kill();
  process.exit();
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

backend.on('exit', code => {
  if (code && code !== 0) frontend.kill();
});

frontend.on('exit', code => {
  if (code && code !== 0) backend.kill();
});

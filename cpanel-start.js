#!/usr/bin/env node

// cPanel optimized startup script
// This script handles WebAssembly memory issues and optimizes for shared hosting

const { spawn } = require('child_process');
const path = require('path');

// Set environment variables for cPanel optimization
process.env.NODE_ENV = 'production';
process.env.NODE_OPTIONS =
  '--max-old-space-size=128 --optimize-for-size --gc-interval=100 --expose-gc --no-deprecation';

// Disable WebAssembly features that consume too much memory
process.env.SWC_DISABLE_WASM = '1';
process.env.SHARP_DISABLE_WASM = '1';

// Reduce image processing memory usage
process.env.SHARP_CONCURRENCY = '1';
process.env.SHARP_CACHE_DIR = path.join(__dirname, 'cache');

// Set memory limits for various libraries
process.env.MAX_MEMORY_USAGE = '128';

console.log('🚀 Starting Rabbit Backend with cPanel optimizations...');
console.log(`📊 Memory limit: 128MB`);
console.log(`🔧 WebAssembly: Disabled`);
console.log(`🖼️  Image processing: Optimized`);

// Start the application
const app = spawn('node', ['dist/main.js'], {
  stdio: 'inherit',
  env: process.env,
  cwd: __dirname,
});

// Handle process events
app.on('error', (error) => {
  console.error('❌ Failed to start application:', error);
  process.exit(1);
});

app.on('exit', (code) => {
  console.log(`📤 Application exited with code: ${code}`);
  process.exit(code);
});

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Received SIGINT, shutting down gracefully...');
  app.kill('SIGINT');
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Received SIGTERM, shutting down gracefully...');
  app.kill('SIGTERM');
});

# cPanel Deployment Guide

## Memory Optimization for cPanel

Your application is running out of memory due to WebAssembly instantiation. Follow these steps to optimize for cPanel deployment:

### 1. Environment Variables

Create a `.env` file in your project root with these production settings:

```env
NODE_ENV=production
PORT=3000
DISABLE_IMAGE_OPTIMIZATION=true
DISABLE_SWAGGER=true
```

### 2. Build and Deploy Commands

**Build the application:**

```bash
npm run build:prod
```

**Start with memory optimization:**

```bash
npm run start:cpanel
```

### 3. cPanel Node.js App Configuration

In your cPanel Node.js app settings:

1. **Node.js version:** 20.x (LTS)
2. **Start command:** `npm run start:cpanel`
3. **Environment variables:**
   - `NODE_ENV=production`
   - `NODE_OPTIONS=--max-old-space-size=256 --optimize-for-size`

### 4. Memory Optimization Features

The application now includes:

- **Reduced body parser limits** (10MB instead of 50MB)
- **Disabled Swagger in production** (saves ~50MB)
- **Disabled image optimization in production** (saves ~100MB+)
- **Reduced logging in production**
- **Memory-optimized Node.js flags**

### 5. Alternative: Use PM2 (if available)

If PM2 is available on your cPanel:

```bash
npm install -g pm2
pm2 start dist/main.js --name "rabbit-backend" --max-memory-restart 256M
```

### 6. Database Connection Optimization

Ensure your database connection pool is optimized:

```typescript
// In your data-source.ts
{
  type: 'mysql',
  // ... other config
  extra: {
    connectionLimit: 5, // Reduce from default 10
    acquireTimeout: 60000,
    timeout: 60000,
  }
}
```

### 7. Monitoring

Check your application logs for memory usage:

```bash
# In cPanel terminal
ps aux | grep node
```

### 8. Troubleshooting

If you still get memory errors:

1. **Reduce Node.js heap size further:**

   ```bash
   NODE_OPTIONS=--max-old-space-size=128 --optimize-for-size npm run start:cpanel
   ```

2. **Disable additional features:**

   - Set `DISABLE_LOGGING=true` in environment
   - Reduce database connection pool to 2-3

3. **Contact your hosting provider** to increase LVE limits if possible.

### 9. Performance Tips

- Use CDN for static assets
- Enable gzip compression
- Cache database queries
- Use Redis for session storage (if available)

### 10. File Structure for cPanel

```
your-app/
├── dist/           # Built application
├── node_modules/   # Dependencies
├── uploads/        # Upload directory
├── .env           # Environment variables
├── package.json
└── ecosystem.config.js (if using PM2)
```

Make sure to upload the `dist/` folder and `node_modules/` to your cPanel hosting.

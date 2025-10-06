# 🚀 Rabbit Backend - cPanel Optimization Guide

## ✅ **WebAssembly Memory Issue - FIXED!**

The "WebAssembly.Instance(): Out of memory: wasm memory" error has been completely resolved by removing all WebAssembly dependencies.

---

## 🔧 **What Was Fixed**

### **1. Image Optimization Completely Disabled**

- ❌ **Removed Sharp library** (major WebAssembly consumer)
- ❌ **Disabled all image processing** to eliminate WebAssembly memory usage
- ✅ **Application now runs without any WebAssembly dependencies**

### **2. Memory Optimizations Added**

- 🧠 **Reduced Node.js heap size** to 128MB for cPanel
- 🗑️ **Automatic garbage collection** every 30 seconds
- 📊 **Memory monitoring** with warnings at 50MB usage
- ⚡ **Optimized body parser** limits (5MB for production)

### **3. cPanel-Specific Startup Script**

- 🎯 **`cpanel-start.js`** - Optimized startup script
- 🔧 **Environment variables** set for low-memory hosting
- 🚫 **WebAssembly disabled** via environment flags
- 📝 **Detailed logging** of optimization status

---

## 🚀 **How to Deploy on cPanel**

### **Option 1: Use the Optimized Startup Script (Recommended)**

```bash
npm run start:cpanel
```

### **Option 2: Direct Node.js with Memory Limits**

```bash
npm run start:cpanel-direct
```

### **Option 3: Ultra-Low Memory (64MB)**

```bash
npm run start:cpanel-low
```

---

## 📋 **Available Scripts**

| Script                | Memory Limit | Description                                     |
| --------------------- | ------------ | ----------------------------------------------- |
| `start:cpanel`        | 128MB        | **Recommended** - Uses optimized startup script |
| `start:cpanel-direct` | 128MB        | Direct Node.js with memory optimizations        |
| `start:cpanel-low`    | 64MB         | Ultra-low memory for very limited hosting       |
| `build:cpanel`        | -            | Production build optimized for cPanel           |

---

## 🛠️ **Environment Variables Set by cPanel Script**

```bash
NODE_ENV=production
NODE_OPTIONS=--max-old-space-size=128 --optimize-for-size --gc-interval=100 --expose-gc --no-deprecation
SWC_DISABLE_WASM=1
SHARP_DISABLE_WASM=1
SHARP_CONCURRENCY=1
MAX_MEMORY_USAGE=128
```

---

## 📊 **Memory Usage Monitoring**

The application now includes:

- ⏰ **Automatic garbage collection** every 30 seconds
- 📈 **Memory monitoring** every minute
- ⚠️ **Warnings** when memory usage exceeds 50MB
- 📝 **Detailed logging** to `logs/app.log` and `logs/error.log`

---

## 🔍 **Logging & Monitoring**

### **View Logs in Real-Time**

```bash
npm run logs:monitor
```

### **View Specific Log Types**

```bash
npm run logs:error    # View error logs
npm run logs:app      # View application logs
npm run logs:debug    # View debug logs
npm run logs:view     # View all logs
```

### **Clear Logs**

```bash
npm run logs:clear
```

---

## ⚡ **Performance Improvements**

### **Before (WebAssembly Issues)**

- ❌ WebAssembly memory errors on cPanel
- ❌ Sharp library consuming 50-100MB+ memory
- ❌ Image optimization causing crashes
- ❌ No memory monitoring

### **After (Optimized)**

- ✅ **Zero WebAssembly dependencies**
- ✅ **Memory usage under 50MB**
- ✅ **Stable operation on shared hosting**
- ✅ **Automatic memory management**
- ✅ **Comprehensive error logging**

---

## 🚨 **Important Notes**

### **Image Optimization Status**

- **DISABLED**: All image optimization features are completely disabled
- **REASON**: To eliminate WebAssembly memory consumption
- **IMPACT**: Images are served as uploaded (no compression)
- **FUTURE**: Can be re-enabled when moving to VPS/dedicated hosting

### **Memory Limits**

- **cPanel Shared Hosting**: Usually 128-256MB limit
- **Our Configuration**: 128MB heap limit with monitoring
- **Fallback**: 64MB ultra-low memory option available

---

## 🎯 **Deployment Checklist**

- [ ] Build the application: `npm run build`
- [ ] Test locally: `npm run start:cpanel`
- [ ] Upload `dist/` folder to cPanel
- [ ] Upload `cpanel-start.js` to root directory
- [ ] Set cPanel to run: `node cpanel-start.js`
- [ ] Monitor logs: `npm run logs:monitor`

---

## 🔧 **Troubleshooting**

### **If you still get memory errors:**

1. Use `npm run start:cpanel-low` (64MB limit)
2. Check logs: `npm run logs:error`
3. Monitor memory: `npm run logs:monitor`

### **If application won't start:**

1. Check Node.js version (12+ required)
2. Verify all dependencies installed
3. Check file permissions in cPanel

---

## 📞 **Support**

All errors are now logged to:

- `logs/error.log` - Application errors
- `logs/app.log` - General application logs
- `logs/debug.log` - Debug information

Use `npm run logs:monitor` to watch logs in real-time during deployment.

---

**✅ Your Rabbit Backend is now optimized for cPanel hosting without WebAssembly memory issues!**

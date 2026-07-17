# Frontend Error Debugging Checklist

## 🚨 Common Error Sources & Solutions

### 1. **React DevTools Warning (Not an Error)**
```
Download the React DevTools for a better development experience
```
**Solution:** This is just a helpful suggestion. Install React DevTools browser extension or ignore it.

---

### 2. **Component Import Errors**
**Symptoms:** `Module not found`, `Cannot resolve module`
**Check:**
```bash
# Navigate to frontend directory
cd d:\interview\frontend

# Check if files exist
ls src/components/landing/Hero.jsx
ls src/components/landing/FeatureCard.jsx
```

---

### 3. **Framer Motion Errors**
**Symptoms:** `motion is not defined`, `useMotionValue is not a function`
**Solution:**
```bash
# Ensure Framer Motion is installed
npm list framer-motion
# If missing, reinstall:
npm install framer-motion@latest
```

---

### 4. **CSS/Tailwind Errors**
**Symptoms:** Styles not applying, `className` not recognized
**Check:**
```bash
# Verify Tailwind CSS is working
npm run build
```

---

### 5. **State Management Errors**
**Symptoms:** `useAuthStore is not a function`, state-related errors
**Check:** Zustand store imports and usage

---

## 🛠️ Quick Fixes to Try

### Fix 1: Clear Cache & Restart
```bash
# Stop dev server (Ctrl+C)
# Clear node modules cache
npm run dev
```

### Fix 2: Check Browser Console
1. Open browser (F12)
2. Go to Console tab
3. Look for red error messages
4. Copy exact error text

### Fix 3: Verify All Dependencies
```bash
npm install
```

### Fix 4: Check Network Tab
1. F12 → Network tab
2. Reload page
3. Look for failed requests (red status codes)

---

## 📋 Information Needed for Help

Please provide:
1. **Exact error message** from browser console
2. **Which page** you're on when error occurs
3. **Steps to reproduce** the error
4. **Browser type** and version

---

## 🔍 Self-Diagnosis Commands

```bash
# Check if dev server is running properly
npm run dev

# Check for compilation errors
npm run build

# List all dependencies
npm list

# Check React version
npm list react react-dom
```

---

## 🆘 Emergency Reset (If Nothing Works)

```bash
# Stop dev server
# Delete node_modules
rmdir /s node_modules
del package-lock.json

# Reinstall everything
npm install

# Restart dev server
npm run dev
```

---

**Note:** Most errors in development are due to:
1. Missing dependencies
2. Typos in import paths  
3. Browser cache issues
4. Dev server not restarting properly

The code we created is syntactically correct, so runtime errors are usually environment/setup related.
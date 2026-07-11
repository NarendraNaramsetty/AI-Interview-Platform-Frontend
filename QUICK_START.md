# 🚀 Quick Start - Environment Configuration

## For Users (End Users / QA)

### Configure Your Environment

1. **Click the settings icon** ⚙️ in the top-right header
2. **Enter your service URLs:**
   - API Base URL: `https://your-api.com`
   - Ollama Base URL: `https://your-ollama.com`
   - Qdrant Host: `your-qdrant.com`
3. **Click "Save & Close"** ✅
4. **Done!** Configuration is saved and persistent

### Reset to Defaults
1. Open settings popup again
2. Click "Reset" button
3. All settings go back to defaults

---

## For Developers

### Using the Configuration System

```javascript
// Import the utilities
import { 
  getApiUrl, 
  getOllamaUrl, 
  getQdrantHost,
  getEnvironmentConfig 
} from '@/utils/envConfig';

// Use in your code
const apiUrl = getApiUrl();  // Returns: https://api.prepai.com (or user configured)
const ollamaUrl = getOllamaUrl();  // Returns: https://ollama.prepai.com (or user configured)

// Make API calls
const response = await fetch(`${apiUrl}/api/users`);

// Get full config object
const config = getEnvironmentConfig();
console.log(config);
// Output:
// {
//   apiUrl: 'https://api.prepai.com',
//   ollamaUrl: 'https://ollama.prepai.com',
//   qdrantHost: 'qdrant.prepai.com',
//   qdrantPort: 6333
// }
```

### Common Use Cases

**Making API Requests:**
```javascript
import { getApiUrl } from '@/utils/envConfig';
import api from '@/services/api';  // Already uses getApiUrl()

// This automatically uses configured URL
const response = await api.get('/api/users');
```

**Getting Specific Endpoints:**
```javascript
import { getApiUrl, getOllamaUrl } from '@/utils/envConfig';

const apiUrl = getApiUrl();
const ollamaUrl = getOllamaUrl();

// Build custom endpoints
const userEndpoint = `${apiUrl}/api/users`;
const ollamaGenerateEndpoint = `${ollamaUrl}/api/generate`;
```

**Checking Configuration Validity:**
```javascript
import { isConfigurationValid, getConfigurationErrors } from '@/utils/envConfig';

if (!isConfigurationValid()) {
  const errors = getConfigurationErrors();
  console.error('Configuration errors:', errors);
}
```

---

## Environment Variables (.env)

Set these in your `.env` file to override defaults:

```bash
# Frontend
VITE_API_URL=https://api.prepai.com
VITE_OLLAMA_URL=https://ollama.prepai.com
VITE_QDRANT_HOST=qdrant.prepai.com
VITE_QDRANT_PORT=6333

# Backend
FRONTEND_URL=https://app.prepai.com
CORS_ALLOWED_ORIGINS=https://app.prepai.com,https://prepai.com
ALLOWED_HOSTS=api.prepai.com
OLLAMA_BASE_URL=https://ollama.prepai.com
QDRANT_HOST=qdrant.prepai.com
```

---

## Default URLs

When no environment variables or localStorage settings exist:

| Service | Default URL |
|---------|------------|
| API | `https://api.prepai.com` |
| Ollama | `https://ollama.prepai.com` |
| Qdrant | `qdrant.prepai.com` |
| Frontend | `https://app.prepai.com` |

---

## Key Features

✅ **No Localhost Hardcoding**
- All references use configuration system
- Production-ready by default

✅ **Browser Persistence**
- Configuration saved to localStorage
- Persists across page reloads

✅ **Easy UI Configuration**
- User-friendly popup interface
- One-click reset to defaults

✅ **Environment Variables Support**
- Override via `.env` file
- Great for deployment

✅ **Programmatic Access**
- Simple import and use
- Works everywhere in your app

---

## Troubleshooting

**Q: Configuration not saving?**
- Check browser localStorage is enabled
- Check DevTools for errors
- Try clearing browser cache

**Q: Still getting wrong API URL?**
- Open settings popup and verify
- Check .env file hasn't overridden it
- Look at browser DevTools Network tab

**Q: Want to use localhost for development?**
- Set in .env: `VITE_API_URL=http://localhost:8000`
- Or use settings popup to temporarily set localhost
- Environment variables take precedence

---

## File Structure

```
frontend/
├── src/
│   ├── utils/
│   │   └── envConfig.js ← ⭐ Main configuration manager
│   ├── components/
│   │   ├── EnvironmentConfigPopup.jsx ← ⭐ Config UI popup
│   │   └── NotificationPopup.jsx ← Notification popup
│   ├── services/
│   │   └── api.js (uses getApiUrl())
│   └── layouts/
│       └── DashboardLayout.jsx (has config button)
└── public/
    └── auth-callback.html (loads from localStorage)
```

---

## API Service Already Updated

Good news! The main API service (`src/services/api.js`) already uses the configuration system, so **most API calls work automatically** without any changes needed.

Just import and use:
```javascript
import api from '@/services/api';
const response = await api.get('/api/users');  // ✅ Uses configured URL
```

---

## Need Help?

📖 **Full Documentation:** See `ENV_CONFIG_GUIDE.md`

💡 **Common Patterns:** See code in `src/components/` for examples

🐛 **Found a bug?** Search for any remaining `localhost` references

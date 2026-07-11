/**
 * Environment Configuration Manager
 * Centralized management of all service endpoints
 */

// Get configuration from localStorage or environment variables
const getConfig = () => {
  return {
    // API Configuration
    apiUrl: localStorage.getItem('VITE_API_URL') || 
            import.meta.env.VITE_API_URL || 
            'https://api.prepai.com',
    
    // Ollama Configuration
    ollamaUrl: localStorage.getItem('OLLAMA_BASE_URL') || 
               import.meta.env.VITE_OLLAMA_URL || 
               'https://ollama.prepai.com',
    
    // Qdrant Configuration
    qdrantHost: localStorage.getItem('QDRANT_HOST') || 
                import.meta.env.VITE_QDRANT_HOST || 
                'qdrant.prepai.com',
    
    qdrantPort: import.meta.env.VITE_QDRANT_PORT || 6333,
  };
};

// Validate configuration
const validateConfig = (config) => {
  const errors = [];
  
  if (!config.apiUrl || config.apiUrl.includes('localhost')) {
    errors.push('API URL must be configured');
  }
  
  if (!config.ollamaUrl || config.ollamaUrl.includes('localhost')) {
    errors.push('Ollama URL must be configured');
  }
  
  if (!config.qdrantHost || config.qdrantHost.includes('localhost')) {
    errors.push('Qdrant Host must be configured');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// Get API URL with fallback
export const getApiUrl = () => {
  const config = getConfig();
  return config.apiUrl.replace(/\/+$/, ''); // Remove trailing slashes
};

// Get Ollama URL
export const getOllamaUrl = () => {
  const config = getConfig();
  return config.ollamaUrl.replace(/\/+$/, '');
};

// Get Qdrant Host
export const getQdrantHost = () => {
  const config = getConfig();
  return config.qdrantHost;
};

// Get Qdrant Port
export const getQdrantPort = () => {
  const config = getConfig();
  return config.qdrantPort;
};

// Get full config
export const getEnvironmentConfig = () => {
  return getConfig();
};

// Validate all configuration
export const isConfigurationValid = () => {
  const config = getConfig();
  const validation = validateConfig(config);
  return validation.isValid;
};

// Get validation errors
export const getConfigurationErrors = () => {
  const config = getConfig();
  const validation = validateConfig(config);
  return validation.errors;
};

// Update configuration
export const updateEnvironmentConfig = (newConfig) => {
  if (newConfig.apiUrl) {
    localStorage.setItem('VITE_API_URL', newConfig.apiUrl);
  }
  if (newConfig.ollamaUrl) {
    localStorage.setItem('OLLAMA_BASE_URL', newConfig.ollamaUrl);
  }
  if (newConfig.qdrantHost) {
    localStorage.setItem('QDRANT_HOST', newConfig.qdrantHost);
  }
};

// Clear configuration
export const clearEnvironmentConfig = () => {
  localStorage.removeItem('VITE_API_URL');
  localStorage.removeItem('OLLAMA_BASE_URL');
  localStorage.removeItem('QDRANT_HOST');
};

export default {
  getApiUrl,
  getOllamaUrl,
  getQdrantHost,
  getQdrantPort,
  getEnvironmentConfig,
  isConfigurationValid,
  getConfigurationErrors,
  updateEnvironmentConfig,
  clearEnvironmentConfig
};

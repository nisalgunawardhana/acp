


/**
 * Convert input to messages format
 * @param {string|Array} input - The input to convert
 * @returns {Array} Messages array
 */
export function inputToMessages(input) {
  if (typeof input === 'string') {
    return [{ type: 'text', content: input }];
  }
  
  if (Array.isArray(input)) {
    return input;
  }
  
  throw new Error('Input must be a string or array');
}

/**
 * Normalize base URL by removing trailing slash
 * @param {string} url - The URL to normalize
 * @returns {string} Normalized URL
 */
export function normalizeBaseUrl(url) {
  if (!url) return '';
  return url.endsWith('/') ? url.slice(0, -1) : url;
}

/**
 * Create JSON POST request options
 * @param {Object} json - The JSON data to send
 * @param {Object} init - Additional request options
 * @returns {Object} Request options
 */
export function createJsonPost(json, init = {}) {
  return {
    ...init,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...init.headers,
    },
    body: JSON.stringify(json),
  };
}

/**
 * Generate a simple UUID v4
 * @returns {string} UUID string
 */
export function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

/**
 * Sleep for specified milliseconds
 * @param {number} ms - Milliseconds to sleep
 * @returns {Promise} Promise that resolves after timeout
 */
export function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Retry a function with exponential backoff
 * @param {Function} fn - Function to retry
 * @param {Object} options - Retry options
 * @returns {Promise} Promise with function result
 */
export async function retry(fn, options = {}) {
  const {
    maxRetries = 3,
    baseDelay = 1000,
    maxDelay = 10000,
    exponential = true,
  } = options;

  let lastError;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      
      if (attempt === maxRetries) {
        throw error;
      }
      
      const delay = exponential 
        ? Math.min(baseDelay * Math.pow(2, attempt), maxDelay)
        : baseDelay;
        
      await sleep(delay);
    }
  }
  
  throw lastError;
}

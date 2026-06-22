const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || '';

if (typeof window !== 'undefined' && window.fetch) {
  const originalFetch = window.fetch.bind(window);

  window.fetch = (input, init) => {
    if (typeof input === 'string' && input.startsWith('/api/')) {
      input = `${API_BASE_URL}${input}`;
    } else if (input instanceof Request) {
      const requestUrl = new URL(input.url);
      if (requestUrl.pathname.startsWith('/api/')) {
        input = new Request(`${API_BASE_URL}${requestUrl.pathname}${requestUrl.search}`, input);
      }
    }
    return originalFetch(input, init);
  };
}

export default API_BASE_URL;

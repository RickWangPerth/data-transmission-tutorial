import { useState, useEffect } from 'react';

const RedisPage = () => {
  const [key, setKey] = useState('');
  const [value, setValue] = useState('');
  const [response, setResponse] = useState('');
  const [csrfToken, setCsrfToken] = useState<string | null>(null);

  useEffect(() => {
    const fetchCsrfToken = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/redis_app/csrf-token/`, {
          credentials: 'include', 
        });
        const data = await res.json();
        setCsrfToken(data.csrfToken);
      } catch (error) {
        console.error('Failed to fetch CSRF token:', error);
      }
    };
    fetchCsrfToken();
  }, []);

  const setCache = async () => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/redis_app/set-cache/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'X-CSRFToken': csrfToken || '',
      },
      body: new URLSearchParams({
        key,
        value,
      }),
      credentials: 'include',
    });
    const data = await res.json();
    setResponse(JSON.stringify(data));
  };

  const getCache = async () => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/redis_app/get-cache/?key=${key}`, {
      credentials: 'include', // 确保包含cookie
    });
    const data = await res.json();
    setResponse(JSON.stringify(data));
  };

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-2xl font-semibold text-gray-900 my-6">Redis Cache Management</h1>
      <div className="flex gap-4 mb-5">
        <input
          type="text"
          placeholder="Key"
          value={key}
          onChange={(e) => setKey(e.target.value)}
          className="form-input px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <input
          type="text"
          placeholder="Value"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="form-input px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <button
          onClick={setCache}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Set Cache
        </button>
        <button
          onClick={getCache}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Get Cache
        </button>
      </div>
      <div>
        <p>Response: {response}</p>
      </div>
    </div>
  );
};

export default RedisPage;

import { useState, useEffect } from 'react';
import { SunIcon, MoonIcon } from '@heroicons/react/16/solid';

const CookiesPage = () => {
  const [mode, setMode] = useState('light_mode');
  const [csrfToken, setCsrfToken] = useState<string | null>(null);

  useEffect(() => {
    const fetchCsrfToken = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/cookies_app/csrf-token/`, {
          credentials: 'include',
        });
        const data = await res.json();
        console.log('Fetched CSRF token:', data.csrfToken);
        setCsrfToken(data.csrfToken);
      } catch (error) {
        console.error('Failed to fetch CSRF token:', error);
      }
    };
    fetchCsrfToken();
  }, []);

  const setCookie = async () => {
    const newMode = mode === 'dark_mode' ? 'light_mode' : 'dark_mode';
    setMode(newMode);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/cookies_app/set-cookie/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'X-CSRFToken': csrfToken || '',
        },
        body: new URLSearchParams({
          key: 'user_preference',
          value: newMode,
        }),
        credentials: 'include',
      });
      const data = await res.json();
      console.log('Set Cookie response:', data);
    } catch (error) {
      console.error('Failed to set cookie:', error);
    }
  };

  const getCookie = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/cookies_app/get-cookie/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'X-CSRFToken': csrfToken || '',
        },
        body: new URLSearchParams({
          key: 'user_preference',
        }),
        credentials: 'include',
      });
      const data = await res.json();
      console.log('Get Cookie response:', data); 
      setMode(data.value || 'light_mode');
    } catch (error) {
      console.error('Failed to get cookie:', error);
    }
  };

  useEffect(() => {
    if (csrfToken) {
      getCookie();
    }
  }, [csrfToken]);

  return (
    <div className={`container mx-auto px-4 ${mode === 'dark_mode' ? 'bg-gray-900 text-white' : 'bg-white text-black'}`}>
      <h1 className="text-2xl font-semibold my-6">Cookies Management</h1>
      <div className="flex gap-4 mb-5">
        <button
          onClick={setCookie}
          className="flex items-center bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          {mode === 'dark_mode' ? (
            <SunIcon className="h-5 w-5" />
          ) : (
            <MoonIcon className="h-5 w-5" />
          )}
          <span className="ml-2">Toggle Mode</span>
        </button>
      </div>
      <div>
        <p>User Preference: {mode}</p>
      </div>
    </div>
  );
};

export default CookiesPage;

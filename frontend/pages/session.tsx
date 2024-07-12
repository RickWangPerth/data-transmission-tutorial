import { useState, useEffect } from 'react';

const SessionPage = () => {
  // State to hold the key and value for session storage
  const [key, setKey] = useState('');
  const [value, setValue] = useState('');
  // State to hold the response from the backend
  const [response, setResponse] = useState('');
  // State to hold the CSRF token
  const [csrfToken, setCsrfToken] = useState<string | null>(null);

  // Fetch the CSRF token when the component mounts
  useEffect(() => {
    const fetchCsrfToken = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/session_app/csrf-token/`, {
          credentials: 'include', // Include credentials to ensure cookies are sent
        });
        if (res.ok) {
          const data = await res.json();
          setCsrfToken(data.csrfToken); // Set the CSRF token in the state
        } else {
          console.error('Failed to fetch CSRF token');
        }
      } catch (error) {
        console.error('Error fetching CSRF token:', error);
      }
    };
    fetchCsrfToken();
  }, []);

  // Function to set a session value
  const setSession = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/session_app/set-session/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'X-CSRFToken': csrfToken || '', // Include the CSRF token in the request headers
        },
        credentials: 'include', // Include credentials to ensure cookies are sent
        body: new URLSearchParams({
          key,
          value,
        }),
      });
      const data = await res.json();
      setResponse(JSON.stringify(data)); // Set the response from the backend in the state
    } catch (error) {
      console.error('Error setting session:', error);
    }
  };

  // Function to get a session value
  const getSession = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/session_app/get-session/?key=${key}`, {
        credentials: 'include', // Include credentials to ensure cookies are sent
      });
      const data = await res.json();
      setResponse(JSON.stringify(data)); // Set the response from the backend in the state
    } catch (error) {
      console.error('Error getting session:', error);
    }
  };

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-2xl font-semibold text-gray-900 my-6">Session Management</h1>
      <div className="flex gap-4 mb-5">
        <input
          type="text"
          placeholder="Key"
          value={key}
          onChange={(e) => setKey(e.target.value)} // Update key state on input change
          className="form-input px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <input
          type="text"
          placeholder="Value"
          value={value}
          onChange={(e) => setValue(e.target.value)} // Update value state on input change
          className="form-input px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <button
          onClick={setSession} // Set session value on button click
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Set Session
        </button>
        <button
          onClick={getSession} // Get session value on button click
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Get Session
        </button>
      </div>
      <div>
        <p>Response: {response}</p> {/* Display the response from the backend */}
      </div>
    </div>
  );
};

export default SessionPage;

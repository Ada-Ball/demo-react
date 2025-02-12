// src/components/Login.js
import React, { useState, useEffect } from 'react';
import { saveAuthData, getAuthData } from '../db/indexedDB';

const Login = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setStatus('');

    try {
      if (isOnline) {
        // Demo credentials check
        if (username === 'demo' && password === '123456') {
          // Save auth data for offline use
          await saveAuthData({
            username,
            token: 'demo-token',
            lastLogin: new Date().toISOString()
          });
          setStatus('Login successful! (Demo Mode)');
        } else {
          setStatus('Demo credentials: username="demo", password="123456"');
        }
      } else {
        // Offline login
        await handleOfflineLogin();
      }
    } catch (error) {
      setStatus('Login failed: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOfflineLogin = async () => {
    try {
      const savedAuth = await getAuthData(username);
      if (savedAuth) {
        setStatus('Offline login successful');
      } else {
        setStatus('No saved credentials found for offline login');
      }
    } catch (error) {
      setStatus('Offline login failed: ' + error.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-md">
        <div>
          <h2 className="text-center text-3xl font-bold text-gray-900">
            {isOnline ? 'Login (Demo Mode)' : 'Offline Login'}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            {isOnline ? 'Connected' : 'Working Offline'}
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <div className="space-y-4">
            <div>
              <label htmlFor="username" className="sr-only">Username</label>
              <input
                id="username"
                name="username"
                type="text"
                required
                className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Username (demo)"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Password (123456)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300"
            >
              {isLoading ? 'Logging in...' : 'Sign in'}
            </button>
          </div>
        </form>

        {status && (
          <div className={`mt-4 text-center text-sm ${
            status.includes('successful') ? 'text-green-600' : 'text-red-600'
          }`}>
            {status}
          </div>
        )}

        <div className="mt-4 text-center text-sm text-gray-500">
          Demo Mode Credentials:<br />
          Username: demo<br />
          Password: 123456
        </div>
      </div>
    </div>
  );
};

export default Login;
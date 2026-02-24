'use client';

import { useState, useEffect } from 'react';
import { 
  startGoogleAuth, 
  checkGoogleStatus, 
  checkYahooStatus,
  connectYahoo,
  disconnectGoogle,
  AuthStatus 
} from '@/lib/api';

export default function CalendarConnect() {
  const [googleStatus, setGoogleStatus] = useState<AuthStatus>({ connected: false });
  const [yahooStatus, setYahooStatus] = useState<AuthStatus>({ connected: false });
  const [loading, setLoading] = useState(false);
  const [showYahooForm, setShowYahooForm] = useState(false);
  const [yahooEmail, setYahooEmail] = useState('');
  const [yahooPassword, setYahooPassword] = useState('');

  useEffect(() => {
    checkStatus();
  }, []);

  const checkStatus = async () => {
    try {
      const [google, yahoo] = await Promise.all([
        checkGoogleStatus(),
        checkYahooStatus(),
      ]);
      setGoogleStatus(google);
      setYahooStatus(yahoo);
    } catch (error) {
      console.error('Failed to check status:', error);
    }
  };

  const handleGoogleConnect = async () => {
    try {
      setLoading(true);
      const authUrl = await startGoogleAuth();
      window.location.href = authUrl;
    } catch (error) {
      console.error('Failed to start Google OAuth:', error);
      alert('Failed to connect Google Calendar');
      setLoading(false);
    }
  };

  const handleYahooConnect = async () => {
    if (!yahooEmail || !yahooPassword) {
      alert('Please enter your Yahoo email and app password');
      return;
    }

    try {
      setLoading(true);
      await connectYahoo(yahooEmail, yahooPassword);
      setYahooStatus({ connected: true, email: yahooEmail });
      setShowYahooForm(false);
      setYahooPassword('');
      alert('Yahoo Calendar connected!');
    } catch (error) {
      console.error('Failed to connect Yahoo:', error);
      alert('Failed to connect Yahoo Calendar. Check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto space-y-4">
      {/* Google Calendar */}
      <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-2xl p-6 border border-blue-200 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold shadow">
              G
            </div>
            <div>
              <h3 className="text-gray-900 font-medium">Google Calendar</h3>
              {googleStatus.connected && googleStatus.email && (
                <p className="text-sm text-gray-600">{googleStatus.email}</p>
              )}
            </div>
          </div>
          {googleStatus.connected ? (
            <span className="text-green-600 text-sm font-medium">✓ Connected</span>
          ) : (
            <span className="text-gray-400 text-sm">Not connected</span>
          )}
        </div>

        {!googleStatus.connected ? (
          <button
            onClick={handleGoogleConnect}
            disabled={loading}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-6 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm min-h-[44px]"
          >
            {loading ? 'Connecting...' : 'Connect Google'}
          </button>
        ) : (
          <button
            onClick={async () => {
              await disconnectGoogle();
              setGoogleStatus({ connected: false });
            }}
            className="w-full bg-white hover:bg-gray-50 text-gray-700 font-medium py-3 px-6 rounded-xl transition-colors border border-gray-200 min-h-[44px]"
          >
            Disconnect
          </button>
        )}
      </div>

      {/* Yahoo Calendar */}
      <div className="bg-gradient-to-br from-purple-50 to-purple-100/50 rounded-2xl p-6 border border-purple-200 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold shadow">
              Y
            </div>
            <div>
              <h3 className="text-gray-900 font-medium">Yahoo Calendar</h3>
              {yahooStatus.connected && yahooStatus.email && (
                <p className="text-sm text-gray-600">{yahooStatus.email}</p>
              )}
            </div>
          </div>
          {yahooStatus.connected ? (
            <span className="text-green-600 text-sm font-medium">✓ Connected</span>
          ) : (
            <span className="text-gray-400 text-sm">Not connected</span>
          )}
        </div>

        {!yahooStatus.connected ? (
          <>
            {!showYahooForm ? (
              <button
                onClick={() => setShowYahooForm(true)}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-6 rounded-xl transition-colors shadow-sm min-h-[44px]"
              >
                Connect Yahoo
              </button>
            ) : (
              <div className="space-y-3">
                <input
                  type="email"
                  placeholder="Yahoo email"
                  value={yahooEmail}
                  onChange={(e) => setYahooEmail(e.target.value)}
                  className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent min-h-[44px]"
                />
                <input
                  type="password"
                  placeholder="App password"
                  value={yahooPassword}
                  onChange={(e) => setYahooPassword(e.target.value)}
                  className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent min-h-[44px]"
                />
                <div className="flex gap-2">
                  <button
                    onClick={handleYahooConnect}
                    disabled={loading}
                    className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-6 rounded-xl transition-colors disabled:opacity-50 min-h-[44px]"
                  >
                    {loading ? 'Connecting...' : 'Connect'}
                  </button>
                  <button
                    onClick={() => setShowYahooForm(false)}
                    className="flex-1 bg-white hover:bg-gray-50 text-gray-700 font-medium py-3 px-6 rounded-xl transition-colors border border-gray-300 min-h-[44px]"
                  >
                    Cancel
                  </button>
                </div>
                <p className="text-xs text-gray-600">
                  Generate an app password at:{' '}
                  <a 
                    href="https://login.yahoo.com/account/security/app-passwords"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-purple-600 underline"
                  >
                    Yahoo Security
                  </a>
                </p>
              </div>
            )}
          </>
        ) : (
          <button
            onClick={async () => {
              // Will add disconnect later
              setYahooStatus({ connected: false });
            }}
            className="w-full bg-white hover:bg-gray-50 text-gray-700 font-medium py-3 px-6 rounded-xl transition-colors border border-gray-200 min-h-[44px]"
          >
            Disconnect
          </button>
        )}
      </div>
    </div>
  );
}

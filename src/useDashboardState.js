import { useEffect, useState } from 'react';

// Frontend will poll a JSON endpoint for real-time state.
// In Vercel, set VITE_STATE_ENDPOINT to your public URL, e.g.:
//   https://your-vps-domain.com/dashboard/state
// Locally, you can run dashboard-server.js (see below) on port 4001.

const DEFAULT_ENDPOINT = import.meta.env.VITE_STATE_ENDPOINT || 'http://127.0.0.1:4001/state';

export default function useDashboardState() {
  const [state, setState] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchState() {
      try {
        const res = await fetch(DEFAULT_ENDPOINT, { cache: 'no-store' });
        if (!res.ok) throw new Error('Failed to fetch dashboard state');
        const json = await res.json();
        if (!cancelled) setState(json);
      } catch (e) {
        if (!cancelled) {
          console.warn('Dashboard state fetch error:', e.message);
        }
      }
    }

    fetchState();
    const id = setInterval(fetchState, 5000); // 5초마다 폴링

    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, []);

  return state;
}

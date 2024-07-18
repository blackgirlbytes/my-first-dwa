import "@/styles/globals.css";

// pages/_app.js
import { useEffect } from 'react';
import {activatePolyfills} from '../../polyfills';

function App({ Component, pageProps }) {
  useEffect(() => {
    activatePolyfills({
      // Allow service worker registration for Web5 functionality
      onCacheCheck: (event, route) => {
        return {
          ttl: 60_000
        };
      }
    });
  }, []);

  return <Component {...pageProps} />;
}

export default App;
// pages/_app.js
import '../styles/globals.css'
import Head from 'next/head'
import CustomCursor from '../components/CustomCursor'
import { useEffect, useState } from 'react'

// Easy toggle: set to false to disable custom cursor by default
const CUSTOM_CURSOR_ENABLED = false;

export default function App({ Component, pageProps }) {
  const [showCursor, setShowCursor] = useState(CUSTOM_CURSOR_ENABLED);

  useEffect(() => {
    // Only enable cursor if explicitly enabled AND not mobile
    const isMobile = /Mobi|Android|iPhone|iPad|iPod|Opera Mini|IEMobile|BlackBerry/i.test(navigator.userAgent);
    setShowCursor(CUSTOM_CURSOR_ENABLED && !isMobile);

    // Add keyboard shortcut to toggle cursor (Ctrl+Shift+C)
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'C') {
        e.preventDefault();
        setShowCursor(prev => !prev);
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <>
      <Head>
        <title>XENSILICO</title>
        <meta name="description" content="XENSILICO" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        {/* Open Graph */}
        <meta property="og:title" content="XENSILICO" />
        <meta property="og:description" content="XENSILICO" />
        <meta property="og:image" content="/favicon.ico" />
        <meta property="og:url" content="https://xensilico.ai" />
        <meta property="og:type" content="website" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="XENSILICO" />
        <meta name="twitter:description" content="XENSILICO" />
        <meta name="twitter:image" content="/favicon.ico" />

        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" />
        <meta name="theme-color" content="#000000" />

        {/* Founders Grotesk Font */}
        <link href="https://www.beingl.ink/files/jii-management/fonts/web/foundersgrotesk.css" rel="stylesheet" />
      </Head>

      {showCursor && <CustomCursor />}
      <Component {...pageProps} />
    </>
  )
}

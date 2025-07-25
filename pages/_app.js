// pages/_app.js
import '../styles/globals.css'
import Head from 'next/head'
import CustomCursor from '../components/CustomCursor'
import { useEffect, useState } from 'react'

export default function App({ Component, pageProps }) {
  const [showCursor, setShowCursor] = useState(false);

  useEffect(() => {
    // Basic mobile detection
    const isMobile = /Mobi|Android|iPhone|iPad|iPod|Opera Mini|IEMobile|BlackBerry/i.test(navigator.userAgent);
    setShowCursor(!isMobile);
  }, []);

  return (
    <>
      <Head>
        <title>AI WRAP</title>
        <meta name="description" content="AI WRAP" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        {/* Open Graph */}
        <meta property="og:title" content="AI WRAP" />
        <meta property="og:description" content="AI WRAP" />
        <meta property="og:image" content="/xenco-p.png" />
        <meta property="og:url" content="https://legacy2310-site.vercel.app" />
        <meta property="og:type" content="website" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="AI WRAP" />
        <meta name="twitter:description" content="AI WRAP" />
        <meta name="twitter:image" content="/xenco-p.png" />

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

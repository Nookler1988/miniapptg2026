import Head from "next/head";
import { useEffect, useState } from "react";

export default function Home() {
  const [initData, setInitData] = useState(null);
  const [parsedData, setParsedData] = useState({});

  useEffect(() => {
    // Check if we're in the browser
    if (typeof window !== 'undefined') {
      // Get initData from URLSearchParams
      const urlParams = new URLSearchParams(window.location.search);
      const initDataParam = urlParams.get('tgWebAppData');
      
      if (initDataParam) {
        setInitData(initDataParam);
        
        // Parse the initData
        const params = new URLSearchParams(initDataParam);
        const data = {};
        for (const [key, value] of params) {
          data[key] = value;
        }
        setParsedData(data);
      } else {
        // Fallback: try to get from Telegram Web Apps object if available
        if (window.Telegram?.WebApp) {
          const tg = window.Telegram.WebApp;
          setParsedData({
            version: tg.version,
            platform: tg.platform,
            colorScheme: tg.colorScheme,
            isExpanded: tg.isExpanded,
            viewportHeight: tg.viewportHeight,
            viewportStableHeight: tg.viewportStableHeight,
            headerColor: tg.headerColor,
            backgroundColor: tg.backgroundColor,
            BackButton: tg.BackButton.isVisible,
            MainButton: tg.MainButton.text,
            HapticFeedback: !!tg.HapticFeedback,
            CloudStorage: !!tg.CloudStorage,
            BiometricManager: !!tg.BiometricManager,
            QRScanner: !!tg.QRScanner,
            themeParams: JSON.stringify(tg.themeParams),
          });
        } else {
          // For testing purposes, simulate some data
          setParsedData({
            'For Testing': 'This is simulated data. Actual data will come from Telegram.',
            'Platform': 'web',
            'Version': '6.0'
          });
        }
      }
    }
  }, []);

  return (
    <>
      <Head>
        <title>Telegram Mini App</title>
        <meta name="description" content="Telegram Mini App with initData" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
        <main>
          <h1>Telegram Mini App</h1>
          
          <div style={{ marginTop: '20px' }}>
            <h2>Received Init Data:</h2>
            {initData ? (
              <pre style={{ backgroundColor: '#f0f0f0', padding: '10px', borderRadius: '4px', overflowX: 'auto' }}>
                {initData}
              </pre>
            ) : (
              <p>No initData received from URL</p>
            )}
          </div>

          <div style={{ marginTop: '20px' }}>
            <h2>Parsed Data:</h2>
            <ul style={{ textAlign: 'left', paddingLeft: '20px' }}>
              {Object.entries(parsedData).map(([key, value]) => (
                <li key={key}>
                  <strong>{key}:</strong> {JSON.stringify(value)}
                </li>
              ))}
            </ul>
          </div>
        </main>
      </div>
    </>
  );
}

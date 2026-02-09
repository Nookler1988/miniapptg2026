import Head from "next/head";
import { useEffect, useState } from "react";

export default function Home() {
  const [initData, setInitData] = useState(null);
  const [parsedData, setParsedData] = useState({});
  const [rawData, setRawData] = useState('');
  const [debugInfo, setDebugInfo] = useState([]);
  const [isTelegramEnv, setIsTelegramEnv] = useState(false);

  useEffect(() => {
    const debugLog = [];
    
    // Check if we're in the browser
    if (typeof window !== 'undefined') {
      debugLog.push(`Window object available: ${!!window}`);
      debugLog.push(`Location href: ${window.location.href}`);
      debugLog.push(`URL search params: ${window.location.search}`);
      
      // Check for Telegram Web App object
      const hasTelegramObj = !!(window.Telegram && window.Telegram.WebApp);
      setIsTelegramEnv(hasTelegramObj);
      debugLog.push(`Is Telegram environment: ${hasTelegramObj}`);
      
      if (hasTelegramObj) {
        debugLog.push(`Telegram WebApp version: ${window.Telegram.WebApp.version}`);
        debugLog.push(`Telegram WebApp platform: ${window.Telegram.WebApp.platform}`);
        debugLog.push(`Telegram WebApp initData: ${window.Telegram.WebApp.initData || 'Not available'}`);
      }
      
      // Get initData from URL
      const urlParams = new URLSearchParams(window.location.search);
      const initDataFromUrl = urlParams.get('tgWebAppData');
      
      debugLog.push(`Init data from URL params: ${initDataFromUrl ? 'Found' : 'Not found'}`);
      
      if (initDataFromUrl) {
        setRawData(initDataFromUrl);
        
        // Parse initData as URL-encoded string
        try {
          // Decode URL-encoded string
          const decodedData = decodeURIComponent(initDataFromUrl);
          const params = new URLSearchParams(decodedData);
          const data = {};
          
          for (const [key, value] of params) {
            data[key] = value;
          }
          
          setInitData(initDataFromUrl);
          setParsedData(data);
          debugLog.push(`Successfully parsed ${Object.keys(data).length} parameters`);
        } catch (error) {
          debugLog.push(`Error parsing initData: ${error.message}`);
        }
      } else if (hasTelegramObj && window.Telegram.WebApp.initData) {
        // Fallback to Telegram WebApp object
        const initDataFromObj = window.Telegram.WebApp.initData;
        setRawData(initDataFromObj);
        
        try {
          // Parse initData from Telegram object
          const params = new URLSearchParams(initDataFromObj);
          const data = {};
          
          for (const [key, value] of params) {
            data[key] = value;
          }
          
          setInitData(initDataFromObj);
          setParsedData(data);
          debugLog.push(`Successfully parsed ${Object.keys(data).length} parameters from Telegram object`);
        } catch (error) {
          debugLog.push(`Error parsing initData from Telegram object: ${error.message}`);
        }
      } else {
        // For testing purposes, simulate some data
        setParsedData({
          'Status': 'Running outside Telegram environment',
          'Platform': typeof window !== 'undefined' && window.Telegram?.WebApp?.platform || 'web',
          'Version': typeof window !== 'undefined' && window.Telegram?.WebApp?.version || 'N/A',
          'URL Search': window.location.search,
          'Has Telegram Object': hasTelegramObj.toString()
        });
        debugLog.push('Running in test mode - no Telegram data available');
      }
    } else {
      debugLog.push('Window object not available (server-side)');
    }
    
    setDebugInfo(debugLog);
  }, []);

  return (
    <>
      <Head>
        <title>Telegram Mini App - Debug Version</title>
        <meta name="description" content="Telegram Mini App with initData" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
        <main>
          <h1>Telegram Mini App - Debug Version</h1>
          
          <div style={{ marginTop: '20px', backgroundColor: '#fff3cd', padding: '10px', borderRadius: '4px' }}>
            <h3>Environment Info:</h3>
            <p><strong>In Telegram?</strong> {isTelegramEnv ? 'Yes' : 'No'}</p>
          </div>

          <div style={{ marginTop: '20px' }}>
            <h2>Raw Init Data:</h2>
            {rawData ? (
              <pre style={{ backgroundColor: '#f0f0f0', padding: '10px', borderRadius: '4px', overflowX: 'auto' }}>
                {rawData}
              </pre>
            ) : (
              <p>No raw initData found in URL or Telegram object</p>
            )}
          </div>

          <div style={{ marginTop: '20px' }}>
            <h2>Received Init Data:</h2>
            {initData ? (
              <pre style={{ backgroundColor: '#f0f0f0', padding: '10px', borderRadius: '4px', overflowX: 'auto' }}>
                {initData}
              </pre>
            ) : (
              <p>No initData received from URL or Telegram object</p>
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

          <div style={{ marginTop: '20px' }}>
            <h2>Debug Information:</h2>
            <ul style={{ textAlign: 'left', paddingLeft: '20px' }}>
              {debugInfo.map((info, index) => (
                <li key={index}>{info}</li>
              ))}
            </ul>
          </div>
        </main>
      </div>
    </>
  );
}

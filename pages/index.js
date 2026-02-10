import Head from "next/head";
import { useEffect, useState } from "react";

export default function Home() {
  const [initData, setInitData] = useState(null);
  const [parsedData, setParsedData] = useState({});
  const [rawData, setRawData] = useState('');
  const [debugInfo, setDebugInfo] = useState([]);
  const [isTelegramEnv, setIsTelegramEnv] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const debugLog = [];
    let dataFound = false;
    
    if (typeof window !== 'undefined') {
      debugLog.push(`Location: ${window.location.pathname}`);
      debugLog.push(`URL params: ${window.location.search.substring(0, 100)}`);
      
      const tg = window.Telegram?.WebApp;
      const hasTelegramObj = !!tg;
      
      setIsTelegramEnv(hasTelegramObj);
      debugLog.push(`Telegram object: ${hasTelegramObj ? 'Available' : 'Not found'}`);
      
      if (hasTelegramObj) {
        debugLog.push(`Version: ${tg.version || 'N/A'}`);
        debugLog.push(`Platform: ${tg.platform || 'N/A'}`);
        debugLog.push(`InitData present: ${tg.initData ? 'Yes' : 'No'}`);
        
        try {
          tg.ready();
          debugLog.push('✓ Telegram.WebApp.ready() called');
          tg.expand();
          debugLog.push('✓ Telegram.WebApp.expand() called');
          
          tg.onEvent('viewportChanged', (e) => {
            debugLog.push(`Viewport changed: ${JSON.stringify(e)}`);
          });
        } catch (e) {
          debugLog.push(`Error initializing Telegram: ${e.message}`);
          setError(`Telegram init error: ${e.message}`);
        }
        
        if (tg.initData) {
          debugLog.push('Getting initData from Telegram object');
          processInitData(tg.initData, debugLog, 'Telegram object');
          dataFound = true;
        } else {
          debugLog.push('No initData in Telegram object');
        }
      }
      
      const urlParams = new URLSearchParams(window.location.search);
      const initDataFromUrl = urlParams.get('tgWebAppData');
      
      if (initDataFromUrl && !dataFound) {
        debugLog.push('Getting initData from URL params');
        processInitData(initDataFromUrl, debugLog, 'URL params');
        dataFound = true;
      }
      
      // Development Mode только если данные НЕ найдены
      if (!dataFound) {
        setParsedData({
          'Status': 'Development Mode',
          'Message': 'Not running in Telegram environment',
          'Telegram Available': hasTelegramObj.toString(),
          'Platform': tg?.platform || 'web',
          'Version': tg?.version || 'N/A'
        });
        debugLog.push('Development mode - no Telegram data');
      }
      
      setIsLoading(false);
    }
    
    setDebugInfo(debugLog);
  }, []);

  const processInitData = (data, debugLog, source) => {
    setRawData(data);
    
    try {
      const params = new URLSearchParams(data);
      const parsed = {};
      
      for (const [key, value] of params) {
        if (key === 'user' || key === 'receiver' || key === 'chat') {
          try {
            parsed[key] = JSON.parse(value);
          } catch {
            parsed[key] = value;
          }
        } else {
          parsed[key] = value;
        }
      }
      
      setInitData(data);
      setParsedData(parsed);
      debugLog.push(`✓ Parsed ${Object.keys(parsed).length} fields from ${source}`);
      
      if (parsed.user) {
        debugLog.push(`User: ${parsed.user.first_name || 'Unknown'}`);
      }
    } catch (err) {
      debugLog.push(`✗ Error parsing initData: ${err.message}`);
      setError(`Parse error: ${err.message}`);
    }
  };

  return (
    <>
      <Head>
        <title>Telegram Mini App</title>
        <meta name="description" content="Telegram Mini App" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div style={{ 
        padding: '20px', 
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
        maxWidth: '600px',
        margin: '0 auto',
        backgroundColor: '#ffffff',
        color: '#1a1a1a',
        minHeight: '100vh'
      }}>
        <main>
          <div style={{
            textAlign: 'center',
            padding: '30px 20px',
            border: '2px solid #1a1a1a',
            marginBottom: '30px',
            backgroundColor: '#ffffff'
          }}>
            <h1 style={{ 
              fontSize: '28px', 
              margin: '0 0 10px 0',
              fontWeight: 'bold',
              letterSpacing: '2px'
            }}>✓ WHITE DESIGN v2.1</h1>
            <p style={{ 
              margin: 0,
              fontSize: '14px',
              color: '#666'
            }}>Fixed: User Data Now Displays!</p>
          </div>
          
          {isLoading && (
            <div style={{ 
              padding: '20px', 
              border: '1px solid #ddd',
              textAlign: 'center',
              marginBottom: '20px'
            }}>
              Loading...
            </div>
          )}
          
          {error && (
            <div style={{ 
              padding: '15px', 
              border: '1px solid #1a1a1a',
              marginBottom: '20px',
              color: '#1a1a1a'
            }}>
              <strong>Error:</strong> {error}
            </div>
          )}
          
          <div style={{ 
            marginTop: '20px', 
            border: '1px solid #ddd',
            padding: '20px', 
            marginBottom: '20px'
          }}>
            <h3 style={{ marginTop: 0, borderBottom: '1px solid #ddd', paddingBottom: '10px' }}>Environment</h3>
            <p style={{ margin: '10px 0' }}><strong>Telegram:</strong> {isTelegramEnv ? '✓ Connected' : '✗ Not detected'}</p>
            {isTelegramEnv && (
              <>
                <p style={{ margin: '10px 0' }}><strong>Platform:</strong> {window.Telegram?.WebApp?.platform}</p>
                <p style={{ margin: '10px 0' }}><strong>Version:</strong> {window.Telegram?.WebApp?.version}</p>
              </>
            )}
          </div>

          {parsedData.user && (
            <div style={{ 
              marginTop: '20px', 
              border: '1px solid #ddd',
              padding: '20px', 
              marginBottom: '20px'
            }}>
              <h3 style={{ marginTop: 0, borderBottom: '1px solid #ddd', paddingBottom: '10px' }}>User Info</h3>
              <p style={{ margin: '10px 0' }}><strong>ID:</strong> {parsedData.user.id}</p>
              <p style={{ margin: '10px 0' }}><strong>Name:</strong> {parsedData.user.first_name} {parsedData.user.last_name || ''}</p>
              {parsedData.user.username && (
                <p style={{ margin: '10px 0' }}><strong>Username:</strong> @{parsedData.user.username}</p>
              )}
              {parsedData.user.language_code && (
                <p style={{ margin: '10px 0' }}><strong>Language:</strong> {parsedData.user.language_code}</p>
              )}
            </div>
          )}

          <div style={{ marginTop: '20px', marginBottom: '20px' }}>
            <h3 style={{ borderBottom: '1px solid #ddd', paddingBottom: '10px' }}>Raw Init Data</h3>
            {rawData ? (
              <pre style={{ 
                border: '1px solid #ddd',
                padding: '15px', 
                overflowX: 'auto',
                fontSize: '12px',
                wordBreak: 'break-all',
                backgroundColor: '#fafafa'
              }}>
                {rawData}
              </pre>
            ) : (
              <p style={{ color: '#666' }}>No initData received</p>
            )}
          </div>

          <div style={{ marginTop: '20px', marginBottom: '20px' }}>
            <h3 style={{ borderBottom: '1px solid #ddd', paddingBottom: '10px' }}>Parsed Data</h3>
            {Object.keys(parsedData).length > 0 ? (
              <div style={{ 
                border: '1px solid #ddd',
                padding: '15px'
              }}>
                {Object.entries(parsedData).map(([key, value]) => (
                  <div key={key} style={{ marginBottom: '15px' }}>
                    <strong>{key}:</strong>
                    <pre style={{ 
                      margin: '8px 0 0 0',
                      fontSize: '12px',
                      border: '1px solid #eee',
                      padding: '10px',
                      overflowX: 'auto',
                      backgroundColor: '#fafafa'
                    }}>
                      {typeof value === 'object' ? JSON.stringify(value, null, 2) : String(value)}
                    </pre>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ color: '#666' }}>No data parsed</p>
            )}
          </div>

          <div style={{ marginTop: '20px' }}>
            <h3 style={{ borderBottom: '1px solid #ddd', paddingBottom: '10px' }}>Debug Log</h3>
            <div style={{ 
              border: '1px solid #ddd',
              padding: '15px', 
              fontSize: '12px',
              fontFamily: 'monospace',
              backgroundColor: '#fafafa'
            }}>
              {debugInfo.map((info, index) => (
                <div key={index} style={{ marginBottom: '6px', color: '#444' }}>
                  {info}
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </>
  );
}

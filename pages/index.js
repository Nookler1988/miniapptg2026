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
    
    if (typeof window !== 'undefined') {
      debugLog.push(`Location: ${window.location.pathname}`);
      debugLog.push(`URL params: ${window.location.search.substring(0, 100)}`);
      
      // Проверяем наличие Telegram WebApp
      const tg = window.Telegram?.WebApp;
      const hasTelegramObj = !!tg;
      
      setIsTelegramEnv(hasTelegramObj);
      debugLog.push(`Telegram object: ${hasTelegramObj ? 'Available' : 'Not found'}`);
      
      if (hasTelegramObj) {
        debugLog.push(`Version: ${tg.version || 'N/A'}`);
        debugLog.push(`Platform: ${tg.platform || 'N/A'}`);
        debugLog.push(`InitData present: ${tg.initData ? 'Yes' : 'No'}`);
        
        // Инициализируем Telegram WebApp
        try {
          tg.ready();
          debugLog.push('✓ Telegram.WebApp.ready() called');
          
          // Разворачиваем на полный экран
          tg.expand();
          debugLog.push('✓ Telegram.WebApp.expand() called');
          
          // Подключаемся к событиям
          tg.onEvent('viewportChanged', (e) => {
            debugLog.push(`Viewport changed: ${JSON.stringify(e)}`);
          });
        } catch (e) {
          debugLog.push(`Error initializing Telegram: ${e.message}`);
          setError(`Telegram init error: ${e.message}`);
        }
        
        // Пытаемся получить initData из Telegram объекта
        if (tg.initData) {
          debugLog.push('Getting initData from Telegram object');
          processInitData(tg.initData, debugLog, 'Telegram object');
        } else {
          debugLog.push('No initData in Telegram object');
        }
      }
      
      // Также проверяем URL параметры (резервный вариант)
      const urlParams = new URLSearchParams(window.location.search);
      const initDataFromUrl = urlParams.get('tgWebAppData');
      
      if (initDataFromUrl && !initData) {
        debugLog.push('Getting initData from URL params');
        processInitData(initDataFromUrl, debugLog, 'URL params');
      }
      
      // Если никаких данных нет - режим разработки
      if (!initData && !parsedData.user) {
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
      // НЕ используем decodeURIComponent - URLSearchParams делает это автоматически
      const params = new URLSearchParams(data);
      const parsed = {};
      
      for (const [key, value] of params) {
        // Пытаемся распарсить JSON значения
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
        backgroundColor: 'var(--tg-theme-bg-color, #ffffff)',
        color: 'var(--tg-theme-text-color, #000000)',
        minHeight: '100vh'
      }}>
        <main>
          <h1 style={{ fontSize: '24px', marginBottom: '20px' }}>Telegram Mini App</h1>
          
          {isLoading && (
            <div style={{ 
              padding: '20px', 
              backgroundColor: '#e3f2fd', 
              borderRadius: '8px',
              textAlign: 'center'
            }}>
              Loading...
            </div>
          )}
          
          {error && (
            <div style={{ 
              padding: '15px', 
              backgroundColor: '#ffebee', 
              borderRadius: '8px',
              marginBottom: '20px',
              color: '#c62828'
            }}>
              <strong>Error:</strong> {error}
            </div>
          )}
          
          <div style={{ 
            marginTop: '20px', 
            backgroundColor: isTelegramEnv ? '#e8f5e9' : '#fff3e0', 
            padding: '15px', 
            borderRadius: '8px',
            marginBottom: '20px'
          }}>
            <h3 style={{ marginTop: 0 }}>Environment</h3>
            <p style={{ margin: '5px 0' }}><strong>Telegram:</strong> {isTelegramEnv ? '✓ Connected' : '✗ Not detected'}</p>
            {isTelegramEnv && (
              <>
                <p style={{ margin: '5px 0' }}><strong>Platform:</strong> {window.Telegram?.WebApp?.platform}</p>
                <p style={{ margin: '5px 0' }}><strong>Version:</strong> {window.Telegram?.WebApp?.version}</p>
              </>
            )}
          </div>

          {parsedData.user && (
            <div style={{ 
              marginTop: '20px', 
              backgroundColor: '#f3e5f5', 
              padding: '15px', 
              borderRadius: '8px',
              marginBottom: '20px'
            }}>
              <h3 style={{ marginTop: 0 }}>User Info</h3>
              <p style={{ margin: '5px 0' }}><strong>ID:</strong> {parsedData.user.id}</p>
              <p style={{ margin: '5px 0' }}><strong>Name:</strong> {parsedData.user.first_name} {parsedData.user.last_name || ''}</p>
              {parsedData.user.username && (
                <p style={{ margin: '5px 0' }}><strong>Username:</strong> @{parsedData.user.username}</p>
              )}
              {parsedData.user.language_code && (
                <p style={{ margin: '5px 0' }}><strong>Language:</strong> {parsedData.user.language_code}</p>
              )}
            </div>
          )}

          <div style={{ marginTop: '20px' }}>
            <h3>Raw Init Data</h3>
            {rawData ? (
              <pre style={{ 
                backgroundColor: '#f5f5f5', 
                padding: '10px', 
                borderRadius: '8px', 
                overflowX: 'auto',
                fontSize: '12px',
                wordBreak: 'break-all'
              }}>
                {rawData}
              </pre>
            ) : (
              <p style={{ color: '#666' }}>No initData received</p>
            )}
          </div>

          <div style={{ marginTop: '20px' }}>
            <h3>Parsed Data</h3>
            {Object.keys(parsedData).length > 0 ? (
              <div style={{ 
                backgroundColor: '#f5f5f5', 
                padding: '15px', 
                borderRadius: '8px'
              }}>
                {Object.entries(parsedData).map(([key, value]) => (
                  <div key={key} style={{ marginBottom: '10px' }}>
                    <strong>{key}:</strong>
                    <pre style={{ 
                      margin: '5px 0 0 0',
                      fontSize: '12px',
                      backgroundColor: '#fff',
                      padding: '8px',
                      borderRadius: '4px',
                      overflowX: 'auto'
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
            <h3>Debug Log</h3>
            <div style={{ 
              backgroundColor: '#212121', 
              color: '#fff',
              padding: '15px', 
              borderRadius: '8px',
              fontSize: '12px',
              fontFamily: 'monospace'
            }}>
              {debugInfo.map((info, index) => (
                <div key={index} style={{ marginBottom: '4px' }}>
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

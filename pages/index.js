import Head from "next/head";
import { useEffect, useState } from "react";

export default function Home() {
  const [parsedData, setParsedData] = useState({});

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const tg = window.Telegram?.WebApp;
      
      if (tg) {
        tg.ready();
        tg.expand();
        
        if (tg.initData) {
          try {
            const params = new URLSearchParams(tg.initData);
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
            
            setParsedData(parsed);
          } catch (err) {
            console.error('Error parsing initData:', err);
          }
        }
      }
    }
  }, []);

  const getInitials = (firstName, lastName) => {
    const first = firstName?.charAt(0) || '';
    const last = lastName?.charAt(0) || '';
    return (first + last).toUpperCase() || '?';
  };

  return (
    <>
      <Head>
        <title>Telegram Mini App</title>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
      </Head>
      <div style={{ 
        padding: '20px', 
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
        maxWidth: '600px',
        margin: '0 auto',
        backgroundColor: '#ffffff',
        minHeight: '100vh'
      }}>
        {/* Profile - Top Right */}
        <div style={{
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'center',
          marginBottom: '30px'
        }}>
          {parsedData.user ? (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              {/* Avatar */}
              <div style={{
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                backgroundColor: '#1a1a1a',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '10px',
                fontWeight: 'bold'
              }}>
                {getInitials(parsedData.user.first_name, parsedData.user.last_name)}
              </div>
              
              {/* Name */}
              <div style={{
                fontSize: '16px',
                fontWeight: 'bold',
                color: '#1a1a1a'
              }}>
                {parsedData.user.first_name} {parsedData.user.last_name || ''}
              </div>
            </div>
          ) : (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              <div style={{
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                backgroundColor: '#ddd',
                color: '#666',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '10px',
                fontWeight: 'bold'
              }}>
                ?
              </div>
              <div style={{
                fontSize: '16px',
                fontWeight: 'bold',
                color: '#666'
              }}>
                Guest
              </div>
            </div>
          )}
        </div>

        {/* Main Content Area - Empty for now */}
        <div style={{ minHeight: '400px' }}>
          {/* Your app content will go here */}
        </div>
      </div>
    </>
  );
}

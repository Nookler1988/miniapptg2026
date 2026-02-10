import Head from "next/head";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function Profile() {
  const [parsedData, setParsedData] = useState({});
  const router = useRouter();

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
        <title>Профиль - Telegram Mini App</title>
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
        {/* Back Button - Top Left */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          marginBottom: '30px'
        }}>
          <button 
            onClick={() => router.push('/')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 16px',
              border: '1px solid #ddd',
              borderRadius: '8px',
              backgroundColor: '#ffffff',
              cursor: 'pointer',
              fontSize: '14px',
              color: '#1a1a1a'
            }}
          >
            <span>←</span>
            <span>Назад</span>
          </button>
        </div>

        {/* Profile Title */}
        <h1 style={{
          fontSize: '24px',
          fontWeight: 'bold',
          marginBottom: '30px',
          color: '#1a1a1a'
        }}>
          Профиль
        </h1>

        {/* User Data */}
        {parsedData.user ? (
          <div style={{
            border: '1px solid #ddd',
            borderRadius: '12px',
            padding: '24px',
            backgroundColor: '#fafafa'
          }}>
            {/* Avatar and Name */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              marginBottom: '24px'
            }}>
              <div style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                backgroundColor: '#1a1a1a',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '24px',
                fontWeight: 'bold'
              }}>
                {getInitials(parsedData.user.first_name, parsedData.user.last_name)}
              </div>
              <div>
                <div style={{
                  fontSize: '20px',
                  fontWeight: 'bold',
                  color: '#1a1a1a',
                  marginBottom: '4px'
                }}>
                  {parsedData.user.first_name} {parsedData.user.last_name || ''}
                </div>
                {parsedData.user.username && (
                  <div style={{
                    fontSize: '14px',
                    color: '#666'
                  }}>
                    @{parsedData.user.username}
                  </div>
                )}
              </div>
            </div>

            {/* User Details */}
            <div style={{
              borderTop: '1px solid #ddd',
              paddingTop: '20px'
            }}>
              <div style={{ marginBottom: '16px' }}>
                <div style={{
                  fontSize: '12px',
                  color: '#666',
                  marginBottom: '4px'
                }}>
                  ID
                </div>
                <div style={{
                  fontSize: '16px',
                  color: '#1a1a1a',
                  fontFamily: 'monospace'
                }}>
                  {parsedData.user.id}
                </div>
              </div>

              {parsedData.user.language_code && (
                <div style={{ marginBottom: '16px' }}>
                  <div style={{
                    fontSize: '12px',
                    color: '#666',
                    marginBottom: '4px'
                  }}>
                    Язык
                  </div>
                  <div style={{
                    fontSize: '16px',
                    color: '#1a1a1a'
                  }}>
                    {parsedData.user.language_code.toUpperCase()}
                  </div>
                </div>
              )}

              {parsedData.user.is_premium && (
                <div>
                  <div style={{
                    fontSize: '12px',
                    color: '#666',
                    marginBottom: '4px'
                  }}>
                    Статус
                  </div>
                  <div style={{
                    fontSize: '16px',
                    color: '#1a1a1a',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}>
                    <span>⭐</span>
                    <span>Premium</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div style={{
            border: '1px solid #ddd',
            borderRadius: '12px',
            padding: '24px',
            backgroundColor: '#fafafa',
            textAlign: 'center'
          }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              backgroundColor: '#ddd',
              color: '#666',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '24px',
              fontWeight: 'bold',
              margin: '0 auto 16px'
            }}>
              ?
            </div>
            <div style={{
              fontSize: '18px',
              color: '#666'
            }}>
              Нет данных пользователя
            </div>
          </div>
        )}
      </div>
    </>
  );
}

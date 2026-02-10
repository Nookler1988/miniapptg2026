import Head from "next/head";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function Home() {
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
        <title>Telegram Mini App</title>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
      </Head>
      <div className="min-h-screen bg-white" style={{ paddingTop: '60px', paddingLeft: '12px', paddingRight: '12px' }}>
        <div className="max-w-lg mx-auto pb-5">
          
          {/* Profile - Top Right (Clickable) */}
          <div className="flex justify-end items-center mb-8">
            {parsedData.user ? (
              <button 
                onClick={() => router.push('/profile')}
                className="flex items-center gap-3 p-1 bg-transparent border-none cursor-pointer hover:opacity-80 transition-opacity"
              >
                {/* Avatar */}
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-white flex items-center justify-center text-xs font-bold">
                  {getInitials(parsedData.user.first_name, parsedData.user.last_name)}
                </div>
                
                {/* Name */}
                <span className="text-base font-bold text-gray-900">
                  {parsedData.user.first_name} {parsedData.user.last_name || ''}
                </span>
              </button>
            ) : (
              <button 
                onClick={() => router.push('/profile')}
                className="flex items-center gap-3 p-1 bg-transparent border-none cursor-pointer hover:opacity-80 transition-opacity"
              >
                <div className="w-6 h-6 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center text-xs font-bold">
                  ?
                </div>
                <span className="text-base font-bold text-gray-500">
                  Guest
                </span>
              </button>
            )}
          </div>

          {/* Main Content Area - Empty for now */}
          <div className="min-h-96">
            {/* Your app content will go here */}
          </div>
        </div>
      </div>
    </>
  );
}

import Head from "next/head";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function Profile() {
  const [parsedData, setParsedData] = useState({});
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    profession: '',
    hobbies: '',
    interests: '',
    about: ''
  });
  const [isSaved, setIsSaved] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const tg = window.Telegram?.WebApp;
      let userId = 'guest';
      
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
            userId = parsed.user?.id || 'guest';
            
            // Load saved data from localStorage
            const savedData = localStorage.getItem(`profile_${userId}`);
            if (savedData) {
              const parsedData = JSON.parse(savedData);
              setFormData(parsedData);
            } else {
              // Pre-fill first and last name from Telegram if no saved data
              if (parsed.user) {
                setFormData(prev => ({
                  ...prev,
                  firstName: parsed.user.first_name || '',
                  lastName: parsed.user.last_name || ''
                }));
              }
            }
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setIsSaved(false);
  };

  const handleSave = () => {
    try {
      // Save to localStorage
      const userId = parsedData.user?.id || 'guest';
      localStorage.setItem(`profile_${userId}`, JSON.stringify(formData));
      console.log('Profile saved to localStorage:', formData);
      
      setIsSaved(true);
      setTimeout(() => {
        setIsSaved(false);
      }, 2000);
    } catch (err) {
      console.error('Error saving:', err);
    }
  };

  const inputStyle = {
    width: '100%',
    padding: '12px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    fontSize: '16px',
    fontFamily: 'inherit',
    boxSizing: 'border-box',
    marginBottom: '4px'
  };

  const labelStyle = {
    fontSize: '14px',
    color: '#666',
    marginBottom: '6px',
    display: 'block'
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

        {/* Avatar */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          marginBottom: '30px'
        }}>
          <div style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            backgroundColor: '#1a1a1a',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '32px',
            fontWeight: 'bold'
          }}>
            {getInitials(formData.firstName, formData.lastName)}
          </div>
          <div>
            <div style={{
              fontSize: '14px',
              color: '#666',
              marginBottom: '4px'
            }}>
              ID: {parsedData.user?.id}
            </div>
            {parsedData.user?.username && (
              <div style={{
                fontSize: '14px',
                color: '#666'
              }}>
                @{parsedData.user.username}
              </div>
            )}
          </div>
        </div>

        {/* Edit Form */}
        <div style={{ marginBottom: '20px' }}>
          <h2 style={{
            fontSize: '18px',
            fontWeight: 'bold',
            marginBottom: '20px',
            color: '#1a1a1a'
          }}>
            Редактировать профиль
          </h2>

          {/* First Name */}
          <div style={{ marginBottom: '16px' }}>
            <label style={labelStyle}>Имя</label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              placeholder="Введите имя"
              style={inputStyle}
            />
          </div>

          {/* Last Name */}
          <div style={{ marginBottom: '16px' }}>
            <label style={labelStyle}>Фамилия</label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              placeholder="Введите фамилию"
              style={inputStyle}
            />
          </div>

          {/* Profession */}
          <div style={{ marginBottom: '16px' }}>
            <label style={labelStyle}>Профессия</label>
            <input
              type="text"
              name="profession"
              value={formData.profession}
              onChange={handleInputChange}
              placeholder="Например: Разработчик, Дизайнер"
              style={inputStyle}
            />
          </div>

          {/* Hobbies */}
          <div style={{ marginBottom: '16px' }}>
            <label style={labelStyle}>Хобби</label>
            <input
              type="text"
              name="hobbies"
              value={formData.hobbies}
              onChange={handleInputChange}
              placeholder="Например: Фотография, путешествия"
              style={inputStyle}
            />
          </div>

          {/* Interests */}
          <div style={{ marginBottom: '16px' }}>
            <label style={labelStyle}>Интересы</label>
            <input
              type="text"
              name="interests"
              value={formData.interests}
              onChange={handleInputChange}
              placeholder="Например: Технологии, искусство, спорт"
              style={inputStyle}
            />
          </div>

          {/* About */}
          <div style={{ marginBottom: '24px' }}>
            <label style={labelStyle}>О себе</label>
            <textarea
              name="about"
              value={formData.about}
              onChange={handleInputChange}
              placeholder="Расскажите о себе..."
              rows={4}
              style={{
                ...inputStyle,
                resize: 'vertical',
                minHeight: '100px'
              }}
            />
          </div>

          {/* Save Button */}
          <button
            onClick={handleSave}
            style={{
              width: '100%',
              padding: '14px',
              backgroundColor: isSaved ? '#4caf50' : '#1a1a1a',
              color: '#ffffff',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: 'pointer',
              transition: 'background-color 0.3s'
            }}
          >
            {isSaved ? '✓ Сохранено!' : 'Сохранить'}
          </button>
        </div>
      </div>
    </>
  );
}

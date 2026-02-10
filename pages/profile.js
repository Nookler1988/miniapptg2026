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

  return (
    <>
      <Head>
        <title>Профиль - Telegram Mini App</title>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
      </Head>
      <div className="min-h-screen bg-white">
        <div className="max-w-lg mx-auto px-5 py-5">
          
          {/* Back Button */}
          <button 
            onClick={() => router.push('/')}
            className="inline-flex items-center gap-2 px-4 py-2 mb-8 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-colors duration-200"
          >
            <span>←</span>
            <span>Назад</span>
          </button>

          {/* Header */}
          <h1 className="text-2xl font-bold text-gray-900 mb-6">
            Профиль
          </h1>

          {/* Avatar Section */}
          <div className="flex items-center gap-4 mb-8">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-white flex items-center justify-center text-2xl font-bold shadow-lg">
              {getInitials(formData.firstName, formData.lastName)}
            </div>
            <div>
              <p className="text-sm text-gray-500">
                ID: {parsedData.user?.id}
              </p>
              {parsedData.user?.username && (
                <p className="text-sm text-gray-500">
                  @{parsedData.user.username}
                </p>
              )}
            </div>
          </div>

          {/* Form */}
          <div className="space-y-5">
            <h2 className="text-lg font-semibold text-gray-800 mb-6">
              Редактировать профиль
            </h2>

            {/* First Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Имя
              </label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                placeholder="Введите имя"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white transition-all duration-200"
              />
            </div>

            {/* Last Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Фамилия
              </label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                placeholder="Введите фамилию"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white transition-all duration-200"
              />
            </div>

            {/* Profession */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Профессия
              </label>
              <input
                type="text"
                name="profession"
                value={formData.profession}
                onChange={handleInputChange}
                placeholder="Например: Разработчик, Дизайнер"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white transition-all duration-200"
              />
            </div>

            {/* Hobbies */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Хобби
              </label>
              <input
                type="text"
                name="hobbies"
                value={formData.hobbies}
                onChange={handleInputChange}
                placeholder="Например: Фотография, путешествия"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white transition-all duration-200"
              />
            </div>

            {/* Interests */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Интересы
              </label>
              <input
                type="text"
                name="interests"
                value={formData.interests}
                onChange={handleInputChange}
                placeholder="Например: Технологии, искусство, спорт"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white transition-all duration-200"
              />
            </div>

            {/* About */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                О себе
              </label>
              <textarea
                name="about"
                value={formData.about}
                onChange={handleInputChange}
                placeholder="Расскажите о себе..."
                rows={4}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white transition-all duration-200 resize-none"
              />
            </div>

            {/* Save Button */}
            <button
              onClick={handleSave}
              className={`w-full py-3.5 px-4 rounded-xl font-semibold text-white transition-all duration-300 transform active:scale-95 ${
                isSaved 
                  ? 'bg-green-500 hover:bg-green-600' 
                  : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl'
              }`}
            >
              {isSaved ? '✓ Сохранено!' : 'Сохранить'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

import Head from "next/head";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useSafeArea } from "@/components/SafeAreaProvider";

export default function Profile() {
  const [parsedData, setParsedData] = useState({});
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    profession: '',
    hobbies: [],
    interests: [],
    about: ''
  });
  const [hobbyInput, setHobbyInput] = useState('');
  const [interestInput, setInterestInput] = useState('');
  const [isSaved, setIsSaved] = useState(false);
  const [isEditing, setIsEditing] = useState(true);
  const router = useRouter();
  const safeArea = useSafeArea();

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
              setIsEditing(false); // Show profile view if data exists
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
  };

  const handleHobbyKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const value = hobbyInput.trim();
      if (value && formData.hobbies.length < 5 && !formData.hobbies.includes(value)) {
        setFormData(prev => ({
          ...prev,
          hobbies: [...prev.hobbies, value]
        }));
        setHobbyInput('');
      }
    }
  };

  const handleInterestKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const value = interestInput.trim();
      if (value && formData.interests.length < 5 && !formData.interests.includes(value)) {
        setFormData(prev => ({
          ...prev,
          interests: [...prev.interests, value]
        }));
        setInterestInput('');
      }
    }
  };

  const removeHobby = (index) => {
    setFormData(prev => ({
      ...prev,
      hobbies: prev.hobbies.filter((_, i) => i !== index)
    }));
  };

  const removeInterest = (index) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.filter((_, i) => i !== index)
    }));
  };

  const handleSave = () => {
    try {
      const userId = parsedData.user?.id || 'guest';
      localStorage.setItem(`profile_${userId}`, JSON.stringify(formData));
      console.log('Profile saved to localStorage:', formData);
      
      setIsSaved(true);
      setIsEditing(false);
      setTimeout(() => {
        setIsSaved(false);
      }, 2000);
    } catch (err) {
      console.error('Error saving:', err);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  return (
    <>
      <Head>
        <title>Профиль - Telegram Mini App</title>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
      </Head>
      <div
        className="min-h-screen bg-white"
        style={{
          paddingTop: `var(--safe-area-top)`,
          paddingBottom: `var(--safe-area-bottom)`,
          paddingLeft: `var(--safe-area-left)`,
          paddingRight: `var(--safe-area-right)`,
        }}
      >
        <div className="max-w-lg mx-auto px-5 py-5">
          {/* Back Button */}
          <button
            onClick={() => router.push("/")}
            className="inline-flex items-center gap-2 px-4 py-2 mb-8 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-colors duration-200"
            style={{ marginTop: `var(--content-safe-area-top)` }}
          >
            <span>←</span>
            <span>Назад</span>
          </button>

          {/* Header */}
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Профиль</h1>

          {/* Avatar Section */}
          <div className="flex items-center gap-4 mb-8">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-white flex items-center justify-center text-2xl font-bold shadow-lg">
              {getInitials(formData.firstName, formData.lastName)}
            </div>
            <div>
              <p className="text-lg font-semibold text-gray-900">
                {formData.firstName} {formData.lastName}
              </p>
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

          {isEditing ? (
            /* Form Mode */
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
                  Хобби <span className="text-gray-400">({formData.hobbies.length}/5)</span>
                </label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {formData.hobbies.map((hobby, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                    >
                      {hobby}
                      <button
                        onClick={() => removeHobby(index)}
                        className="ml-1 text-blue-600 hover:text-blue-800 font-bold"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
                {formData.hobbies.length < 5 && (
                  <input
                    type="text"
                    value={hobbyInput}
                    onChange={(e) => setHobbyInput(e.target.value)}
                    onKeyDown={handleHobbyKeyDown}
                    placeholder="Введите хобби и нажмите Enter"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white transition-all duration-200"
                  />
                )}
              </div>

              {/* Interests */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Интересы <span className="text-gray-400">({formData.interests.length}/5)</span>
                </label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {formData.interests.map((interest, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm"
                    >
                      {interest}
                      <button
                        onClick={() => removeInterest(index)}
                        className="ml-1 text-purple-600 hover:text-purple-800 font-bold"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
                {formData.interests.length < 5 && (
                  <input
                    type="text"
                    value={interestInput}
                    onChange={(e) => setInterestInput(e.target.value)}
                    onKeyDown={handleInterestKeyDown}
                    placeholder="Введите интерес и нажмите Enter"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white transition-all duration-200"
                  />
                )}
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
          ) : (
            /* View Mode */
            <div className="space-y-6">
              <div className="bg-gray-50 rounded-xl p-6 space-y-4">
                {/* Profession */}
                {formData.profession && (
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Профессия</p>
                    <p className="text-lg font-medium text-gray-900">{formData.profession}</p>
                  </div>
                )}

                {/* Hobbies */}
                {formData.hobbies.length > 0 && (
                  <div>
                    <p className="text-sm text-gray-500 mb-2">Хобби</p>
                    <div className="flex flex-wrap gap-2">
                      {formData.hobbies.map((hobby, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                        >
                          {hobby}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Interests */}
                {formData.interests.length > 0 && (
                  <div>
                    <p className="text-sm text-gray-500 mb-2">Интересы</p>
                    <div className="flex flex-wrap gap-2">
                      {formData.interests.map((interest, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm"
                        >
                          {interest}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* About */}
                {formData.about && (
                  <div>
                    <p className="text-sm text-gray-500 mb-1">О себе</p>
                    <p className="text-gray-900 whitespace-pre-wrap">{formData.about}</p>
                  </div>
                )}
              </div>

              {/* Edit Button */}
              <button
                onClick={handleEdit}
                className="w-full py-3.5 px-4 rounded-xl font-semibold text-gray-700 bg-white border-2 border-gray-300 hover:bg-gray-50 hover:border-gray-400 transition-all duration-200"
              >
                Редактировать профиль
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

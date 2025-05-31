import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { LoginPage } from './components/LoginPage';
import { UserDashboard } from './components/UserDashboard';
import { ServiceDashboard } from './components/ServiceDashboard';
import { AdminDashboard } from './components/AdminDashboard';
import { BanUser } from './components/AdminDashboard/BanUser'; // Импортируем компонент бана
import { mockUsers, mockPrinters, mockRequests } from './data/mockData';

function App() {
  const [user, setUser] = useState(null);
  const [view, setView] = useState('login');
  const [printers, setPrinters] = useState([]);
  const [requests, setRequests] = useState([]);
  const [users, setUsers] = useState([]);
  const [bannedUsers, setBannedUsers] = useState([]); // Состояние для заблокированных пользователей
  const [adminView, setAdminView] = useState('main'); // Для переключения между разделами админки

  useEffect(() => {
    setPrinters(mockPrinters);
    setUsers(mockUsers);
    setRequests(mockRequests);
  }, []);

  const handleLogin = (username, password) => {
    const foundUser = users.find(u => 
      u.username === username && 
      u.password === password &&
      !bannedUsers.includes(u.id) // Проверяем, не заблокирован ли пользователь
    );
    
    if (foundUser) {
      setUser(foundUser);
      setView(foundUser.role);
    } else {
      alert(bannedUsers.includes(users.find(u => u.username === username)?.id) 
        ? 'Ваш аккаунт заблокирован' 
        : 'Неверные логин или пароль');
    }
  };

  const handleLogout = () => {
    setUser(null);
    setView('login');
    setAdminView('main'); // Сбрасываем вид админки при выходе
  };

  // Функция для блокировки пользователя
  const handleBanUser = (userId, reason) => {
    if (!bannedUsers.includes(userId)) {
      setBannedUsers([...bannedUsers, userId]);
      // Здесь можно добавить логику сохранения в базу данных
      alert(`Пользователь с ID ${userId} заблокирован. Причина: ${reason}`);
    }
  };

  // Функция для разблокировки пользователя
  const handleUnbanUser = (userId) => {
    setBannedUsers(bannedUsers.filter(id => id !== userId));
    alert(`Пользователь с ID ${userId} разблокирован`);
  };

  const handleRequestSubmit = (printerId, problem) => {
    const newRequest = {
      id: requests.length + 1,
      printerId,
      userId: user.id,
      userName: user.fullName,
      date: new Date().toISOString(),
      status: 'Новая',
      problem
    };
    setRequests([...requests, newRequest]);
  };

  if (view === 'login') {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header user={user} onLogout={handleLogout} />
      <main className="flex-1 container mx-auto px-4 py-8">
        {view === 'user' && (
          <UserDashboard 
            printers={printers} 
            onRequestSubmit={handleRequestSubmit} 
            userRequests={requests.filter(r => r.userId === user.id)} 
          />
        )}
        {view === 'service' && (
          <ServiceDashboard 
            printers={printers} 
            requests={requests}
            onRequestSubmit={handleRequestSubmit}
          />
        )}
        {view === 'admin' && (
          <>
            <div className="flex space-x-4 mb-6">
              <button 
                onClick={() => setAdminView('main')}
                className={`px-4 py-2 rounded ${adminView === 'main' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
              >
                Основная панель
              </button>
              <button 
                onClick={() => setAdminView('ban')}
                className={`px-4 py-2 rounded ${adminView === 'ban' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
              >
                Управление пользователями
              </button>
            </div>

            {adminView === 'main' && (
              <AdminDashboard 
                printers={printers} 
                user={user} 
                onRequestSubmit={handleRequestSubmit} 
                requests={requests}
              />
            )}

            {adminView === 'ban' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <BanUser 
                  users={users.filter(u => u.id !== user.id)} // Исключаем текущего админа
                  onBanUser={handleBanUser}
                />
                
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <h3 className="text-lg font-semibold mb-4">Заблокированные пользователи</h3>
                  {bannedUsers.length === 0 ? (
                    <p>Нет заблокированных пользователей</p>
                  ) : (
                    <ul className="space-y-2">
                      {bannedUsers.map(userId => {
                        const bannedUser = users.find(u => u.id === userId);
                        return (
                          <li key={userId} className="flex justify-between items-center p-2 bg-gray-100 rounded">
                            <span>
                              {bannedUser?.fullName || 'Неизвестный пользователь'} (ID: {userId})
                            </span>
                            <button
                              onClick={() => handleUnbanUser(userId)}
                              className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                            >
                              Разблокировать
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </main>
      <Footer />
    </div>
  );
}

export default App;
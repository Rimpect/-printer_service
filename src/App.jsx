import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { LoginPage } from './components/LoginPage';
import { UserDashboard } from './components/UserDashboard';
import { ServiceDashboard } from './components/ServiceDashboard';
import { AdminDashboard } from './components/AdminDashboard';
import { mockUsers, mockPrinters, mockRequests } from './data/mockData';

function App() {
  const [user, setUser] = useState(null);
  const [view, setView] = useState('login');
  const [printers, setPrinters] = useState([]);
  const [requests, setRequests] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    setPrinters(mockPrinters);
    setUsers(mockUsers);
    setRequests(mockRequests);
  }, []);

  const handleLogin = (username, password) => {
    const foundUser = users.find(u => u.username === username && u.password === password);
    if (foundUser) {
      setUser(foundUser);
      setView(foundUser.role);
    } else {
      alert('Неверные логин или пароль');
    }
  };

  const handleLogout = () => {
    setUser(null);
    setView('login');
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
            onRequestSubmit={handleRequestSubmit} 
            userRequests={requests.filter(r => r.userId === user.id)} 
          />
        )}
        {view === 'admin' && (
          <AdminDashboard 
            printers={printers} 
            onRequestSubmit={handleRequestSubmit} 
            userRequests={requests.filter(r => r.userId === user.id)} 
          />
        )}
        {/* Service Center and Admin dashboards will be implemented next */}
      </main>
      <Footer />
    </div>
  );
}

export default App;
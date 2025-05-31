import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faPlusCircle, faHistory, faTools, 
  faPrint, faExclamationTriangle, 
  faPaperPlane, faListUl, faInbox, faFile, faUserPlus, faUsersCog
} from '@fortawesome/free-solid-svg-icons';
import { AddUserForm } from './AdminDashboard/AddUserForm';
import { GenerateReport } from './AdminDashboard/GenerateReport';
import { NewRequest } from './NewRequest';
import { MyRequests } from './MyRequests';


export function AdminDashboard({ 
  printers = [], 
  onRequestSubmit = () => {}, 
  userRequests = [] 
}) {
  const [selectedPrinter, setSelectedPrinter] = useState('');
  const [problemDescription, setProblemDescription] = useState('');
  const [activeTab, setActiveTab] = useState('newRequest'); // Изменено на 'newRequest' (с маленькой буквы)
  const handleSubmit = (e) => {
    e.preventDefault();
    onRequestSubmit(selectedPrinter, problemDescription);
    setSelectedPrinter('');
    setProblemDescription('');
    setActiveTab('myRequests');
  };

  const safeUserRequests = Array.isArray(userRequests) ? userRequests : [];
  const safePrinters = Array.isArray(printers) ? printers : [];

  const tabs = [
    {
      id: 'newRequest',
      icon: faPlusCircle,
      label: 'Новая заявка',
      badge: null
    },
    {
      id: 'myRequests',
      icon: faHistory,
      label: 'Мои заявки',
      badge: safeUserRequests.length
    },
    {
      id: 'AddUsers',
      icon: faUserPlus,
      label: 'Регистрация нового пользователя',
      badge: null
    },
    {
      id: 'GenerateReport',
      icon: faFile,
      label: 'Сгенерировать отчет',
      badge: null
    }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'newRequest':
        return (
          <NewRequest
            printers={safePrinters}
            selectedPrinter={selectedPrinter}
            setSelectedPrinter={setSelectedPrinter}
            problemDescription={problemDescription}
            setProblemDescription={setProblemDescription}
            handleSubmit={handleSubmit}
          />
        );
      case 'myRequests':
        return <MyRequests userRequests={safeUserRequests} />;
      case 'AddUsers':
        return <AddUserForm />;
      case 'GenerateReport':
        return <GenerateReport />;
      default:
        return  (
          <NewRequest
            printers={safePrinters}
            selectedPrinter={selectedPrinter}
            setSelectedPrinter={setSelectedPrinter}
            problemDescription={problemDescription}
            setProblemDescription={setProblemDescription}
            handleSubmit={handleSubmit}
          />
        );
    }
  };

  return (
    <div className="user-dashboard">
      <div className="flex gap-4 mb-6 border-b border-gray-200 overflow-x-auto">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`px-4 py-2 font-medium flex items-center gap-2 whitespace-nowrap ${
              activeTab === tab.id 
                ? 'text-blue-600 border-b-2 border-blue-600' 
                : 'text-gray-600'
            }`}
            onClick={() => setActiveTab(tab.id)}
          >
            <FontAwesomeIcon icon={tab.icon} />
            {tab.label}
            {tab.badge !== null && (
              <span className="bg-gray-200 text-gray-800 text-xs font-semibold px-2 py-1 rounded-full">
                {tab.badge}
              </span>
            )}
          </button>
        ))}
      </div>

      {renderTabContent()}
    </div>
  );
}
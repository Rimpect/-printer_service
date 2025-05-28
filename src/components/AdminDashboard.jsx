import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faPlusCircle, faHistory, faTools, 
  faPrint, faExclamationTriangle, 
  faPaperPlane, faListUl, faInbox, faBan, faFile, faUserPlus
} from '@fortawesome/free-solid-svg-icons';
import { AddUserForm } from './AdminDashboard/AddUserForm';
import { BanUser } from './AdminDashboard/BanUser';
import { GenerateReport } from './AdminDashboard/GenerateReport';
import { NewRequest } from './NewRequest';
import { MyRequests } from './MyRequests';
export function AdminDashboard({ printers, onRequestSubmit, userRequests }) {
  const [selectedPrinter, setSelectedPrinter] = useState('');
  const [problemDescription, setProblemDescription] = useState('');
  const [activeTab, setActiveTab] = useState('newRequest');

  const handleSubmit = (e) => {
    e.preventDefault();
    onRequestSubmit(selectedPrinter, problemDescription);
    setSelectedPrinter('');
    setProblemDescription('');
    setActiveTab('myRequests');
    setActiveTab('AddUsers');
  };

  return (
    <div className="user-dashboard">
      <div className="flex gap-4 mb-6 border-b border-gray-200">
        <button 
          className={`px-4 py-2 font-medium flex items-center gap-2 ${activeTab === 'newRequest' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600'}`}
          onClick={() => setActiveTab('newRequest')}
        >
          <FontAwesomeIcon icon={faPlusCircle} />
          Новая заявка
        </button>
        <button 
          className={`px-4 py-2 font-medium flex items-center gap-2 ${activeTab === 'myRequests' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600'}`}
          onClick={() => setActiveTab('myRequests')}
        >
          <FontAwesomeIcon icon={faHistory} />
          Мои заявки ({userRequests.length})
        </button>
         <button 
          className={`px-4 py-2 font-medium flex items-center gap-2 ${activeTab === 'AddUsers' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600'}`}
          onClick={() => setActiveTab('AddUsers')}
        >
          <FontAwesomeIcon icon={faUserPlus} />
          Регистрация нового пользователя
        </button>
         <button 
          className={`px-4 py-2 font-medium flex items-center gap-2 ${activeTab === 'GenerateReport' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600'}`}
          onClick={() => setActiveTab('GenerateReport')}
        >
          <FontAwesomeIcon icon={faFile} />
          Сгенерировать отчет
        </button>
           <button 
          className={`px-4 py-2 font-medium flex items-center gap-2 ${activeTab === 'BanUser' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600'}`}
          onClick={() => setActiveTab('BanUser')}
        >
          <FontAwesomeIcon icon={faBan} />
          Блокировка пользователя
        </button>
      </div>

         {activeTab === 'newRequest' && (
             <NewRequest
               printers={printers}
               selectedPrinter={selectedPrinter}
               setSelectedPrinter={setSelectedPrinter}
               problemDescription={problemDescription}
               setProblemDescription={setProblemDescription}
               handleSubmit={handleSubmit}
             />
           )}
     
           {activeTab === 'myRequests' && (
            <MyRequests 
               userRequests={userRequests}
             />
           )}
            {activeTab === 'AddUsers' && (
            <AddUserForm 
            //    userRequests={userRequests}
             />
           )}
            {activeTab === 'GenerateReport' && (
            <GenerateReport 
            //    userRequests={userRequests}
             />
           )}
             {activeTab === 'BanUser' && (
            <BanUser 
            //    userRequests={userRequests}
             />
           )}
    </div>
  );
}
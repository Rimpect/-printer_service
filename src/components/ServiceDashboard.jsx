import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faPlusCircle, faHistory, faTools, 
  faPrint, faExclamationTriangle, 
  faPaperPlane, faListUl, faInbox 
} from '@fortawesome/free-solid-svg-icons';
import { NewRequest } from './NewRequest';
import { MyRequests } from './MyRequests';
export function ServiceDashboard({ printers, onRequestSubmit, userRequests }) {
  const [selectedPrinter, setSelectedPrinter] = useState('');
  const [problemDescription, setProblemDescription] = useState('');
  const [activeTab, setActiveTab] = useState('newRequest');

  const handleSubmit = (e) => {
    e.preventDefault();
    onRequestSubmit(selectedPrinter, problemDescription);
    setSelectedPrinter('');
    setProblemDescription('');
    setActiveTab('myRequests');
  };

  return (
    <div className="user-dashboard">
      <div className="flex gap-4 mb-6 border-b border-gray-200">
        <button 
          className={`px-4 py-2 font-medium flex items-center gap-2 ${activeTab === 'newRequest' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600'}`}
          onClick={() => setActiveTab('newRequest')}
        >
          <FontAwesomeIcon icon={faPlusCircle} />
          Принятые заявки
        </button>
        <button 
          className={`px-4 py-2 font-medium flex items-center gap-2 ${activeTab === 'myRequests' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600'}`}
          onClick={() => setActiveTab('myRequests')}
        >
          <FontAwesomeIcon icon={faHistory} />
          Заявки пользователей ({userRequests.length})
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
    </div>
  );
}
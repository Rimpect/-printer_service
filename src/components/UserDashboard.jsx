import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faPlusCircle, faHistory, faTools, 
  faPrint, faExclamationTriangle, 
  faPaperPlane, faListUl, faInbox 
} from '@fortawesome/free-solid-svg-icons';

export function UserDashboard({ printers, onRequestSubmit, userRequests }) {
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
          Новая заявка
        </button>
        <button 
          className={`px-4 py-2 font-medium flex items-center gap-2 ${activeTab === 'myRequests' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600'}`}
          onClick={() => setActiveTab('myRequests')}
        >
          <FontAwesomeIcon icon={faHistory} />
          Мои заявки ({userRequests.length})
        </button>
      </div>

      {activeTab === 'newRequest' && (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
            <FontAwesomeIcon icon={faTools} />
            Форма обращения в сервисный центр
          </h3>
          
          <div className="mb-6">
            <label htmlFor="printerSelect" className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <FontAwesomeIcon icon={faPrint} />
              Выберите принтер
            </label>
            <select
              id="printerSelect"
              value={selectedPrinter}
              onChange={(e) => setSelectedPrinter(e.target.value)}
              className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="">-- Выберите принтер --</option>
              {printers.map(printer => (
                <option key={printer.id} value={printer.id}>
                  {printer.id} - {printer.model} ({printer.location})
                </option>
              ))}
            </select>
          </div>
          
          <div className="mb-6">
            <label htmlFor="problemDescription" className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <FontAwesomeIcon icon={faExclamationTriangle} />
              Описание проблемы
            </label>
            <textarea
              id="problemDescription"
              value={problemDescription}
              onChange={(e) => setProblemDescription(e.target.value)}
              className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
              rows="4"
            />
          </div>
          
          <button type="submit" className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors flex items-center justify-center gap-2">
            <FontAwesomeIcon icon={faPaperPlane} />
            Отправить заявку
          </button>
        </form>
      )}

      {activeTab === 'myRequests' && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
            <FontAwesomeIcon icon={faListUl} />
            История моих заявок
          </h3>
          
          {userRequests.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <FontAwesomeIcon icon={faInbox} className="text-4xl mb-4" />
              <p>У вас пока нет отправленных заявок</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">№</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Принтер</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Дата</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Проблема</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Статус</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {userRequests.map((request, index) => (
                    <tr key={request.id}>
                      <td className="px-6 py-4 whitespace-nowrap">{index + 1}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{request.printerId}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{new Date(request.date).toLocaleString()}</td>
                      <td className="px-6 py-4">{request.problem}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`status-badge ${request.status.toLowerCase()}`}>
                          {request.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
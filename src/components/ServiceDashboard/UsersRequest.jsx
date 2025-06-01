import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faListUl, faInbox 
} from '@fortawesome/free-solid-svg-icons';

export function UsersRequest({ 
  userRequests
}) {    
    return(
       <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
            <FontAwesomeIcon icon={faListUl} />
            Заявки пользователей
          </h3>
          
          {userRequests.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <FontAwesomeIcon icon={faInbox} className="text-4xl mb-4" />
              <p>Заявок от пользователей нет</p>
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
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Принять заявку</th>
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
                       <td className="px-6 py-4 whitespace-nowrap"> <button type="submit" className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors flex items-center justify-center gap-2">Принять заявку</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
    )
}
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faListUl, faInbox, faPrint, faCalendarAlt, faExclamationCircle, faCheckCircle } from '@fortawesome/free-solid-svg-icons';

export function MyRequests({ userRequests = [] }) {    
    // Функция для получения иконки статуса
    const getStatusIcon = (status) => {
        switch(status.toLowerCase()) {
            case 'выполнено': return faCheckCircle;
            case 'в работе': return faExclamationCircle;
            default: return faExclamationCircle;
        }
    };

    return (
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
            <h3 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6 flex items-center gap-2">
                <FontAwesomeIcon icon={faListUl} className="text-blue-500" />
                История моих заявок
            </h3>
            
            {userRequests.length === 0 ? (
                <div className="text-center py-6 text-gray-500">
                    <FontAwesomeIcon icon={faInbox} className="text-4xl mb-3 text-gray-300" />
                    <p className="text-gray-600">У вас пока нет отправленных заявок</p>
                </div>
            ) : (
                <>
                    {/* Десктопная версия (таблица) */}
                    <div className="hidden md:block overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">№</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        <FontAwesomeIcon icon={faPrint} className="mr-1" /> Принтер
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        <FontAwesomeIcon icon={faCalendarAlt} className="mr-1" /> Дата
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        <FontAwesomeIcon icon={faExclamationCircle} className="mr-1" /> Проблема
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Статус</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {userRequests.map((request, index) => (
                                    <tr key={request.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{index + 1}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{request.printerId}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {new Date(request.date).toLocaleString('ru-RU')}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-900 max-w-xs">{request.problem}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 w-fit ${
                                                request.status.toLowerCase() === 'выполнено' 
                                                    ? 'bg-green-100 text-green-800' 
                                                    : 'bg-yellow-100 text-yellow-800'
                                            }`}>
                                                <FontAwesomeIcon icon={getStatusIcon(request.status)} />
                                                {request.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    
                    {/* Мобильная версия (карточки) */}
                    <div className="md:hidden space-y-3">
                        {userRequests.map((request, index) => (
                            <div key={request.id} className="border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="col-span-2 flex justify-between items-center border-b pb-2 mb-2">
                                        <span className="font-medium text-gray-700">№ {index + 1}</span>
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                            request.status.toLowerCase() === 'выполнено' 
                                                ? 'bg-green-100 text-green-800' 
                                                : 'bg-yellow-100 text-yellow-800'
                                        }`}>
                                            {request.status}
                                        </span>
                                    </div>
                                    
                                    <div>
                                        <p className="text-xs text-gray-500 flex items-center gap-1">
                                            <FontAwesomeIcon icon={faPrint} /> Принтер
                                        </p>
                                        <p className="text-sm font-medium truncate">{request.printerId}</p>
                                    </div>
                                    
                                    <div>
                                        <p className="text-xs text-gray-500 flex items-center gap-1">
                                            <FontAwesomeIcon icon={faCalendarAlt} /> Дата
                                        </p>
                                        <p className="text-sm">{new Date(request.date).toLocaleDateString('ru-RU')}</p>
                                    </div>
                                    
                                    <div className="col-span-2">
                                        <p className="text-xs text-gray-500 flex items-center gap-1">
                                            <FontAwesomeIcon icon={faExclamationCircle} /> Проблема
                                        </p>
                                        <p className="text-sm mt-1">{request.problem}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}
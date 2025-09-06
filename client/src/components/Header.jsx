import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPrint, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';

export function Header({ user, onLogout }) {
  const getUserRole = () => {
    switch(user.role) {
      case 'user': return 'Пользователь';
      case 'service': return 'Сервисный центр';
      case 'admin': return 'Администратор';
      default: return '';
    }
  };

  return (
  <header className="bg-gray-800 text-white p-3 flex flex-col md:flex-row justify-between items-center shadow-md gap-3 md:gap-0">
    <div className="flex items-center gap-2">
      <h1 className="text-xl md:text-2xl font-bold flex items-center gap-2">
        <FontAwesomeIcon icon={faPrint} className="text-blue-400" />
        Учёт принтеров
      </h1>
    </div>
    
    <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4">
      <div className="text-center md:text-right">
        <div className="font-medium text-sm md:text-base">{user.fullName}</div>
        <div className="text-xs md:text-sm text-gray-300">{getUserRole()}</div>
      </div>
      <button 
        onClick={onLogout}
        className="border border-gray-300 px-3 py-1 md:px-4 md:py-2 rounded flex items-center gap-2 hover:bg-gray-700 transition-colors text-sm md:text-base"
      >
        <FontAwesomeIcon icon={faSignOutAlt} size="sm"/>
        <span>Выйти</span>
      </button>
    </div>
  </header>
  );
}
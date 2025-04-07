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
    <header className="bg-gray-800 text-white p-4 flex justify-between items-center shadow-md">
      <div className="flex items-center gap-2">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <FontAwesomeIcon icon={faPrint} className="text-blue-400" />
          Учёт принтеров
        </h1>
      </div>
      <div className="flex items-center gap-4">
        <div className="text-right">
          <div className="font-medium">{user.fullName}</div>
          <div className="text-sm text-gray-300">{getUserRole()}</div>
        </div>
        <button 
          onClick={onLogout}
          className="border border-gray-300 px-4 py-2 rounded flex items-center gap-2 hover:bg-gray-700 transition-colors"
        >
          <FontAwesomeIcon icon={faSignOutAlt} />
          Выйти
        </button>
      </div>
    </header>
  );
}
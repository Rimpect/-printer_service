import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPhone } from '@fortawesome/free-solid-svg-icons';

export function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-6 text-center mt-auto">
      <p className="mb-2">Система учёта принтеров вуза © {new Date().getFullYear()}</p>
      <p className="flex items-center justify-center gap-2">
        <FontAwesomeIcon icon={faPhone} />
        Контактный телефон: +7 (123) 456-78-90
      </p>
    </footer>
  );
}
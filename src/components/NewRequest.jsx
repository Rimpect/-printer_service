import React, { useState,useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { fetchPrinters, createServiceRequest } from '../api/api';
import { 
  faTools, faPrint, 
  faExclamationTriangle, faPaperPlane 
} from '@fortawesome/free-solid-svg-icons';
export function NewRequest() {
  const [printers, setPrinters] = useState([]);
  const [selectedPrinter, setSelectedPrinter] = useState('');
  const [problemDescription, setProblemDescription] = useState('');

  // Загрузка принтеров при монтировании компонента
  useEffect(() => {
    const loadPrinters = async () => {
      try {
        const data = await fetchPrinters();
        setPrinters(data);
      } catch (error) {
        console.error('Error loading printers:', error);
      }
    };
    loadPrinters();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createServiceRequest({
        printer_id: selectedPrinter,
        problem_description: problemDescription
      });
      alert('Заявка успешно создана!');
      // Сброс формы
      setSelectedPrinter('');
      setProblemDescription('');
    } catch (error) {
      console.error('Error creating request:', error);
      alert('Ошибка при создании заявки');
    }
  }; 
  return (
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
        className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm md:text-base"
        required
      >
        <option value="">-- Выберите принтер --</option>
        {printers.map(printer => (
          <option 
            key={printer.id} 
            value={printer.id}
            className="truncate"
            title={`${printer.id} - ${printer.model} (${printer.location})`}
          >
            {printer.id} - {printer.model} {window.innerWidth > 640 && `(${printer.location})`}
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
  );
}
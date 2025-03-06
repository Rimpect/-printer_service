import React from 'react';

const AnalyticsDashboard = ({ data }) => {
  return (
    <div>
      <h2>Аналитика</h2>
      <p>Количество заявок: {data.totalRequests}</p>
      <p>Среднее время выполнения: {data.averageTime} мин</p>
      <p>Затраты на обслуживание: {data.totalCost} руб</p>
    </div>
  );
};

export default AnalyticsDashboard;
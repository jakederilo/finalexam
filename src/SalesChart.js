// SalesChart component
import React from 'react';
import { Bar } from 'react-chartjs-2';


const SalesChart = ({ transactions }) => {
  // Calculate sales data
  const salesData = transactions.reduce((acc, transaction) => {
    transaction.items.forEach((item) => {
      const productName = item.name;

      if (!acc[productName]) {
        acc[productName] = 0;
      }

      acc[productName] += item.quantity;
    });

    return acc;
  }, {});

  // Chart data
  const chartData = {
    labels: Object.keys(salesData),
    datasets: [
      {
        label: 'Sales',
        data: Object.values(salesData),
        backgroundColor: 'rgba(245, 85, 74, 0.7)',
        borderColor: 'rgba(245, 85, 74, 1)',
        borderWidth: 1,
      },
    ],
  };

  // Chart options
  const options = {
    scales: {
      x: {
        type: 'category',
        beginAtZero: true,
      },
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="chart-container">
      <Bar data={chartData} options={options} />
    </div>
  );
};

export default SalesChart;
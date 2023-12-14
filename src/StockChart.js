import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

const StockChart = ({ products }) => {
  const chartRef = useRef(null);

  useEffect(() => {
    // Destroy the previous chart instance
    if (chartRef.current) {
      chartRef.current.destroy();
    }

    // Render the new chart
    const ctx = document.getElementById('stock-chart');
    chartRef.current = new Chart(ctx, {
      type: 'line', // Change the chart type to 'line'
      data: {
        labels: products.map((product) => product.name),
        datasets: [
          {
            label: 'Stock',
            data: products.map((product) => product.stock),
            backgroundColor: 'rgba(75,192,192,0.4)', // Change the color as needed
            borderColor: 'rgba(75,192,192,1)', // Change the color as needed
            borderWidth: 1,
          },
        ],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });
  }, [products]);

  return <canvas id="stock-chart" />;
};

export default StockChart;

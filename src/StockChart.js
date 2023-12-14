// StockChart component
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
      type: 'line',
      data: {
        labels: products.map((product) => product.name),
        datasets: [
          {
            label: 'Stock',
            data: products.map((product) => product.stock),
            backgroundColor: 'rgba(75,192,192,0.4)',
            borderColor: 'rgba(75,192,192,1)',
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

  

  return (
    <div className="chart-container">
      
      <canvas id="stock-chart" />
    </div>
  );
};

export default StockChart;

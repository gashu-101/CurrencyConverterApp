import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import axios from 'axios';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface HistoricalRatesChartProps {
  fromCurrency: string;
  toCurrency: string;
  darkMode?: boolean;
}

export function HistoricalRatesChart({ fromCurrency, toCurrency, darkMode }: HistoricalRatesChartProps) {
  const [historicalRates, setHistoricalRates] = useState<{ date: string; rate: number | null }[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Sample data for the last 7 days
  const sampleData = [
    { date: '2023-01-01', rate: 1.1 },
    { date: '2023-01-02', rate: 1.15 },
    { date: '2023-01-03', rate: 1.2 },
    { date: '2023-01-04', rate: 1.25 },
    { date: '2023-01-05', rate: 1.2 },
    { date: '2023-01-06', rate: 1.18 },
    { date: '2023-01-07', rate: 1.22 },
  ];

  useEffect(() => {
    let isMounted = true;

    const fetchHistoricalRates = async () => {
      setLoading(true);
      setError(null);

      try {
        const dates: string[] = [];
        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - 7);

        for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
          dates.push(new Date(d).toISOString().split('T')[0]);
        }

        const ratesPromises = dates.map(date =>
          axios.get(`https://api.exchangerate.host/${date}?base=${fromCurrency}&symbols=${toCurrency}`, {
            timeout: 5000
          })
        );

        const responses = await Promise.all(ratesPromises);
        const rates = responses.map((response, index) => ({
          date: dates[index],
          rate: response.data?.rates?.[toCurrency] || null
        })).filter(rate => rate.rate !== null);

        if (rates.length === 0) {
          throw new Error('No valid rates received');
        }

        if (isMounted) {
          setHistoricalRates(rates);
        }
      } catch (error) {
        console.error('Failed to fetch historical rates:', error);
        if (isMounted) {
          setError((error as Error).message || 'Unable to load historical data. Using sample data.');
          // Fallback to sample data
          setHistoricalRates(sampleData);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchHistoricalRates();

    return () => {
      isMounted = false;
    };
  }, [fromCurrency, toCurrency]);

  if (loading) {
    return (
      <div className="mt-8">
        <h2 className={`text-xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          Historical Exchange Rates (Last 7 Days)
        </h2>
        <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
          <div className="animate-pulse flex justify-center items-center h-[300px]">
            <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Loading chart data...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-8">
        <h2 className={`text-xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          Historical Exchange Rates (Last 7 Days)
        </h2>
        <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-800 text-gray-300' : 'bg-gray-100 text-gray-600'}`}>
          <p className="text-center">{error}</p>
        </div>
      </div>
    );
  }

  const chartData = {
    labels: historicalRates.map(rate => rate.date),
    datasets: [
      {
        label: `${fromCurrency} to ${toCurrency} Exchange Rate`,
        data: historicalRates.map(rate => rate.rate),
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
      }
    ]
  };

  const options = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: false,
        grid: {
          color: darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
        },
        ticks: {
          color: darkMode ? '#fff' : '#666'
        }
      },
      x: {
        grid: {
          color: darkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
        },
        ticks: {
          color: darkMode ? '#fff' : '#666'
        }
      }
    },
    plugins: {
      legend: {
        labels: {
          color: darkMode ? '#fff' : '#666'
        }
      }
    }
  };

  return (
    <div className="mt-8">
      <h2 className={`text-xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
        Historical Exchange Rates (Last 7 Days)
      </h2>
      <Line data={chartData} options={options} />
    </div>
  );
}
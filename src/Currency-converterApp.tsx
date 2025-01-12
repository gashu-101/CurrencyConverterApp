import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ArrowRightLeft, Moon, Sun } from 'lucide-react';
import { CurrencySelector } from './components/CurrencySelector';
import { AmountInput } from './components/AmountInput';
import { ConversionResult } from './components/ConversionResult';
import { HistoricalRatesChart } from './components/HistoricalRatesChart';
import { FavoriteCurrencies } from './components/FavoriteCurrencies';

function App() {
  const [fromCurrency, setFromCurrency] = useState<string>('USD');
  const [toCurrency, setToCurrency] = useState<string>('EUR');
  const [amount, setAmount] = useState<string>('1');
  const [exchangeRate, setExchangeRate] = useState<number>(1);
  const [currencies, setCurrencies] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [favorites, setFavorites] = useState<Array<{ from: string; to: string }>>([]);

  useEffect(() => {
    const fetchCurrencies = async () => {
      try {
        const storedCurrencies = localStorage.getItem('currencies');
        if (storedCurrencies) {
          setCurrencies(JSON.parse(storedCurrencies));
          setLoading(false);
        } else {
          const response = await axios.get('https://api.exchangerate-api.com/v4/latest/USD');
          const currencyList = Object.keys(response.data.rates);
          setCurrencies(currencyList);
          localStorage.setItem('currencies', JSON.stringify(currencyList));
          setLoading(false);
        }
      } catch (err) {
        setError('Failed to fetch currencies. Please try again later.');
        setLoading(false);
      }
    };

    fetchCurrencies();
  }, []);

  useEffect(() => {
    const fetchExchangeRate = async () => {
      if (fromCurrency === toCurrency) {
        setExchangeRate(1);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const storedRates = JSON.parse(localStorage.getItem('exchangeRates') || '{}');
        const storedTimestamp = localStorage.getItem('ratesTimestamp');
        const currentTime = new Date().getTime();

        if (
          storedRates[fromCurrency]?.[toCurrency] &&
          storedTimestamp &&
          currentTime - parseInt(storedTimestamp) < 3600000
        ) {
          setExchangeRate(storedRates[fromCurrency][toCurrency]);
        } else {
          const response = await axios.get(`https://api.exchangerate-api.com/v4/latest/${fromCurrency}`);
          setExchangeRate(response.data.rates[toCurrency]);
          
          // Update stored rates
          storedRates[fromCurrency] = response.data.rates;
          localStorage.setItem('exchangeRates', JSON.stringify(storedRates));
          localStorage.setItem('ratesTimestamp', currentTime.toString());
        }
        
        setError(null);
      } catch (err) {
        setError('Failed to fetch exchange rate. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchExchangeRate();
  }, [fromCurrency, toCurrency]);

  useEffect(() => {
    const storedFavorites = localStorage.getItem('favorites');
    if (storedFavorites) {
      setFavorites(JSON.parse(storedFavorites));
    }
  }, []);

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (parseFloat(value) >= 0 || value === '') {
      setAmount(value);
    }
  };

  const handleSwapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const addToFavorites = () => {
    const newFavorite = { from: fromCurrency, to: toCurrency };
    const updatedFavorites = [...favorites, newFavorite];
    setFavorites(updatedFavorites);
    localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
  };

  const removeFavorite = (index: number) => {
    const updatedFavorites = favorites.filter((_, i) => i !== index);
    setFavorites(updatedFavorites);
    localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
  };

  const selectFavorite = (pair: { from: string; to: string }) => {
    setFromCurrency(pair.from);
    setToCurrency(pair.to);
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'} transition-colors duration-300`}>
      <div className="container mx-auto p-4 max-w-md">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Currency Converter</h1>
          <button 
            onClick={toggleDarkMode}
            className={`p-2 rounded-full ${darkMode ? 'bg-yellow-400 hover:bg-yellow-500' : 'bg-gray-800 hover:bg-gray-900'} text-white`}
          >
            {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        </div>

        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-md rounded px-8 pt-6 pb-8 mb-4 transition-colors duration-300`}>
          <CurrencySelector
            label="From Currency"
            value={fromCurrency}
            onChange={(e) => setFromCurrency(e.target.value)}
            currencies={currencies}
            darkMode={darkMode}
          />
          <CurrencySelector
            label="To Currency"
            value={toCurrency}
            onChange={(e) => setToCurrency(e.target.value)}
            currencies={currencies}
            darkMode={darkMode}
          />
          <AmountInput
            value={amount}
            onChange={handleAmountChange}
            darkMode={darkMode}
          />
          
          <div className="flex gap-4 mb-4">
            <button 
              onClick={handleSwapCurrencies}
              className="flex-1 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-colors duration-300"
            >
              <div className="flex items-center justify-center gap-2">
                <ArrowRightLeft className="w-5 h-5" />
                <span>Swap</span>
              </div>
            </button>
            <button 
              onClick={addToFavorites}
              className="flex-1 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-colors duration-300"
            >
              Add to Favorites
            </button>
          </div>

          <ConversionResult
            fromCurrency={fromCurrency}
            toCurrency={toCurrency}
            amount={parseFloat(amount) || 0}
            exchangeRate={exchangeRate}
            error={error}
            loading={loading}
            darkMode={darkMode}
          />

          <FavoriteCurrencies 
            favorites={favorites}
            onSelect={selectFavorite}
            onRemove={removeFavorite}
            darkMode={darkMode}
          />

          <HistoricalRatesChart 
            fromCurrency={fromCurrency}
            toCurrency={toCurrency}
            darkMode={darkMode}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
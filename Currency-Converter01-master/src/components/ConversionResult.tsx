import { RefreshCw } from 'lucide-react';

interface ConversionResultProps {
  fromCurrency: string;
  toCurrency: string;
  amount: number;
  exchangeRate: number;
  error: string | null;
  loading: boolean;
  darkMode?: boolean;
}

export function ConversionResult({
  fromCurrency,
  toCurrency,
  amount,
  exchangeRate,
  error,
  loading,
  darkMode
}: ConversionResultProps) {
  if (loading) {
    return (
      <div className="flex items-center justify-center gap-2 mt-4 p-4 bg-blue-100 text-blue-700 rounded">
        <RefreshCw className="w-5 h-5 animate-spin" />
        <span>Converting...</span>
      </div>
    );
  }

  if (error) {
    return <div className="mt-4 p-4 bg-red-100 text-red-700 rounded">{error}</div>;
  }

  const convertedAmount = amount * exchangeRate;
  return (
    <div className={`mt-4 p-4 rounded shadow transition-all duration-300 ease-in-out ${
      darkMode ? 'bg-gray-700' : 'bg-white'
    }`}>
      <h2 className={`text-xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
        Conversion Result:
      </h2>
      <p className={darkMode ? 'text-white' : 'text-gray-900'}>
        {amount} {fromCurrency} = {convertedAmount.toFixed(2)} {toCurrency}
      </p>
      <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
        Exchange Rate: 1 {fromCurrency} = {exchangeRate.toFixed(4)} {toCurrency}
      </p>
    </div>
  );
}
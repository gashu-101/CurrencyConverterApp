import React from 'react';

interface CurrencySelectorProps {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  currencies: string[];
  darkMode?: boolean;
}

export function CurrencySelector({ label, value, onChange, currencies, darkMode }: CurrencySelectorProps) {
  return (
    <div className="mb-4">
      <label className={`block ${darkMode ? 'text-white' : 'text-gray-700'} text-sm font-bold mb-2`} htmlFor={label}>
        {label}
      </label>
      <select
        id={label}
        value={value}
        onChange={onChange}
        className={`shadow appearance-none border rounded w-full py-2 px-3 ${
          darkMode ? 'bg-gray-700 text-white' : 'text-gray-700'
        } leading-tight focus:outline-none focus:shadow-outline`}
      >
        {currencies.map(currency => (
          <option key={currency} value={currency}>{currency}</option>
        ))}
      </select>
    </div>
  );
}
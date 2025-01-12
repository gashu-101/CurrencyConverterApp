import React from 'react';

interface AmountInputProps {
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  darkMode?: boolean;
}

export function AmountInput({ value, onChange, darkMode }: AmountInputProps) {
  return (
    <div className="mb-4">
      <label className={`block ${darkMode ? 'text-white' : 'text-gray-700'} text-sm font-bold mb-2`} htmlFor="amount">
        Amount
      </label>
      <input
        id="amount"
        type="number"
        value={value}
        onChange={onChange}
        className={`shadow appearance-none border rounded w-full py-2 px-3 ${
          darkMode ? 'bg-gray-700 text-white' : 'text-gray-700'
        } leading-tight focus:outline-none focus:shadow-outline`}
        placeholder="Enter amount"
        min="0"
        step="0.01"
      />
    </div>
  );
}
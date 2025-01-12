interface FavoriteCurrency {
  from: string;
  to: string;
}

interface FavoriteCurrenciesProps {
  favorites: FavoriteCurrency[];
  onSelect: (pair: FavoriteCurrency) => void;
  onRemove: (index: number) => void;
  darkMode?: boolean;
}

export function FavoriteCurrencies({ favorites, onSelect, onRemove, darkMode }: FavoriteCurrenciesProps) {
  return (
    <div className="mt-4">
      <h2 className={`text-xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
        Favorite Currency Pairs
      </h2>
      {favorites.length === 0 ? (
        <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>No favorites added yet.</p>
      ) : (
        <ul>
          {favorites.map((pair, index) => (
            <li key={index} className="flex justify-between items-center mb-2">
              <button 
                onClick={() => onSelect(pair)}
                className="text-blue-500 hover:text-blue-700"
              >
                {pair.from} to {pair.to}
              </button>
              <button 
                onClick={() => onRemove(index)}
                className="text-red-500 hover:text-red-700"
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
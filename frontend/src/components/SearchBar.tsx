import React from 'react';
import useDebounce from '../hooks/useDebounce';

type Props = {
  value: string;
  onChange: (v: string) => void;
};

const SearchBar: React.FC<Props> = ({ value, onChange }) => {
  const debounced = useDebounce(value, 300);
  React.useEffect(() => {
    onChange(debounced);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debounced]);

  return (
    <div style={{ marginBottom: 16 }}>
      <input
        type="search"
        placeholder="Buscar productos..."
        defaultValue={value}
        onChange={(e) => onChange(e.target.value)}
        style={{ width: '100%', padding: '8px 12px', borderRadius: 6, border: '1px solid #ddd' }}
      />
    </div>
  );
};

export default SearchBar;

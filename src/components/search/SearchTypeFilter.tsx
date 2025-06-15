import React from 'react';

interface SearchTypeFilterProps {
  value: string;
  onChange: (value: string) => void;
}

const SearchTypeFilter: React.FC<SearchTypeFilterProps> = ({ value, onChange }) => {
  return (
    <div data-testid="search-type-filter">
      <button onClick={() => onChange('skills')} className={value === 'skills' ? 'active' : ''}>Skills</button>
      <button onClick={() => onChange('users')} className={value === 'users' ? 'active' : ''}>Users</button>
    </div>
  );
};

export default SearchTypeFilter;

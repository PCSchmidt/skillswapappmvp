import React from 'react';

import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';

import { cn } from '@/lib/utils';

interface SearchFilterProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Current search query string.
   */
  query: string;
  /**
   * Callback for when the search query changes.
   */
  onQueryChange: (query: string) => void;
  /**
   * Current selected category.
   */
  category: string;
  /**
   * Options for category selection.
   */
  categoryOptions: { value: string; label: string }[];
  /**
   * Callback for when the category changes.
   */
  onCategoryChange: (category: string) => void;
  /**
   * Current selected experience level.
   */
  experienceLevel: string;
  /**
   * Options for experience level selection.
   */
  experienceLevelOptions: { value: string; label: string }[];
  /**
   * Callback for when the experience level changes.
   */
  onExperienceLevelChange: (level: string) => void;
  /**
   * Callback for when the search filters are applied.
   */
  onApplyFilters: () => void;
  /**
   * Callback for when the filters are reset.
   */
  onResetFilters: () => void;
}

const SearchFilter = React.forwardRef<HTMLDivElement, SearchFilterProps>(
  (
    {
      query,
      onQueryChange,
      category,
      categoryOptions,
      onCategoryChange,
      experienceLevel,
      experienceLevelOptions,
      onExperienceLevelChange,
      onApplyFilters,
      onResetFilters,
      className,
      ...props
    },
    ref
  ) => {
    return (
      <Card ref={ref} className={cn('p-6', className)} {...props}>
        <div className="space-y-4">
          <Input
            type="text"
            placeholder="Search skills..."
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            className="w-full"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="Category"
              value={category}
              options={[{ value: '', label: 'All Categories' }, ...categoryOptions]}
              onChange={(e) => onCategoryChange(e.target.value)}
            />
            <Select
              label="Experience Level"
              value={experienceLevel}
              options={[{ value: '', label: 'All Levels' }, ...experienceLevelOptions]}
              onChange={(e) => onExperienceLevelChange(e.target.value)}
            />
          </div>

          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={onResetFilters}>
              Reset
            </Button>
            <Button onClick={onApplyFilters}>
              Apply Filters
            </Button>
          </div>
        </div>
      </Card>
    );
  }
);

SearchFilter.displayName = 'SearchFilter';

export { SearchFilter };

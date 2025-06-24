import React from 'react';
import { render } from '@testing-library/react';
import SupabaseProvider from '@/contexts/SupabaseContext';

// Example: wrap with all required providers
export function renderWithProviders(ui, { ...options } = {}) {
  // Wrap with SupabaseProvider for global Supabase mock
  return render(
    <SupabaseProvider>
      {ui}
    </SupabaseProvider>,
    options
  );
}

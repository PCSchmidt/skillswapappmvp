/**
 * Trade Proposal Form Component Tests
 * 
 * Tests for the component that allows users to propose a new trade
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import React from 'react';
import '@testing-library/jest-dom';
import TradeProposalForm from '@/components/trades/TradeProposalForm';
import { useSupabase } from '@/contexts/SupabaseContext';

// Mock the Supabase client
jest.mock('@/contexts/SupabaseContext', () => {
  const insertMock = jest.fn().mockReturnValue({
    select: jest.fn().mockReturnValue({
      single: jest.fn().mockResolvedValue({
        data: { id: 'new-trade-id' },
        error: null,
      }),
    }),
  });
  return {
    useSupabase: () => ({
      supabase: {
        from: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        insert: insertMock,
      },
      session: {
        user: { id: 'current-user-id', email: 'user@example.com' }
      },
      __insertMock: insertMock, // expose for per-test configuration
    }),
  };
});

// Mock the SkillSelect component
jest.mock('@/components/skills/SkillSelect', () => ({
  __esModule: true,
  default: ({
    selectedSkillId,
    onChange,
    label,
    isOffered = false,
  }: { selectedSkillId: string; onChange: (id: string) => void; label: string; isOffered?: boolean }) => (
    <div data-testid={`skill-select-${isOffered ? 'offered' : 'requested'}`}>
      <label>{label}</label>
      <select
        value={selectedSkillId || ''}
        onChange={(e) => onChange(e.target.value)}
        data-testid={`skill-select-input-${isOffered ? 'offered' : 'requested'}`}
      >
        <option value="">Select a skill</option>
        <option value="skill-123">Web Development</option>
        <option value="skill-456">Guitar Lessons</option>
        <option value="skill-789">Cooking Classes</option>
      </select>
    </div>
  ),
}));

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(() => ({
    push: jest.fn(),
  })),
}));

describe('TradeProposalForm', () => {
  const mockRequestedSkill = {
    id: 'skill-456',
    title: 'Guitar Lessons',
    user_id: 'recipient-user-id',
    description: 'Learn to play guitar',
    category: 'Music',
    experience_level: 'beginner',
    is_remote: false,
    availability: 'Weekends',
    is_offering: true,
  };
  const mockOnCancel = jest.fn();
  const mockOnSuccess = jest.fn();
  
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  it('renders form with skill selection and notes', () => {
    render(<TradeProposalForm requestedSkill={mockRequestedSkill} onCancel={mockOnCancel} onSuccess={mockOnSuccess} />);
    
    // Check that the form title is rendered
    expect(screen.getByText(/propose a trade/i)).toBeInTheDocument();
    
    // Check that both skill selects are rendered
    expect(screen.getByTestId('skill-select-offered')).toBeInTheDocument();
    expect(screen.getByTestId('skill-select-requested')).toBeInTheDocument();
    
    // Check that the notes field is rendered
    expect(screen.getByPlaceholderText(/add any details/i)).toBeInTheDocument();
    
    // Check that the submit button is rendered but disabled initially
    const submitButton = screen.getByRole('button', { name: /send proposal/i });
    expect(submitButton).toBeInTheDocument();
    expect(submitButton).toBeDisabled();
  });
  
  it('enables submit button when valid selections are made', () => {
    render(<TradeProposalForm requestedSkill={mockRequestedSkill} onCancel={mockOnCancel} onSuccess={mockOnSuccess} />);
    
    const offeredSkillSelect = screen.getByTestId('skill-select-input-offered');
    const requestedSkillSelect = screen.getByTestId('skill-select-input-requested');
    const submitButton = screen.getByRole('button', { name: /send proposal/i });
    
    // Initially the button should be disabled
    expect(submitButton).toBeDisabled();
    
    // Select the offered skill
    fireEvent.change(offeredSkillSelect, { target: { value: 'skill-123' } });
    
    // Button should still be disabled with only one skill selected
    expect(submitButton).toBeDisabled();
    
    // Select the requested skill
    fireEvent.change(requestedSkillSelect, { target: { value: 'skill-456' } });
    
    // Now the button should be enabled
    expect(submitButton).not.toBeDisabled();
    
    // Unselect the offered skill
    fireEvent.change(offeredSkillSelect, { target: { value: '' } });
    
    // Button should be disabled again
    expect(submitButton).toBeDisabled();
  });
  
  it('submits the trade proposal with correct data', async () => {
    const mockPush = jest.fn();
    (useRouter as unknown as jest.Mock).mockReturnValue({ push: mockPush });
    
    render(<TradeProposalForm requestedSkill={mockRequestedSkill} onCancel={mockOnCancel} onSuccess={mockOnSuccess} />);
    
    // Select the offered skill
    const offeredSkillSelect = screen.getByTestId('skill-select-input-offered');
    fireEvent.change(offeredSkillSelect, { target: { value: 'skill-123' } });
    
    // Select the requested skill
    const requestedSkillSelect = screen.getByTestId('skill-select-input-requested');
    fireEvent.change(requestedSkillSelect, { target: { value: 'skill-456' } });
    
    // Add notes
    const notesInput = screen.getByPlaceholderText(/add any details/i);
    fireEvent.change(notesInput, { target: { value: 'I can teach you web development in exchange for guitar lessons.' } });
    
    // Submit the form
    const submitButton = screen.getByRole('button', { name: /send proposal/i });
    fireEvent.click(submitButton);
    
    // Check that the trade was created with correct data
    await waitFor(() => {
      expect(useSupabase().supabase.from).toHaveBeenCalledWith('trades');
      expect(useSupabase().supabase.from('trades').insert).toHaveBeenCalledWith({
        proposer_user_id: 'current-user-id',
        recipient_user_id: 'recipient-user-id',
        offered_skill_id: 'skill-123',
        requested_skill_id: 'skill-456',
        status: 'proposed',
        notes: 'I can teach you web development in exchange for guitar lessons.',
      });
    });
    
    // Check that we navigate to the trade page
    expect(mockPush).toHaveBeenCalledWith('/trades/new-trade-id');
  });
  
  it('shows validation error when selecting same skill for offered and requested', () => {
    render(<TradeProposalForm requestedSkill={mockRequestedSkill} onCancel={mockOnCancel} onSuccess={mockOnSuccess} />);
    
    // Select the same skill for both
    const offeredSkillSelect = screen.getByTestId('skill-select-input-offered');
    const requestedSkillSelect = screen.getByTestId('skill-select-input-requested');
    
    fireEvent.change(offeredSkillSelect, { target: { value: 'skill-123' } });
    fireEvent.change(requestedSkillSelect, { target: { value: 'skill-123' } });
    
    // Should show an error message
    expect(screen.getByText(/cannot select the same skill/i)).toBeInTheDocument();
    
    // Submit button should be disabled
    const submitButton = screen.getByRole('button', { name: /send proposal/i });
    expect(submitButton).toBeDisabled();
  });
  
  it('handles error during trade creation', async () => {
    // Mock a failure
    (useSupabase() as unknown as SupabaseMock).__insertMock.mockReturnValueOnce({
      select: jest.fn().mockReturnValue({
        single: jest.fn().mockResolvedValue({
          data: null,
          error: new Error('Failed to create trade'),
        }),
      }),
    });
    render(<TradeProposalForm requestedSkill={mockRequestedSkill} onCancel={mockOnCancel} onSuccess={mockOnSuccess} />);
    // Select skills
    const offeredSkillSelect = screen.getByTestId('skill-select-input-offered');
    const requestedSkillSelect = screen.getByTestId('skill-select-input-requested');
    fireEvent.change(offeredSkillSelect, { target: { value: 'skill-123' } });
    fireEvent.change(requestedSkillSelect, { target: { value: 'skill-456' } });
    // Submit the form
    const submitButton = screen.getByRole('button', { name: /send proposal/i });
    fireEvent.click(submitButton);
    // Check that error message is displayed
    await waitFor(() => {
      expect(screen.getByText(/failed to create trade/i)).toBeInTheDocument();
    });
  });
});

// Add a type for the Supabase mock that includes __insertMock
interface SupabaseMock {
  supabase: {
    from: jest.Mock;
    select: jest.Mock;
    eq: jest.Mock;
    insert: jest.Mock;
  };
  session: {
    user: { id: string; email: string };
  };
  __insertMock: jest.Mock;
}

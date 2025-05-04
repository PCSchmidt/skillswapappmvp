/**
 * Trade Proposal Form Component Tests
 * 
 * Tests for the component that allows users to propose a new trade
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import TradeProposalForm from '@/components/trades/TradeProposalForm';

// Mock the Supabase client
jest.mock('@/contexts/SupabaseContext', () => ({
  useSupabase: () => ({
    supabase: {
      from: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      insert: jest.fn().mockReturnValue({
        select: jest.fn().mockReturnValue({
          single: jest.fn().mockResolvedValue({
            data: { id: 'new-trade-id' },
            error: null,
          }),
        }),
      }),
    },
    session: {
      user: { id: 'current-user-id', email: 'user@example.com' }
    },
  }),
}));

// Mock the SkillSelect component
jest.mock('@/components/skills/SkillSelect', () => ({
  __esModule: true,
  default: ({ 
    userId, 
    selectedSkillId, 
    onChange, 
    label, 
    isOffered = false 
  }: any) => (
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
  const mockRecipientUser = {
    id: 'recipient-user-id',
    full_name: 'Jane Doe',
    email: 'jane@example.com',
  };
  
  const mockOfferedSkill = {
    id: 'skill-123',
    title: 'Web Development',
    user_id: 'current-user-id',
  };
  
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  it('renders form with skill selection and notes', () => {
    render(<TradeProposalForm recipientUser={mockRecipientUser} />);
    
    // Check that the form title is rendered
    expect(screen.getByText(/propose a trade/i)).toBeInTheDocument();
    
    // Check that the recipient name is shown
    expect(screen.getByText(/Jane Doe/i)).toBeInTheDocument();
    
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
    render(<TradeProposalForm recipientUser={mockRecipientUser} />);
    
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
    const { useSupabase } = require('@/contexts/SupabaseContext');
    const { useRouter } = require('next/navigation');
    const mockPush = jest.fn();
    useRouter.mockReturnValue({ push: mockPush });
    
    render(<TradeProposalForm recipientUser={mockRecipientUser} />);
    
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
      expect(useSupabase().supabase.from().insert).toHaveBeenCalledWith({
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
    render(<TradeProposalForm recipientUser={mockRecipientUser} />);
    
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
  
  it('pre-selects skills when provided as props', () => {
    render(
      <TradeProposalForm 
        recipientUser={mockRecipientUser} 
        preSelectedOfferedSkillId="skill-123"
        preSelectedRequestedSkillId="skill-456"
      />
    );
    
    // Check that the skill selects have the correct values
    const offeredSkillSelect = screen.getByTestId('skill-select-input-offered');
    const requestedSkillSelect = screen.getByTestId('skill-select-input-requested');
    
    expect(offeredSkillSelect).toHaveValue('skill-123');
    expect(requestedSkillSelect).toHaveValue('skill-456');
    
    // Submit button should be enabled
    const submitButton = screen.getByRole('button', { name: /send proposal/i });
    expect(submitButton).not.toBeDisabled();
  });
  
  it('handles error during trade creation', async () => {
    // Mock a failure
    const { useSupabase } = require('@/contexts/SupabaseContext');
    useSupabase().supabase.from().insert().select().single = jest.fn().mockResolvedValue({
      data: null,
      error: new Error('Failed to create trade'),
    });
    
    render(<TradeProposalForm recipientUser={mockRecipientUser} />);
    
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

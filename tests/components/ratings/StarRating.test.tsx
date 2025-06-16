/**
 * Star Rating Component Tests
 * 
 * Tests for the star rating component
 */

import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import '@testing-library/jest-dom';
import StarRating from '@/components/ratings/StarRating';

// Mock component if it uses any external dependencies (like next/image)
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => {
    return <img {...props} src={props.src} alt={props.alt} />;
  },
}));

describe('StarRating', () => {
  it('should render in display-only mode correctly', () => {
    render(<StarRating rating={3.5} />);
    
    // There should be 5 stars total
    const stars = screen.getAllByTestId(/star-/);
    expect(stars).toHaveLength(5);
    
    // Check for filled and empty stars
    expect(screen.getByTestId('star-1')).toHaveAttribute('aria-label', 'Full Star');
    expect(screen.getByTestId('star-2')).toHaveAttribute('aria-label', 'Full Star');
    expect(screen.getByTestId('star-3')).toHaveAttribute('aria-label', 'Full Star');
    expect(screen.getByTestId('star-4')).toHaveAttribute('aria-label', 'Empty Star');
    expect(screen.getByTestId('star-5')).toHaveAttribute('aria-label', 'Empty Star');
  });
  
  it('should render in interactive mode correctly', () => {
    const handleChange = jest.fn();
    render(<StarRating rating={3} interactive={true} onChange={handleChange} />);
    
    // There should be 5 clickable stars
    const stars = screen.getAllByRole('button');
    expect(stars).toHaveLength(5);
    
    // The first 3 stars should be filled
    for (let i = 1; i <= 3; i++) {
      expect(screen.getByTestId(`star-${i}`)).toHaveAttribute('aria-label', 'Full Star');
    }

    // The last 2 stars should be empty
    for (let i = 4; i <= 5; i++) {
      expect(screen.getByTestId(`star-${i}`)).toHaveAttribute('aria-label', 'Empty Star');
    }
  });
  
  it('should call onChange when a star is clicked', () => {
    const handleChange = jest.fn();
    render(<StarRating rating={3} interactive={true} onChange={handleChange} />);
    
    // Click the 5th star
    const fifthStar = screen.getByTestId('star-5');
    fireEvent.click(fifthStar);
    
    // onChange should be called with 5
    expect(handleChange).toHaveBeenCalledWith(5);
  });
  
  it('should handle hover states correctly', () => {
    const handleChange = jest.fn();
    render(<StarRating rating={3} interactive={true} onChange={handleChange} />);
    
    // Hover over the 4th star
    const fourthStar = screen.getByTestId('star-4');
    fireEvent.mouseEnter(fourthStar);
    
    // The first 4 stars should appear filled (or highlighted)
    for (let i = 1; i <= 4; i++) {
      expect(screen.getByTestId(`star-${i}`)).toHaveClass('hover');
    }
    
    // The 5th star should not
    expect(screen.getByTestId('star-5')).not.toHaveClass('hover');
    
    // Mouse leave should reset hover state
    fireEvent.mouseLeave(fourthStar);
    for (let i = 1; i <= 5; i++) {
      expect(screen.getByTestId(`star-${i}`)).not.toHaveClass('hover');
    }
  });
  
  it('should apply custom size class when provided', () => {
    render(<StarRating rating={3} size="lg" />);

    const container = screen.getByRole('group');
    // Container spacing should correspond to large size
    expect(container).toHaveClass('space-x-2');
    // Stars should have the large size class
    expect(screen.getByTestId('star-1')).toHaveClass('w-6');
  });
  
  it('should not be interactive when disabled', () => {
    const handleChange = jest.fn();
    render(<StarRating rating={3} interactive={true} disabled={true} onChange={handleChange} />);
    
    // Click the 5th star
    const fifthStar = screen.getByTestId('star-5');
    fireEvent.click(fifthStar);
    
    // onChange should not be called
    expect(handleChange).not.toHaveBeenCalled();
    
    // The rating should not change
    expect(screen.getByTestId('star-3')).toHaveAttribute('aria-label', 'Full Star');
    expect(screen.getByTestId('star-4')).toHaveAttribute('aria-label', 'Empty Star');
  });
});

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

    const stars = screen.getAllByTestId(/star-/);
    expect(stars).toHaveLength(5);

    for (let i = 1; i <= 3; i++) {
      expect(screen.getByTestId(`star-${i}`)).toHaveClass('text-yellow-400');
    }
    for (let i = 4; i <= 5; i++) {
      expect(screen.getByTestId(`star-${i}`)).toHaveClass('text-gray-300');
    }
  });
  
  it('should render in interactive mode correctly', () => {
    const handleChange = jest.fn();
    render(<StarRating rating={3} interactive={true} onChange={handleChange} />);

    const stars = screen.getAllByRole('button');
    expect(stars).toHaveLength(5);

    for (let i = 1; i <= 3; i++) {
      expect(screen.getByTestId(`star-${i}`)).toHaveClass('text-yellow-400');
    }

    for (let i = 4; i <= 5; i++) {
      expect(screen.getByTestId(`star-${i}`)).toHaveClass('text-gray-300');
    }
  });
  
  it('should call onChange when a star is clicked', () => {
    const handleChange = jest.fn();
    render(<StarRating rating={3} interactive={true} onChange={handleChange} />);

    const fifthStar = screen.getByTestId('star-5');
    fireEvent.click(fifthStar);

    expect(handleChange).toHaveBeenCalledWith(5);
  });
  
  it('should handle hover states correctly', () => {
    const handleChange = jest.fn();
    render(<StarRating rating={3} interactive={true} onChange={handleChange} />);

    const fourthStar = screen.getByTestId('star-4');
    fireEvent.mouseEnter(fourthStar);

    for (let i = 1; i <= 4; i++) {
      expect(screen.getByTestId(`star-${i}`)).toHaveClass('text-yellow-400');
    }
    expect(screen.getByTestId('star-5')).toHaveClass('text-gray-300');

    const container = screen.getByTestId('rating-container');
    fireEvent.mouseLeave(container);
    expect(screen.getByTestId('star-4')).toHaveClass('text-gray-300');
  });
  
  it('should apply custom size class when provided', () => {
    render(<StarRating rating={3} size="lg" />);

    const star = screen.getByTestId('star-1');
    expect(star).toHaveClass('w-6');
    expect(star).toHaveClass('h-6');
  });
  
  it('should not be interactive when disabled', () => {
    const handleChange = jest.fn();
    render(<StarRating rating={3} interactive={true} disabled={true} onChange={handleChange} />);

    const fifthStar = screen.getByTestId('star-5');
    fireEvent.click(fifthStar);

    expect(handleChange).not.toHaveBeenCalled();
    expect(fifthStar).not.toHaveClass('cursor-pointer');
  });
});

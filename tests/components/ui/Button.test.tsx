import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import Button from '@/components/ui/Button';

describe('Button Component', () => {
  test('renders button with correct text', () => {
    render(<Button>Test Button</Button>);
    const buttonElement = screen.getByText('Test Button');
    expect(buttonElement).toBeInTheDocument();
  });

  test('calls onClick handler when clicked', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click Me</Button>);
    const buttonElement = screen.getByText('Click Me');
    fireEvent.click(buttonElement);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  test('applies primary variant styling by default', () => {
    render(<Button>Primary Button</Button>);
    const buttonElement = screen.getByText('Primary Button');
    expect(buttonElement).toHaveClass('bg-primary-600');
  });
  test('applies secondary variant styling when specified', () => {
    render(<Button variant="secondary">Secondary Button</Button>);
    const buttonElement = screen.getByText('Secondary Button');
    expect(buttonElement).toHaveClass('bg-secondary-600');
  });

  test('applies outline variant styling when specified', () => {
    render(<Button variant="outline">Outline Button</Button>);
    const buttonElement = screen.getByText('Outline Button');
    expect(buttonElement).toHaveClass('border');
  });

  test('disables button when disabled prop is true', () => {
    render(<Button disabled>Disabled Button</Button>);
    const buttonElement = screen.getByText('Disabled Button');
    expect(buttonElement).toBeDisabled();
    expect(buttonElement).toHaveClass('opacity-60');
  });

  test('applies size classes correctly', () => {
    render(<Button size="sm">Small Button</Button>);
    const smallButton = screen.getByText('Small Button');
    expect(smallButton).toHaveClass('px-3');
    expect(smallButton).toHaveClass('py-2');
    
    render(<Button size="lg">Large Button</Button>);
    const largeButton = screen.getByText('Large Button');
    expect(largeButton).toHaveClass('px-4');
    expect(largeButton).toHaveClass('py-2');
  });

  test('applies full width when fullWidth prop is true', () => {
    render(<Button fullWidth>Full Width Button</Button>);
    const buttonElement = screen.getByText('Full Width Button');
    expect(buttonElement).toHaveClass('w-full');
  });

  test('applies custom className when provided', () => {
    render(<Button className="custom-class">Custom Class Button</Button>);
    const buttonElement = screen.getByText('Custom Class Button');
    expect(buttonElement).toHaveClass('custom-class');
  });
});

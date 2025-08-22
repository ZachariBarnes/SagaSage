import React from 'react';
import { render, screen } from '@testing-library/react';
import App from '../App';

describe('SagaSage UI', () => {
  test('renders application heading', () => {
    render(<App />);
    // Expect the root component to contain the name of the application
    const heading = screen.getByText(/sagasage/i);
    expect(heading).toBeInTheDocument();
  });

  test('displays sign in button for unauthenticated users', () => {
    render(<App />);
    // The sign‑in button may have text "Sign In" or similar
    const signInButton = screen.getByRole('button', { name: /sign in/i });
    expect(signInButton).toBeInTheDocument();
  });
});
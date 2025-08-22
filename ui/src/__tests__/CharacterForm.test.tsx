import { render, screen, fireEvent } from '@testing-library/react';
import CharacterForm from '../components/CharacterForm';

describe('CharacterForm component', () => {
  it('renders the character form fields', () => {
    render(<CharacterForm />);
    // Expect input elements for character name and description to be present
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
  });

  it('allows toggling the privacy flag', () => {
    render(<CharacterForm />);
    const privacyToggle = screen.getByRole('checkbox', { name: /private/i });
    // Initially unchecked (public)
    expect(privacyToggle).not.toBeChecked();
    // Toggle to private
    fireEvent.click(privacyToggle);
    expect(privacyToggle).toBeChecked();
  });
});
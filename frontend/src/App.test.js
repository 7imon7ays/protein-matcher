import { render, screen } from '@testing-library/react';
import App from './App';

test('renders learn react link', () => {
  render(<App />);
  // TODO: Match placeholder text.
  const linkElement = screen.getByText(/DNA/i);
  expect(linkElement).toBeInTheDocument();
});

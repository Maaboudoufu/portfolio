import { render, screen } from '@testing-library/react';
import App from './App';

test('renders homepage', () => {
  render(<App />);
  const heading = screen.getByRole('heading', { name: /Jason Tsao/i });
  expect(heading).toBeInTheDocument();
});

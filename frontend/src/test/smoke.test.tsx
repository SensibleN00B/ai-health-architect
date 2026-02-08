import { render, screen } from '@testing-library/react';
import App from '../App';

test('renders bottom navigation', () => {
  render(<App />);
  expect(screen.getByText('person')).toBeInTheDocument();
});

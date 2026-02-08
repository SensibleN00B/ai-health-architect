import { screen } from '@testing-library/react';
import App from '../App';
import { renderWithUser } from './renderWithUser';

test('renders bottom navigation', () => {
  renderWithUser(<App />);
  expect(screen.getByText('person')).toBeInTheDocument();
});

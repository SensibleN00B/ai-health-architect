import { screen } from '@testing-library/react';
import { renderWithUser } from '../test/renderWithUser';
import Profile from './Profile';

vi.mock('../services/api', () => ({
  users: { updateProfile: vi.fn() },
}));

test('Profile pre-fills from user context', () => {
  renderWithUser(<Profile />, {
    telegram_id: 1,
    id: 1,
    age: 30,
    weight: 75,
    height: 180,
    goal: 'cut',
  });

  expect(screen.getByPlaceholderText('Age')).toHaveValue(30);
  expect(screen.getByPlaceholderText('Weight (kg)')).toHaveValue(75);
  expect(screen.getByPlaceholderText('Height (cm)')).toHaveValue(180);
  expect(screen.getByPlaceholderText('e.g. Muscle Gain, Weight Loss')).toHaveValue('cut');
});

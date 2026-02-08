import { waitFor } from '@testing-library/react';
import { renderWithUser } from '../test/renderWithUser';
import Workouts from './Workouts';
import { workouts } from '../services/api';

vi.mock('../services/api', () => ({
  workouts: {
    getAll: vi.fn().mockResolvedValue([]),
    create: vi.fn(),
  },
}));

test('Workouts loads list for user', async () => {
  renderWithUser(<Workouts />, { telegram_id: 1, id: 42 });

  await waitFor(() => {
    expect(vi.mocked(workouts.getAll)).toHaveBeenCalledWith(42);
  });
});

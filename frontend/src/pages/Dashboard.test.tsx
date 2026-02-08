import { waitFor } from '@testing-library/react';
import { renderWithUser } from '../test/renderWithUser';
import Dashboard from './Dashboard';
import { stats } from '../services/api';

vi.mock('../services/api', () => ({
  stats: {
    getUserStats: vi.fn().mockResolvedValue({}),
    getHistory: vi.fn().mockResolvedValue([]),
  },
  health: { getWeightHistory: vi.fn().mockResolvedValue([]) },
}));

test('Dashboard loads stats using user context', async () => {
  renderWithUser(<Dashboard />, { telegram_id: 1, id: 1, username: 'alex' });

  await waitFor(() => {
    expect(vi.mocked(stats.getUserStats)).toHaveBeenCalledWith(1);
    expect(vi.mocked(stats.getHistory)).toHaveBeenCalledWith(1);
  });
});

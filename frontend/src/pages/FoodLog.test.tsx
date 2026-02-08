import { waitFor } from '@testing-library/react';
import { renderWithUser } from '../test/renderWithUser';
import FoodLog from './FoodLog';
import { meals } from '../services/api';

vi.mock('../services/api', () => ({
  analyzeFood: vi.fn(),
  meals: {
    getAll: vi.fn().mockResolvedValue([]),
    create: vi.fn(),
  },
}));

test('FoodLog loads meals for user', async () => {
  renderWithUser(<FoodLog />, { telegram_id: 1, id: 1 });

  await waitFor(() => {
    expect(vi.mocked(meals.getAll)).toHaveBeenCalledWith(1);
  });
});

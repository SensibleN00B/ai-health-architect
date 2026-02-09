import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithUser } from '../test/renderWithUser';
import AIChat from './AIChat';
import { chat } from '../services/api';

vi.mock('../services/api', () => ({
  chat: vi.fn().mockResolvedValue('ok'),
}));

test('AIChat sends message with api client', async () => {
  renderWithUser(<AIChat />, { telegram_id: 1, id: 1 });

  const input = screen.getByPlaceholderText('Запитати AI...');
  await userEvent.type(input, 'hi');
  await userEvent.click(screen.getByRole('button'));

  await waitFor(() => {
    expect(vi.mocked(chat)).toHaveBeenCalledWith(1, 'hi');
  });
});

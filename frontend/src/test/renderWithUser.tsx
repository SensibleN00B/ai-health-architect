import { ReactNode } from 'react';
import { render } from '@testing-library/react';
import { UserProvider } from '../context/UserContext';
import { User } from '../services/api';

export function renderWithUser(ui: ReactNode, user?: User) {
  return render(<UserProvider initialUser={user}>{ui}</UserProvider>);
}

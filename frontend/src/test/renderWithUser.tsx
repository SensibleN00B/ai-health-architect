import { ReactNode } from 'react';
import { render } from '@testing-library/react';

export function renderWithUser(ui: ReactNode) {
  return render(<>{ui}</>);
}

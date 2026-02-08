import { render, screen } from '@testing-library/react';
import { UserProvider, useUser } from './UserContext';

function Probe() {
  const { user, loading } = useUser();
  if (loading) return <div>loading</div>;
  return <div>{user?.telegram_id}</div>;
}

test('UserProvider renders user after sync', async () => {
  render(
    <UserProvider initialUser={{ telegram_id: 1, id: 1 }}>
      <Probe />
    </UserProvider>
  );
  expect(await screen.findByText('1')).toBeInTheDocument();
});

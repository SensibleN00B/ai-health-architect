import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from 'react';
import { users, type User } from '../services/api';
import { useTelegramWebApp } from '../hooks/useTelegramWebApp';

type UserContextValue = {
  user: User | null;
  loading: boolean;
  error: string | null;
  setUser: (user: User | null) => void;
};

const UserContext = createContext<UserContextValue | undefined>(undefined);

export function UserProvider({
  children,
  initialUser,
}: {
  children: ReactNode;
  initialUser?: User;
}) {
  const { user: telegramUser } = useTelegramWebApp();
  const [user, setUser] = useState<User | null>(initialUser ?? null);
  const [loading, setLoading] = useState<boolean>(!!telegramUser && !initialUser);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function syncUser() {
      if (!telegramUser) return;
      setLoading(true);
      setError(null);

      try {
        const synced = await users.sync({
          telegram_id: telegramUser.id,
          username: telegramUser.username,
        });
        if (active) setUser(synced);
      } catch {
        if (active) setError('Failed to sync user');
      } finally {
        if (active) setLoading(false);
      }
    }

    syncUser();
    return () => {
      active = false;
    };
  }, [telegramUser]);

  const value = useMemo(() => ({ user, loading, error, setUser }), [user, loading, error]);

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useUser() {
  const ctx = useContext(UserContext);
  if (!ctx) {
    throw new Error('useUser must be used within UserProvider');
  }
  return ctx;
}

import { useEffect, useState } from 'react';

interface TelegramWebApp {
    initData: string;
    initDataUnsafe: {
        user?: {
            id: number;
            first_name: string;
            last_name?: string;
            username?: string;
            language_code?: string;
        };
    };
    ready: () => void;
    expand: () => void;
    MainButton: {
        text: string;
        color: string;
        textColor: string;
        isVisible: boolean;
        isActive: boolean;
        show: () => void;
        hide: () => void;
        onClick: (callback: () => void) => void;
    };
    setBackgroundColor: (color: string) => void;
    setHeaderColor: (color: string) => void;
}

declare global {
    interface Window {
        Telegram?: {
            WebApp: TelegramWebApp;
        };
    }
}

export function useTelegramWebApp() {
    const [webApp, setWebApp] = useState<TelegramWebApp | null>(null);
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        const tg = window.Telegram?.WebApp;
        if (tg) {
            tg.ready();
            tg.expand();
            tg.setBackgroundColor('#031716');
            tg.setHeaderColor('secondary_bg_color');

            setWebApp(tg);
            setUser(tg.initDataUnsafe.user);
        }
    }, []);

    return { webApp, user, isInTelegram: !!webApp };
}

"use client";

import { useEffect, useState } from 'react';
import sdk, { type Context } from '@farcaster/frame-sdk';

export interface FarcasterUser {
  username?: string;
  pfpUrl?: string;
  fid?: number;
  displayName?: string;
  verifications?: string[];
  bio?: string;
}

export function useFarcaster() {
  const [user, setUser] = useState<FarcasterUser | null>(null);
  const [context, setContext] = useState<Context.MiniAppContext | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const init = async () => {
      // Check if running in development mode
      const isDev = process.env.NODE_ENV === 'development';

      if (isDev) {
        // Mock data for development
        setUser({
          username: 'builder',
          pfpUrl: 'https://github.com/shadcn.png', // Placeholder image
          fid: 123456,
          displayName: 'Builder',
          verifications: ['0x123...456'],
        });
        setContext({
            user: {
                fid: 123456,
                username: 'builder',
                displayName: 'Builder',
                pfpUrl: 'https://github.com/shadcn.png',
            }
        } as unknown as Context.MiniAppContext);
      } else {
        // Initialize SDK
        setContext(await sdk.context);
        sdk.actions.ready();
      }
      setIsLoaded(true);
    };

    if (!isLoaded) {
      init();
    }
  }, [isLoaded]);

  useEffect(() => {
    if (context && context.user && !user && process.env.NODE_ENV !== 'development') {
      setUser({
        username: context.user.username,
        pfpUrl: context.user.pfpUrl,
        fid: context.user.fid,
        displayName: context.user.displayName,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [context]);

  return { user, context, isLoaded };
}

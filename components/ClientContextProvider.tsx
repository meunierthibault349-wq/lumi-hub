'use client';
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { CLIENT_CONTEXTS, ClientContextData } from '@/lib/client-contexts';

interface ClientCtxValue {
  activeClient: ClientContextData | null;
  setActiveClient: (client: ClientContextData | null) => void;
}

const ClientCtx = createContext<ClientCtxValue>({
  activeClient: null,
  setActiveClient: () => {},
});

export function ClientContextProvider({ children }: { children: ReactNode }) {
  const [activeClient, setActiveClientState] = useState<ClientContextData | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('lumi_active_client');
    if (saved && CLIENT_CONTEXTS[saved]) {
      setActiveClientState(CLIENT_CONTEXTS[saved]);
    }
  }, []);

  function setActiveClient(client: ClientContextData | null) {
    setActiveClientState(client);
    if (client) {
      localStorage.setItem('lumi_active_client', client.ref);
    } else {
      localStorage.removeItem('lumi_active_client');
    }
  }

  return (
    <ClientCtx.Provider value={{ activeClient, setActiveClient }}>
      {children}
    </ClientCtx.Provider>
  );
}

export function useClientContext() {
  return useContext(ClientCtx);
}

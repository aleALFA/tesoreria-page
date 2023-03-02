import { createContext, useContext, useState } from "react";

import Session from "../../domain/model/session";

interface AccessContextService {
  token: string,
  setToken: React.Dispatch<React.SetStateAction<string>>
}

const INIT_VALUE: AccessContextService = {
  token: Session.loadFromStorage()?.access?.token || '',
  setToken: () => {},
};

const AccessContext = createContext<AccessContextService>(INIT_VALUE);

function AccessProvider({ children }: {children: React.ReactNode}) {
  const [token, setToken] = useState(INIT_VALUE.token);

  return (
    <AccessContext.Provider value={{ token, setToken }}>
      { children }
    </AccessContext.Provider>
  );
};

function useAccess() {
  return useContext(AccessContext);
}
function useAccessToken() {
  const { token } = useContext(AccessContext);
  return `Bearer ${token}`;
}

export { AccessContext, AccessProvider, useAccess, useAccessToken };
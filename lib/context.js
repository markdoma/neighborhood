import { createContext } from 'react';

export const UserContext = createContext({
  user: null,
  details: false,
});

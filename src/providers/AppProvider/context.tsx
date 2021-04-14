import { createContext, useContext } from 'react';
import { IState } from './reducer';

export interface ContextType {
  state: IState;
  actions: {
    login: Function;
    logout: Function;
  };
}

export const AppContext = createContext({});

export const useApp = () => {
  const context = useContext(AppContext) as ContextType;
  if (!context) {
    throw new Error('No context provided');
  }
  return context;
};

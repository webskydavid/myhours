import { createContext, useContext } from 'react';
import { IState } from './reducer';

export interface ContextType {
  state: IState;
  actions: {
    list: Function;
    insert: Function;
  };
}

export const Context = createContext({});

export const useEventList = () => {
  const context = useContext(Context) as ContextType;
  if (!context) {
    throw new Error('No context provided');
  }
  return context;
};

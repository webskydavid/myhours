import { createContext, useContext } from 'react';
import { IState } from './reducer';

export interface ContextType {
  state: IState;
  actions: {
    list: () => void;
    calendarList: () => void;
    remove: (eventId: string) => void;
    insert: (command: string) => void;
    insertCalendar: () => void;
    nextMonth: () => void;
    prevMonth: () => void;
    setCalendarId: (id: string) => void;
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

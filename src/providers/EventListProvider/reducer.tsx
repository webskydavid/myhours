import { IEvent } from '../../models/event';
import { logger } from '../logger';

export interface IState {
  loading: boolean;
  error: Error | null;
  items: IEvent[];
  calendarList: any[];
  currentDate: Date;
  month: number;
  calendarId: string;
}

export interface IReducer {
  type: string;
  payload?: any;
}

const newDate = new Date();

export const initialState = {
  loading: false,
  error: null,
  items: [],
  calendarList: [],
  currentDate: newDate,
  month: newDate.getMonth(),
  calendarId: localStorage.getItem('calendarId') || '',
};

export const reducer = (state: IState, action: IReducer): IState => {
  const { type, payload } = action;
  logger('EventListProvider reducer:', state, type, action);

  switch (type) {
    case 'LOADING':
      return { ...state, loading: true };
    case 'RESPONSE':
      return { ...state, loading: false, items: payload };
    case 'RESPONSE_CALENDAR':
      return { ...state, loading: false, calendarList: payload };
    case 'LOADING_CALENDAR_LIST':
      return { ...state, loading: true };
    case 'REMOVE':
      return { ...state, loading: true };
    case 'RESPONSE_REMOVE':
      return { ...state, loading: false, items: payload };
    case 'INSERT':
      return { ...state, loading: true };
    case 'RESPONSE_INSERT':
      return { ...state, loading: false, items: payload };
    case 'INSERT_CALENDAR':
      return { ...state, loading: true };
    case 'RESPONSE_INSERT_CALENDAR':
      return { ...state, loading: false };
    case 'ERROR':
      return { ...state, error: payload, loading: false };
    case 'CHANGE_DATE': {
      const { currentDate, month } = payload;
      return { ...state, currentDate, month };
    }
    case 'SET_CALENDAR_ID':
      return { ...state, calendarId: payload };
    default:
      throw new Error(`Unhandled action: ${type}`);
  }
};
